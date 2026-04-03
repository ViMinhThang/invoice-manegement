package com.invoice.demo.bill.dto;

import java.math.BigDecimal;
import java.time.Instant;

public record BillListResponse(
        Long id,
        Long invoiceId,
        String invoiceNumber,
        String customerName,
        BigDecimal totalAmount,
        Instant deadline,
        String attachmentName,
        String attachmentPath,
        Instant createdAt,
        String invoiceStatus
) {
}
