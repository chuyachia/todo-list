package com.todolist.api.model.converter;

import com.todolist.api.model.enums.Priority;

import javax.persistence.AttributeConverter;
import javax.persistence.Converter;

@Converter
public class PriorityConverter implements AttributeConverter<Priority,Integer> {

    @Override
    public Integer convertToDatabaseColumn(Priority priority) {
        if (priority == null) {
            return null;
        }
        return priority.getNumber();
    }

    @Override
    public Priority convertToEntityAttribute(Integer value) {
        if (value == null) {
            return null;
        }

        return Priority.getValueFromNumber(value);
    }
}
