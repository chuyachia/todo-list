package com.todolist.api.model.converter;

import com.todolist.api.model.enums.Role;
import org.springframework.core.convert.converter.Converter;
import org.springframework.stereotype.Component;

@Component
public class RoleStringConverter implements Converter<String, Role> {
    @Override
    public Role convert(String s) {
        return Role.getValue(s.toUpperCase());
    }
}
