package com.todolist.api.model.converter;

import com.todolist.api.model.enums.Status;

import javax.persistence.AttributeConverter;

public class StatusConverter implements AttributeConverter<Status,String> {
    @Override
    public String convertToDatabaseColumn(Status status) {
        if (status== null) {
            return null;
        }
        return status.toString();
    }

    @Override
    public Status convertToEntityAttribute(String code) {
        if (code == null) {
            return null;
        }

        return Status.valueOf(code);
    }
}
