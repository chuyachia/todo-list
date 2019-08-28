package com.todolist.api.service;

import com.todolist.api.exception.InvalidInputException;
import com.todolist.api.exception.UserAlreadyExistsException;
import com.todolist.api.exception.UserNotFoundException;
import com.todolist.api.model.TodoUser;

public interface IUserService {
    void registerNewUser(TodoUser user) throws UserAlreadyExistsException;
    TodoUser addUserRole(String username, String role) throws UserNotFoundException, InvalidInputException;
    TodoUser removeUserRole(String username, String role) throws UserNotFoundException, InvalidInputException;
}
