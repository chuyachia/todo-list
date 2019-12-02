package com.todolist.api.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.FORBIDDEN)
public class UnAuthorizedOperationException extends RuntimeException{
    public UnAuthorizedOperationException(String message) {
        super(message);
    }
}
