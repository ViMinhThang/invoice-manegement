package com.invoice.demo.invoice.dto;

import java.math.BigDecimal;
import java.time.Instant;

public record InvoiceResponse(
        Long id,
        String invoiceNumber,
        String customerName,
        BigDecimal totalAmount,
        String status,
        Instant issuedAt
) {
}
