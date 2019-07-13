package com.todolist.api.service;

import com.todolist.api.exception.UserAlreadyExistsException;
import com.todolist.api.model.TodoUser;

public interface IUserService {
    void registerNewUser(TodoUser user) throws UserAlreadyExistsException;
}
