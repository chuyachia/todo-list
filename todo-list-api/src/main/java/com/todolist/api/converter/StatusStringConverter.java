package com.todolist.api.converter;

import com.todolist.api.model.enums.Status;
import org.springframework.core.convert.converter.Converter;

public class StatusStringConverter implements Converter<String, Status> {
    @Override
    public Status convert(String s) {
        return Status.valueOf(s.toUpperCase());
    }
}
