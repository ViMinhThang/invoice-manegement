package com.invoice.demo.purchaserequest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.invoice.demo.purchaserequest.entity.PurchaseRequest;
import com.invoice.demo.purchaserequest.entity.PurchaseRequestStatus;
import com.invoice.demo.purchaserequest.repository.PurchaseRequestRepository;
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
class PurchaseRequestControllerTest {
    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private PurchaseRequestRepository purchaseRequestRepository;

    @BeforeEach
    void setUp() {
        purchaseRequestRepository.deleteAll();
    }

    @Test
    void createPurchaseRequest_shouldPersistWithOpenStatus() throws Exception {
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
                .andExpect(jsonPath("$.unit").value("Cai"))
                .andExpect(jsonPath("$.requiresDeposit").value(true))
                .andExpect(jsonPath("$.status").value("Open"));

        List<PurchaseRequest> savedRequests = purchaseRequestRepository.findAll();
        assertThat(savedRequests).hasSize(1);
        assertThat(savedRequests.get(0).getStatus()).isEqualTo(PurchaseRequestStatus.OPEN);
        assertThat(savedRequests.get(0).getQuantity()).isEqualByComparingTo(new BigDecimal("2.00"));
    }
}
