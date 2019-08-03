package com.todolist.api.service;

import com.todolist.api.exception.InvalidInputException;
import com.todolist.api.exception.UserAlreadyExistsException;
import com.todolist.api.exception.UserNotFoundException;
import com.todolist.api.model.TodoUser;

public interface IUserService {
    void registerNewUser(TodoUser user) throws UserAlreadyExistsException;
    void addUserRole(String username, String role) throws UserNotFoundException, InvalidInputException;
    void removeUserRole(String username, String role) throws UserNotFoundException, InvalidInputException;
}
