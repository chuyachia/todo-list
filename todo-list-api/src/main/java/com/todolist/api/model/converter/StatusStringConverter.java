package com.todolist.api.model.converter;

import com.todolist.api.model.enums.Status;
import org.springframework.core.convert.converter.Converter;
import org.springframework.stereotype.Component;

import java.util.Objects;

@Component
public class StatusStringConverter implements Converter<String, Status> {
    @Override
    public Status convert(String s) {
        return Status.valueOf(Objects.requireNonNull(s).toUpperCase());
    }
}
