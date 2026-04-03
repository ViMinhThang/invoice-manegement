package com.invoice.demo.seeder;

import com.invoice.demo.bill.entity.Bill;
import com.invoice.demo.bill.repository.BillRepository;
import com.invoice.demo.invoice.entity.Invoice;
import com.invoice.demo.invoice.repository.InvoiceRepository;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Comparator;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Order(2)
public class BillSeeder implements CommandLineRunner {
    private static final String STATUS_AWAITING_PAYMENT = "Awaiting Payment";

    private final BillRepository billRepository;
    private final InvoiceRepository invoiceRepository;

    @Override
    public void run(String... args) {
        billRepository.deleteAll();

        List<Invoice> invoices = invoiceRepository.findAll().stream()
                .sorted(Comparator.comparing(Invoice::getId))
                .limit(5)
                .toList();

        if (invoices.isEmpty()) {
            return;
        }

        Instant now = Instant.now();
        for (int i = 0; i < invoices.size(); i++) {
            Invoice invoice = invoices.get(i);
            invoice.setStatus(STATUS_AWAITING_PAYMENT);
            Invoice savedInvoice = invoiceRepository.save(invoice);
            Bill bill = Bill.builder()
                    .invoice(savedInvoice)
                    .totalAmount(savedInvoice.getTotalAmount())
                    .deadline(now.plus(i + 2L, ChronoUnit.DAYS))
                    .attachmentName("seed-bill-" + savedInvoice.getInvoiceNumber() + ".pdf")
                    .attachmentPath("seed-" + savedInvoice.getInvoiceNumber() + ".pdf")
                    .createdAt(now.minus(i + 1L, ChronoUnit.HOURS))
                    .build();
            billRepository.save(bill);
        }
    }
}
