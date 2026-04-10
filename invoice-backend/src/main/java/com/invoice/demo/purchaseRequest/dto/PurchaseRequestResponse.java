package com.invoice.demo.purchaseRequest.dto;

import java.math.BigDecimal;
import java.time.Instant;

public record PurchaseRequestResponse(
                Long id,
                String invoiceNumber,
                String customerName,
                String itemName,
                BigDecimal totalAmount,
                String status,
                Instant issuedAt) {
}
