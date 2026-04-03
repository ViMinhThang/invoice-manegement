package com.invoice.demo.purchaseRequest.repository;

import com.invoice.demo.purchaseRequest.entity.PurchaseRequest;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PurchaseRequestRepository extends JpaRepository<PurchaseRequest, Long> {
    List<PurchaseRequest> findByStatusOrderByIssuedAtDesc(String status);
}
