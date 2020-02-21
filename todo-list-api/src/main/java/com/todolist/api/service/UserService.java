package com.todolist.api.service;

import com.todolist.api.exception.InvalidInputException;
import com.todolist.api.exception.UserAlreadyExistsException;
import com.todolist.api.exception.UserNotFoundException;
import com.todolist.api.model.TodoUser;
import com.todolist.api.model.enums.Role;

import java.util.List;

public interface UserService {
    void registerNewUser(TodoUser user) throws UserAlreadyExistsException;
    List<TodoUser> findAll();
    TodoUser findById(String username);
    TodoUser addUserRole(String username, Role role) throws UserNotFoundException, InvalidInputException;
    TodoUser removeUserRole(String username, Role role) throws UserNotFoundException, InvalidInputException;
}
