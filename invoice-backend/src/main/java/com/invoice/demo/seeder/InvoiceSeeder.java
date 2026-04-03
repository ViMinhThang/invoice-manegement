package com.invoice.demo.seeder;

import com.invoice.demo.invoice.entity.Invoice;
import com.invoice.demo.invoice.repository.InvoiceRepository;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class InvoiceSeeder implements CommandLineRunner {
    private final InvoiceRepository invoiceRepository;

    @Override
    public void run(String... args) {
        invoiceRepository.deleteAll();

        Instant now = Instant.now();
        List<Invoice> invoices = List.of(
                invoice("INV-1001", "An Nguyen", "1250.00", "Open", now.minus(10, ChronoUnit.DAYS)),
                invoice("INV-1002", "Binh Tran", "980.50", "Paid", now.minus(9, ChronoUnit.DAYS)),
                invoice("INV-1003", "Chi Le", "432.75", "Open", now.minus(8, ChronoUnit.DAYS)),
                invoice("INV-1004", "Dung Pham", "1500.00", "Overdue", now.minus(7, ChronoUnit.DAYS)),
                invoice("INV-1005", "Gia Hoang", "220.00", "Paid", now.minus(6, ChronoUnit.DAYS)),
                invoice("INV-1006", "Huy Vu", "875.20", "Open", now.minus(5, ChronoUnit.DAYS)),
                invoice("INV-1007", "Khanh Do", "640.00", "Open", now.minus(4, ChronoUnit.DAYS)),
                invoice("INV-1008", "Linh Bui", "3000.99", "Paid", now.minus(3, ChronoUnit.DAYS)),
                invoice("INV-1009", "Minh Truong", "510.10", "Overdue", now.minus(2, ChronoUnit.DAYS)),
                invoice("INV-1010", "Nhi Vo", "199.99", "Open", now.minus(1, ChronoUnit.DAYS))
        );

        invoiceRepository.saveAll(invoices);
    }

    private Invoice invoice(String invoiceNumber, String customerName, String amount, String status, Instant issuedAt) {
        return Invoice.builder()
                .invoiceNumber(invoiceNumber)
                .customerName(customerName)
                .totalAmount(new BigDecimal(amount))
                .status(status)
                .issuedAt(issuedAt)
                .build();
    }
}
