package com.invoice.demo.bill.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.Instant;

public record CreateBillRequest(
        @NotNull(message = "Invoice id is required")
        Long invoiceId,
        @NotNull(message = "Total amount is required")
        @DecimalMin(value = "0.01", message = "Total amount must be greater than 0")
        BigDecimal totalAmount,
        @NotNull(message = "Deadline is required")
        @Future(message = "Deadline must be in the future")
        Instant deadline,
        String attachmentName
) {
}
