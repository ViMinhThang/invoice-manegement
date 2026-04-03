package com.invoice.demo.purchaseRequest.dto;

import java.math.BigDecimal;
import java.time.Instant;

public record CreatePurchaseResponse(
        Long id,
        String itemName,
        BigDecimal quantity,
        String unit,
        boolean requiresDeposit,
        String status,
        Instant createdAt
) {
}
