package com.invoice.demo.purchaserequest.service;

import com.invoice.demo.purchaserequest.dto.CreatePurchaseRequestRequest;
import com.invoice.demo.purchaserequest.dto.PurchaseRequestResponse;
import com.invoice.demo.purchaserequest.entity.PurchaseRequest;
import com.invoice.demo.purchaserequest.entity.PurchaseRequestStatus;
import com.invoice.demo.purchaserequest.repository.PurchaseRequestRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PurchaseRequestService {
    private final PurchaseRequestRepository purchaseRequestRepository;

    public PurchaseRequestResponse create(CreatePurchaseRequestRequest request) {
        PurchaseRequest purchaseRequest = PurchaseRequest.builder()
                .itemName(request.itemName())
                .quantity(request.quantity())
                .unit(request.unit())
                .requiresDeposit(request.requiresDeposit())
                .status(PurchaseRequestStatus.OPEN)
                .build();

        PurchaseRequest savedRequest = purchaseRequestRepository.save(purchaseRequest);

        return new PurchaseRequestResponse(
                savedRequest.getId(),
                savedRequest.getItemName(),
                savedRequest.getQuantity(),
                savedRequest.getUnit(),
                savedRequest.isRequiresDeposit(),
                savedRequest.getStatus(),
                savedRequest.getCreatedAt()
        );
    }
}
