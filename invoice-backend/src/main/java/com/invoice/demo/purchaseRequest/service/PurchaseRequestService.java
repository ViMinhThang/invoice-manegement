package com.invoice.demo.purchaseRequest.service;

import com.invoice.demo.purchaseRequest.dto.CreatePurchaseRequest;
import com.invoice.demo.purchaseRequest.dto.CreatePurchaseResponse;
import com.invoice.demo.purchaseRequest.dto.PurchaseRequestResponse;
import com.invoice.demo.purchaseRequest.entity.PurchaseRequest;
import com.invoice.demo.purchaseRequest.repository.PurchaseRequestRepository;
import java.time.Instant;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class PurchaseRequestService {
    public static final String STATUS_OPEN = "Open";
    public static final String STATUS_AWAITING_PAYMENT = "Awaiting Payment";
    public static final String STATUS_COMPLETED_INVOICED = "Completed/Invoiced";

    private final PurchaseRequestRepository purchaseRequestRepository;

    public List<PurchaseRequestResponse> getAllPurchaseRequests() {
        return purchaseRequestRepository.findAll().stream()
                .map(this::toResponse)
                .toList();
    }

    public List<PurchaseRequestResponse> getAwaitingPaymentPurchaseRequests() {
        return purchaseRequestRepository.findByStatusOrderByIssuedAtDesc(STATUS_AWAITING_PAYMENT).stream()
                .map(this::toResponse)
                .toList();
    }

    public List<PurchaseRequestResponse> getOpenPurchaseRequests() {
        return purchaseRequestRepository.findByStatusOrderByIssuedAtDesc(STATUS_OPEN).stream()
                .map(this::toResponse)
                .toList();
    }

    public CreatePurchaseResponse create(CreatePurchaseRequest request) {
        Instant now = Instant.now();
        String itemName = request.itemName() == null ? "" : request.itemName().trim();
        if (itemName.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Item name is required");
        }

        String supplierName = request.supplierName();
        if (supplierName == null || supplierName.isBlank()) {
            supplierName = itemName;
        }

        PurchaseRequest purchaseRequest = PurchaseRequest.builder()
                .invoiceNumber(generateInvoiceNumber())
                .supplierName(supplierName.trim())
                .itemName(itemName)
                .totalAmount(request.quantity())
                .unit(request.unit())
                .requiresDeposit(request.requiresDeposit())
                .status(STATUS_OPEN)
                .issuedAt(now)
                .build();

        PurchaseRequest saved = purchaseRequestRepository.save(purchaseRequest);
        return new CreatePurchaseResponse(
                saved.getId(),
                itemName,
                request.quantity(),
                request.unit(),
                request.requiresDeposit(),
                saved.getStatus(),
                now
        );
    }

    @Transactional
    public PurchaseRequestResponse confirmPaid(Long id) {
        PurchaseRequest purchaseRequest = purchaseRequestRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Purchase request not found"));

        if (!STATUS_AWAITING_PAYMENT.equals(purchaseRequest.getStatus())) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Only purchase requests in Awaiting Payment status can be confirmed as paid"
            );
        }

        purchaseRequest.setStatus(STATUS_COMPLETED_INVOICED);
        PurchaseRequest updated = purchaseRequestRepository.save(purchaseRequest);
        return toResponse(updated);
    }

    private PurchaseRequestResponse toResponse(PurchaseRequest purchaseRequest) {
        return new PurchaseRequestResponse(
                purchaseRequest.getId(),
                purchaseRequest.getInvoiceNumber(),
                purchaseRequest.getSupplierName(),
                purchaseRequest.getItemName(),
                purchaseRequest.getTotalAmount(),
                purchaseRequest.getStatus(),
                purchaseRequest.getIssuedAt()
        );
    }

    private String generateInvoiceNumber() {
        return "PUR-" + UUID.randomUUID().toString().replace("-", "").substring(0, 12).toUpperCase();
    }
}
