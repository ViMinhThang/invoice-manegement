package com.invoice.demo.purchaseRequest.dto;

import java.math.BigDecimal;

public record CreatePurchaseRequest(
        String itemName,
        BigDecimal quantity,
        String unit,
        boolean requiresDeposit
) {
}
