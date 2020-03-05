package com.todolist.security.controller;

import lombok.Data;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import javax.persistence.EntityExistsException;

@ControllerAdvice
public class ErrorHandler {

    @Data
    private static class ErrorResponse {
        final String error;
        final String error_description;

        public ErrorResponse(String error, String error_description) {
            this.error = error;
            this.error_description = error_description;
        }
    }

    @ExceptionHandler(EntityExistsException.class)
    public ResponseEntity<ErrorResponse> alreadyExists(Exception e) {
        ErrorResponse error = new ErrorResponse("already exists", e.getMessage());

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> invalidInput(Exception e) {
        ErrorResponse error = new ErrorResponse("invalid input", e.getMessage());

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }
}
