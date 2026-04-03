package com.invoice.demo.bill.dto;

import java.math.BigDecimal;
import java.time.Instant;

public record CreateBillResponse(
        Long id,
        Long invoiceId,
        String invoiceNumber,
        BigDecimal totalAmount,
        Instant deadline,
        String attachmentName,
        String attachmentPath,
        Instant createdAt,
        String invoiceStatus
) {
}
