package com.todolist.api.model.converter;

import com.todolist.api.model.enums.Role;
import org.springframework.stereotype.Component;

import javax.persistence.AttributeConverter;

@Component
public class RoleConverter implements AttributeConverter<Role, String> {
    @Override
    public String convertToDatabaseColumn(Role role) {
        if (role == null) {
            return null;
        }
        return role.getName();
    }

    @Override
    public Role convertToEntityAttribute(String code) {
        if (code == null) {
            return null;
        }
        return Role.getValue(code);
    }
}
