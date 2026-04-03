package com.invoice.demo.invoice.controller;

import com.invoice.demo.invoice.dto.CreateInvoiceRequest;
import com.invoice.demo.invoice.dto.CreateInvoiceResponse;
import com.invoice.demo.invoice.service.InvoiceService;
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
public class PurchaseRequestCompatController {
    private final InvoiceService invoiceService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CreateInvoiceResponse create(@Valid @RequestBody CreateInvoiceRequest request) {
        return invoiceService.create(request);
    }
}
