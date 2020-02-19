package com.todolist.api.validator;

import com.todolist.api.exception.InvalidInputException;
import com.todolist.api.model.TodoUser;
import org.springframework.stereotype.Component;
import org.springframework.validation.Errors;
import org.springframework.validation.Validator;

@Component
public class TodoUserValidator implements Validator {

    @Override
    public boolean supports(Class<?> clz) {
        return TodoUser.class.equals(clz);
    }

    @Override
    public void validate(Object obj, Errors errors) {
        TodoUser todoUser = (TodoUser) obj;
        if (todoUser.getUsername().contains(" ")) {
            throw new InvalidInputException("Username must not contain whitespace");
        }

//        if (todoUser.getPassword().contains(" ")) {
//            throw new InvalidInputException("Password must not contain whitespace");
//        }
//
//        if (todoUser.getPassword().length()<5) {
//            throw new InvalidInputException("Password must contain at least five characters");
//        }
    }
}
