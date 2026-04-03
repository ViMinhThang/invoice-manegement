package com.invoice.demo.invoice.service;

import com.invoice.demo.invoice.dto.CreateInvoiceRequest;
import com.invoice.demo.invoice.dto.CreateInvoiceResponse;
import com.invoice.demo.invoice.dto.InvoiceResponse;
import com.invoice.demo.invoice.entity.Invoice;
import com.invoice.demo.invoice.repository.InvoiceRepository;
import java.time.Instant;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class InvoiceService {
    public static final String STATUS_OPEN = "Open";
    public static final String STATUS_AWAITING_PAYMENT = "Awaiting Payment";
    public static final String STATUS_COMPLETED_INVOICED = "Completed/Invoiced";

    private final InvoiceRepository invoiceRepository;

    public List<InvoiceResponse> getAllInvoices() {
        return invoiceRepository.findAll().stream()
                .map(this::toResponse)
                .toList();
    }

    public List<InvoiceResponse> getAwaitingPaymentInvoices() {
        return invoiceRepository.findByStatusOrderByIssuedAtDesc(STATUS_AWAITING_PAYMENT).stream()
                .map(this::toResponse)
                .toList();
    }

    public CreateInvoiceResponse create(CreateInvoiceRequest request) {
        Instant now = Instant.now();
        Invoice invoice = Invoice.builder()
                .invoiceNumber(generateInvoiceNumber())
                .customerName(request.itemName())
                .totalAmount(request.quantity())
                .unit(request.unit())
                .requiresDeposit(request.requiresDeposit())
                .status(STATUS_OPEN)
                .issuedAt(now)
                .build();

        Invoice savedInvoice = invoiceRepository.save(invoice);
        return new CreateInvoiceResponse(
                savedInvoice.getId(),
                request.itemName(),
                request.quantity(),
                request.unit(),
                request.requiresDeposit(),
                savedInvoice.getStatus(),
                now
        );
    }

    @Transactional
    public InvoiceResponse confirmPaid(Long invoiceId) {
        Invoice invoice = invoiceRepository.findById(invoiceId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Invoice not found"));

        if (!STATUS_AWAITING_PAYMENT.equals(invoice.getStatus())) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Only invoices in Awaiting Payment status can be confirmed as paid"
            );
        }

        invoice.setStatus(STATUS_COMPLETED_INVOICED);
        Invoice updated = invoiceRepository.save(invoice);
        return toResponse(updated);
    }

    private InvoiceResponse toResponse(Invoice invoice) {
        return new InvoiceResponse(
                invoice.getId(),
                invoice.getInvoiceNumber(),
                invoice.getCustomerName(),
                invoice.getTotalAmount(),
                invoice.getStatus(),
                invoice.getIssuedAt()
        );
    }

    private String generateInvoiceNumber() {
        return "INV-" + UUID.randomUUID().toString().replace("-", "").substring(0, 12).toUpperCase();
    }
}
