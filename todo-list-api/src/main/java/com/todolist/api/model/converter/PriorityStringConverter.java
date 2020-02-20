package com.todolist.api.model.converter;

import com.todolist.api.model.enums.Priority;
import org.springframework.core.convert.converter.Converter;
import org.springframework.stereotype.Component;

import java.util.Objects;

@Component
public class PriorityStringConverter implements Converter<String, Priority> {
    @Override
    public Priority convert(String s) {
        return Priority.getValue(Objects.requireNonNull(s).toUpperCase());
    }
}
