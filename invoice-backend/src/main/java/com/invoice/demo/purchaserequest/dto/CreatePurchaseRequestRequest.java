package com.invoice.demo.purchaserequest.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public record CreatePurchaseRequestRequest(
        @NotBlank(message = "Item name is required")
        String itemName,
        @NotNull(message = "Quantity is required")
        @DecimalMin(value = "0.01", message = "Quantity must be greater than 0")
        BigDecimal quantity,
        @NotBlank(message = "Unit is required")
        String unit,
        boolean requiresDeposit
) {
}
