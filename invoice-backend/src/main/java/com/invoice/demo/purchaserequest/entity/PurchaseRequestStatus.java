package com.invoice.demo.purchaserequest.entity;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum PurchaseRequestStatus {
    OPEN("Open");

    private final String value;

    PurchaseRequestStatus(String value) {
        this.value = value;
    }

    @JsonValue
    public String getValue() {
        return value;
    }

    @JsonCreator
    public static PurchaseRequestStatus fromValue(String value) {
        for (PurchaseRequestStatus status : values()) {
            if (status.value.equalsIgnoreCase(value)) {
                return status;
            }
        }
        throw new IllegalArgumentException("Unknown purchase request status: " + value);
    }
}
