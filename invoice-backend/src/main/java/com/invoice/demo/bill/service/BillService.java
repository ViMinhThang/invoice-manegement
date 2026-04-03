package com.invoice.demo.bill.service;

import com.invoice.demo.bill.dto.BillListResponse;
import com.invoice.demo.bill.dto.CreateBillRequest;
import com.invoice.demo.bill.dto.CreateBillResponse;
import com.invoice.demo.bill.entity.Bill;
import com.invoice.demo.bill.repository.BillRepository;
import com.invoice.demo.invoice.entity.Invoice;
import com.invoice.demo.invoice.repository.InvoiceRepository;
import com.invoice.demo.invoice.service.InvoiceService;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.Instant;
import java.util.Locale;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class BillService {
    private static final Set<String> ALLOWED_EXTENSIONS = Set.of(".png", ".jpg", ".jpeg", ".gif", ".webp", ".pdf");

    private final BillRepository billRepository;
    private final InvoiceRepository invoiceRepository;
    @Value("${app.storage.bill-dir:uploads/bills}")
    private String billUploadDir;

    @Transactional(readOnly = true)
    public List<BillListResponse> getAllBills() {
        return billRepository.findAllWithInvoiceOrderByCreatedAtDesc().stream()
                .map(this::toListResponse)
                .toList();
    }

    @Transactional
    public CreateBillResponse create(CreateBillRequest request, MultipartFile attachmentFile) {
        Invoice invoice = invoiceRepository.findById(request.invoiceId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Invoice not found"));

        if (billRepository.existsByInvoiceId(request.invoiceId())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Bill already exists for this invoice");
        }

        StoredAttachment storedAttachment = storeAttachment(invoice.getId(), attachmentFile);
        Instant now = Instant.now();
        Bill bill = Bill.builder()
                .invoice(invoice)
                .totalAmount(request.totalAmount())
                .deadline(request.deadline())
                .attachmentName(storedAttachment.attachmentName())
                .attachmentPath(storedAttachment.attachmentPath())
                .createdAt(now)
                .build();

        Bill savedBill = billRepository.save(bill);

        invoice.setStatus(InvoiceService.STATUS_AWAITING_PAYMENT);
        invoiceRepository.save(invoice);

        return new CreateBillResponse(
                savedBill.getId(),
                invoice.getId(),
                invoice.getInvoiceNumber(),
                savedBill.getTotalAmount(),
                savedBill.getDeadline(),
                savedBill.getAttachmentName(),
                savedBill.getAttachmentPath(),
                savedBill.getCreatedAt(),
                invoice.getStatus()
        );
    }

    private BillListResponse toListResponse(Bill bill) {
        Invoice invoice = bill.getInvoice();
        return new BillListResponse(
                bill.getId(),
                invoice.getId(),
                invoice.getInvoiceNumber(),
                invoice.getCustomerName(),
                bill.getTotalAmount(),
                bill.getDeadline(),
                bill.getAttachmentName(),
                bill.getAttachmentPath(),
                bill.getCreatedAt(),
                invoice.getStatus()
        );
    }

    private StoredAttachment storeAttachment(Long invoiceId, MultipartFile attachmentFile) {
        if (attachmentFile == null || attachmentFile.isEmpty()) {
            return new StoredAttachment(null, null);
        }

        String originalFilename = attachmentFile.getOriginalFilename();
        String safeFilename = sanitizeFilename(originalFilename);
        String extension = extractExtension(safeFilename);
        if (!ALLOWED_EXTENSIONS.contains(extension)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Only image and PDF files are allowed");
        }

        Path uploadRoot = Paths.get(billUploadDir).toAbsolutePath().normalize();
        try {
            Files.createDirectories(uploadRoot);
            String storedFilename = "invoice-" + invoiceId + "-" + UUID.randomUUID() + extension;
            Path target = uploadRoot.resolve(storedFilename).normalize();
            if (!target.startsWith(uploadRoot)) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid attachment path");
            }

            try (InputStream inputStream = attachmentFile.getInputStream()) {
                Files.copy(inputStream, target, StandardCopyOption.REPLACE_EXISTING);
            }
            return new StoredAttachment(safeFilename, storedFilename);
        } catch (IOException exception) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Cannot save attachment", exception);
        }
    }

    private String sanitizeFilename(String fileName) {
        if (fileName == null || fileName.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Attachment file name is required");
        }
        return Paths.get(fileName).getFileName().toString();
    }

    private String extractExtension(String fileName) {
        int lastDot = fileName.lastIndexOf('.');
        if (lastDot < 0 || lastDot == fileName.length() - 1) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Attachment must include a valid extension");
        }
        return fileName.substring(lastDot).toLowerCase(Locale.ROOT);
    }

    private record StoredAttachment(String attachmentName, String attachmentPath) {
    }
}
