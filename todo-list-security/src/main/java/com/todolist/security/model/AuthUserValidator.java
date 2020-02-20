package com.todolist.security.model;

import org.springframework.stereotype.Component;
import org.springframework.validation.Errors;
import org.springframework.validation.Validator;

import javax.xml.bind.ValidationException;

@Component
public class AuthUserValidator implements Validator {

    @Override
    public boolean supports(Class<?> clz) {
        return AuthUser.class.equals(clz);
    }

    @Override
    public void validate(Object obj, Errors errors) {
        AuthUser authUser = (AuthUser) obj;
        if (authUser.getUsername().contains(" ")) {
//            throw new ValidationException("Username must not contain whitespace");
        }

        if (authUser.getPassword().contains(" ")) {
//            throw new InvalidInputException("Password must not contain whitespace");
        }

        if (authUser.getPassword().length()<5) {
//            throw new InvalidInputException("Password must contain at least five characters");
        }
    }
}
