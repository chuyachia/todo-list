package com.todolist.api.exception;

public class TodoNotFoundException extends  RuntimeException{
    public TodoNotFoundException(Integer id) {
        super("Could not find todo with id "+id);
    }
}
