package com.invoice.demo.purchaseRequest.controller;

import com.invoice.demo.purchaseRequest.dto.CreatePurchaseRequest;
import com.invoice.demo.purchaseRequest.dto.CreatePurchaseResponse;
import com.invoice.demo.purchaseRequest.dto.PurchaseRequestResponse;
import com.invoice.demo.purchaseRequest.service.PurchaseRequestService;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/purchase-requests")
@RequiredArgsConstructor
public class PurchaseRequestController {
    private final PurchaseRequestService purchaseRequestService;

    @GetMapping
    public List<PurchaseRequestResponse> getAllPurchaseRequests() {
        return purchaseRequestService.getAllPurchaseRequests();
    }

    @GetMapping("/awaiting-payment")
    public List<PurchaseRequestResponse> getAwaitingPaymentPurchaseRequests() {
        return purchaseRequestService.getAwaitingPaymentPurchaseRequests();
    }

    @GetMapping("/open")
    public List<PurchaseRequestResponse> getOpenPurchaseRequests() {
        return purchaseRequestService.getOpenPurchaseRequests();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CreatePurchaseResponse createPurchaseRequest(@Valid @RequestBody CreatePurchaseRequest request) {
        return purchaseRequestService.create(request);
    }

    @PatchMapping("/{id}/confirm-paid")
    public PurchaseRequestResponse confirmPaid(@PathVariable Long id) {
        return purchaseRequestService.confirmPaid(id);
    }
}
