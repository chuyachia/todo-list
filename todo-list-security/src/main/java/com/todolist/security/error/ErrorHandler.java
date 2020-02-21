package com.todolist.security.error;

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
        final String title;
        final String message;

        public ErrorResponse(String title, String message) {
            this.title = title;
            this.message = message;
        }
    }

    @ExceptionHandler(EntityExistsException.class)
    public ResponseEntity<ErrorResponse> alreadyExists(Exception e) {
        ErrorResponse error = new ErrorResponse("Already exists", e.getMessage());

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> invalidInput(Exception e) {
        ErrorResponse error = new ErrorResponse("Invalid input", e.getMessage());

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }
}
