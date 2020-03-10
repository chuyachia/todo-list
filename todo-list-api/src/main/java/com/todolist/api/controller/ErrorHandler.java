package com.todolist.api.controller;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import javax.servlet.http.HttpServletResponse;
import javax.validation.ConstraintViolationException;
import java.io.IOException;
import java.util.stream.Collectors;

@ControllerAdvice
public class ErrorHandler {
    @ExceptionHandler({ConstraintViolationException.class})
    public void handleCastException(ConstraintViolationException ex, HttpServletResponse response) throws IOException {
        String details = ex.getConstraintViolations()
                .parallelStream()
                .map(e -> e.getMessage())
                .collect(Collectors.joining(";"));

        response.sendError(HttpStatus.BAD_REQUEST.value(), details);
    }
}
