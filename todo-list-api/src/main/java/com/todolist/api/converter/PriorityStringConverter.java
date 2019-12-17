package com.todolist.api.converter;

import com.todolist.api.model.enums.Priority;
import org.springframework.core.convert.converter.Converter;

public class PriorityStringConverter implements Converter<String, Priority> {
    @Override
    public Priority convert(String s) {
        return Priority.valueOf(s.toUpperCase());
    }
}
