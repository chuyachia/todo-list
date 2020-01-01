package com.todolist.api.converter;

import com.todolist.api.model.enums.Priority;
import org.springframework.core.convert.converter.Converter;

import java.util.Objects;

public class PriorityStringConverter implements Converter<String, Priority> {
    @Override
    public Priority convert(String s) {
        return Priority.valueOf(Objects.requireNonNull(s).toUpperCase());
    }
}
