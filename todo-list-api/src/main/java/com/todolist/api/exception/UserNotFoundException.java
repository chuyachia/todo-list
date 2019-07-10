package com.todolist.api.exception;

public class UserNotFoundException extends RuntimeException{
    public UserNotFoundException(String username) {
        super("Could not find user with username "+username);
    }
}
