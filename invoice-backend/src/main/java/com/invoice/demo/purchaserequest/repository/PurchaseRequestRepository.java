package com.invoice.demo.purchaserequest.repository;

import com.invoice.demo.purchaserequest.entity.PurchaseRequest;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PurchaseRequestRepository extends JpaRepository<PurchaseRequest, Long> {
}
