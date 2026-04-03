package com.invoice.demo.purchaserequest.dto;

import com.invoice.demo.purchaserequest.entity.PurchaseRequestStatus;
import java.math.BigDecimal;
import java.time.Instant;

public record PurchaseRequestResponse(
        Long id,
        String itemName,
        BigDecimal quantity,
        String unit,
        boolean requiresDeposit,
        PurchaseRequestStatus status,
        Instant createdAt
) {
}
