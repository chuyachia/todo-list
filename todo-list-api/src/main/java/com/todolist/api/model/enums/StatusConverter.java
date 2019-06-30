package com.todolist.api.model.enums;

import javax.persistence.AttributeConverter;

public class StatusConverter implements AttributeConverter<Status,String> {
    @Override
    public String convertToDatabaseColumn(Status status) {
        if (status== null) {
            return null;
        }
        return status.getCode();
    }

    @Override
    public Status convertToEntityAttribute(String code) {
        if (code == null) {
            return null;
        }

        return Status.getValue(code);
    }
}
