package com.invoice.demo.seeder;

import com.invoice.demo.purchaseRequest.entity.PurchaseRequest;
import com.invoice.demo.purchaseRequest.repository.PurchaseRequestRepository;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Order(1)
public class PurchaseRequestSeeder implements CommandLineRunner {
    private final PurchaseRequestRepository purchaseRequestRepository;

    @Override
    public void run(String... args) {
        purchaseRequestRepository.deleteAll();

        Instant now = Instant.now();
        List<PurchaseRequest> purchaseRequests = List.of(
                purchaseRequest("PUR-1001", "An Nguyen", "1250.00", "Open", now.minus(10, ChronoUnit.DAYS)),
                purchaseRequest("PUR-1002", "Binh Tran", "980.50", "Paid", now.minus(9, ChronoUnit.DAYS)),
                purchaseRequest("PUR-1003", "Chi Le", "432.75", "Open", now.minus(8, ChronoUnit.DAYS)),
                purchaseRequest("PUR-1004", "Dung Pham", "1500.00", "Overdue", now.minus(7, ChronoUnit.DAYS)),
                purchaseRequest("PUR-1005", "Gia Hoang", "220.00", "Paid", now.minus(6, ChronoUnit.DAYS)),
                purchaseRequest("PUR-1006", "Huy Vu", "875.20", "Open", now.minus(5, ChronoUnit.DAYS)),
                purchaseRequest("PUR-1007", "Khanh Do", "640.00", "Open", now.minus(4, ChronoUnit.DAYS)),
                purchaseRequest("PUR-1008", "Linh Bui", "3000.99", "Paid", now.minus(3, ChronoUnit.DAYS)),
                purchaseRequest("PUR-1009", "Minh Truong", "510.10", "Overdue", now.minus(2, ChronoUnit.DAYS)),
                purchaseRequest("PUR-1010", "Nhi Vo", "199.99", "Open", now.minus(1, ChronoUnit.DAYS))
        );

        purchaseRequestRepository.saveAll(purchaseRequests);
    }

    private PurchaseRequest purchaseRequest(String invoiceNumber, String customerName, String amount, String status, Instant issuedAt) {
        return PurchaseRequest.builder()
                .invoiceNumber(invoiceNumber)
                .customerName(customerName)
                .totalAmount(new BigDecimal(amount))
                .unit("Cai")
                .requiresDeposit(false)
                .status(status)
                .issuedAt(issuedAt)
                .build();
    }
}
