package com.invoice.demo.invoice.dto;

import java.math.BigDecimal;
import java.time.Instant;

public record CreateInvoiceResponse(
        Long id,
        String itemName,
        BigDecimal quantity,
        String unit,
        boolean requiresDeposit,
        String status,
        Instant createdAt
) {
}
