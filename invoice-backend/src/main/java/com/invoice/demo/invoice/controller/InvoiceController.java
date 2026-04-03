package com.invoice.demo.invoice.controller;

import com.invoice.demo.invoice.dto.CreateInvoiceRequest;
import com.invoice.demo.invoice.dto.CreateInvoiceResponse;
import com.invoice.demo.invoice.dto.InvoiceResponse;
import com.invoice.demo.invoice.service.InvoiceService;
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
@RequestMapping("/api/invoices")
@RequiredArgsConstructor
public class InvoiceController {
    private final InvoiceService invoiceService;

    @GetMapping
    public List<InvoiceResponse> getAllInvoices() {
        return invoiceService.getAllInvoices();
    }

    @GetMapping("/awaiting-payment")
    public List<InvoiceResponse> getAwaitingPaymentInvoices() {
        return invoiceService.getAwaitingPaymentInvoices();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CreateInvoiceResponse createInvoice(@Valid @RequestBody CreateInvoiceRequest request) {
        return invoiceService.create(request);
    }

    @PatchMapping("/{invoiceId}/confirm-paid")
    public InvoiceResponse confirmPaid(@PathVariable Long invoiceId) {
        return invoiceService.confirmPaid(invoiceId);
    }

}
