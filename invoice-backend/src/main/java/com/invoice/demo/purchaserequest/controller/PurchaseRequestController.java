package com.invoice.demo.purchaserequest.controller;

import com.invoice.demo.purchaserequest.dto.CreatePurchaseRequestRequest;
import com.invoice.demo.purchaserequest.dto.PurchaseRequestResponse;
import com.invoice.demo.purchaserequest.service.PurchaseRequestService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
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

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public PurchaseRequestResponse create(@Valid @RequestBody CreatePurchaseRequestRequest request) {
        return purchaseRequestService.create(request);
    }
}
