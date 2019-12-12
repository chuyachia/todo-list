package com.todolist.api.validator;

import com.todolist.api.exception.InvalidInputException;
import com.todolist.api.model.Todo;
import org.springframework.stereotype.Component;
import org.springframework.validation.Errors;
import org.springframework.validation.Validator;

@Component
public class TodoValidator implements Validator {
    @Override
    public boolean supports(Class<?> aClass) {
        return Todo.class.equals(aClass);
    }

    @Override
    public void validate(Object o, Errors errors) {
        Todo todo = (Todo) o;
        if (todo.getTitle() == null || todo.getTitle().length() == 0) {
            throw new InvalidInputException("Title must not be empty");
        }
    }
}
