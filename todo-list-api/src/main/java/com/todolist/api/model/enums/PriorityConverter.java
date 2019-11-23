package com.todolist.api.model.enums;

import javax.persistence.AttributeConverter;

public class PriorityConverter implements AttributeConverter<Priority,String> {

    @Override
    public String convertToDatabaseColumn(Priority priority) {
        if (priority == null) {
            return null;
        }
        return priority.toString();
    }

    @Override
    public Priority convertToEntityAttribute(String code) {
        if (code == null) {
            return null;
        }

        return Priority.valueOf(code);
    }
}
