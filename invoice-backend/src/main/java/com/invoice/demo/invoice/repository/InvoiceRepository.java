package com.invoice.demo.invoice.repository;

import com.invoice.demo.invoice.entity.Invoice;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InvoiceRepository extends JpaRepository<Invoice, Long> {
    List<Invoice> findByStatusOrderByIssuedAtDesc(String status);
}
