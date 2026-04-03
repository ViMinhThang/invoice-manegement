package com.invoice.demo.bill.repository;

import com.invoice.demo.bill.entity.Bill;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface BillRepository extends JpaRepository<Bill, Long> {
    boolean existsByInvoiceId(Long invoiceId);

    @Query("select b from Bill b join fetch b.invoice i order by b.createdAt desc")
    List<Bill> findAllWithInvoiceOrderByCreatedAtDesc();
}
