package com.invoice.demo.invoice;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.invoice.demo.invoice.entity.Invoice;
import com.invoice.demo.invoice.repository.InvoiceRepository;
import java.math.BigDecimal;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
class InvoiceControllerTest {
    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private InvoiceRepository invoiceRepository;

    @BeforeEach
    void setUp() {
        invoiceRepository.deleteAll();
    }

    @Test
    void createViaPurchaseRequestPath_shouldPersistIntoInvoicesTable() throws Exception {
        String requestBody = """
                {
                  "itemName": "Laptop",
                  "quantity": 2,
                  "unit": "Cai",
                  "requiresDeposit": true
                }
                """;

        mockMvc.perform(post("/api/purchase-requests")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.itemName").value("Laptop"))
                .andExpect(jsonPath("$.status").value("Open"));

        List<Invoice> savedInvoices = invoiceRepository.findAll();
        assertThat(savedInvoices).hasSize(1);
        assertThat(savedInvoices.get(0).getCustomerName()).isEqualTo("Laptop");
        assertThat(savedInvoices.get(0).getTotalAmount()).isEqualByComparingTo(new BigDecimal("2.00"));
        assertThat(savedInvoices.get(0).getStatus()).isEqualTo("Open");
    }

    @Test
    void getInvoices_shouldReadFromInvoicesTable() throws Exception {
        invoiceRepository.save(Invoice.builder()
                .invoiceNumber("INV-TEST000001")
                .customerName("Seed Customer")
                .totalAmount(new BigDecimal("10.00"))
                .status("Open")
                .issuedAt(java.time.Instant.now())
                .build());

        mockMvc.perform(get("/api/invoices"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].invoiceNumber").value("INV-TEST000001"))
                .andExpect(jsonPath("$[0].customerName").value("Seed Customer"));
    }
}
