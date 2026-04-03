package com.invoice.demo.seeder;

import com.invoice.demo.bill.entity.Bill;
import com.invoice.demo.bill.repository.BillRepository;
import com.invoice.demo.purchaseRequest.entity.PurchaseRequest;
import com.invoice.demo.purchaseRequest.repository.PurchaseRequestRepository;
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
    private final PurchaseRequestRepository purchaseRequestRepository;

    @Override
    public void run(String... args) {
        billRepository.deleteAll();

        List<PurchaseRequest> purchaseRequests = purchaseRequestRepository.findAll().stream()
                .sorted(Comparator.comparing(PurchaseRequest::getId))
                .limit(5)
                .toList();

        if (purchaseRequests.isEmpty()) {
            return;
        }

        Instant now = Instant.now();
        for (int i = 0; i < purchaseRequests.size(); i++) {
            PurchaseRequest purchaseRequest = purchaseRequests.get(i);
            purchaseRequest.setStatus(STATUS_AWAITING_PAYMENT);
            PurchaseRequest saved = purchaseRequestRepository.save(purchaseRequest);
            Bill bill = Bill.builder()
                    .purchaseRequest(saved)
                    .totalAmount(saved.getTotalAmount())
                    .deadline(now.plus(i + 2L, ChronoUnit.DAYS))
                    .attachmentName("seed-bill-" + saved.getInvoiceNumber() + ".pdf")
                    .attachmentPath("seed-" + saved.getInvoiceNumber() + ".pdf")
                    .createdAt(now.minus(i + 1L, ChronoUnit.HOURS))
                    .build();
            billRepository.save(bill);
        }
    }
}
