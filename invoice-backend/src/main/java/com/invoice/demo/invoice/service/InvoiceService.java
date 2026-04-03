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
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class InvoiceService {
    private final InvoiceRepository invoiceRepository;

    public List<InvoiceResponse> getAllInvoices() {
        return invoiceRepository.findAll().stream()
                .map(this::toResponse)
                .toList();
    }

    public CreateInvoiceResponse create(CreateInvoiceRequest request) {
        Instant now = Instant.now();
        Invoice invoice = Invoice.builder()
                .invoiceNumber(generateInvoiceNumber())
                .customerName(request.itemName())
                .totalAmount(request.quantity())
                .status("Open")
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
