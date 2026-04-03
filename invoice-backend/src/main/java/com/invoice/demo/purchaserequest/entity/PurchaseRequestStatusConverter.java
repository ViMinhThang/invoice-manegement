package com.invoice.demo.purchaserequest.entity;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class PurchaseRequestStatusConverter implements AttributeConverter<PurchaseRequestStatus, String> {
    @Override
    public String convertToDatabaseColumn(PurchaseRequestStatus attribute) {
        if (attribute == null) {
            return null;
        }
        return attribute.getValue();
    }

    @Override
    public PurchaseRequestStatus convertToEntityAttribute(String dbData) {
        if (dbData == null) {
            return null;
        }
        return PurchaseRequestStatus.fromValue(dbData);
    }
}
