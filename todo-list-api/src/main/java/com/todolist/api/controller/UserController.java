package com.todolist.api.controller;

import com.todolist.api.model.Todo;
import com.todolist.api.model.TodoUser;
import com.todolist.api.model.enums.Role;
import com.todolist.api.service.IUserService;
import com.todolist.api.validator.TodoUserValidator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.WebDataBinder;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

@RestController
public class UserController {

    @Autowired
    private IUserService service;

    @Autowired
    private TodoUserValidator todoUserValidator;

    @InitBinder
    private void initBinder(WebDataBinder webDataBinder) {
        webDataBinder.addValidators(todoUserValidator);
    }

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public void create(@Valid TodoUser newUser) {
        service.registerNewUser(newUser);
    }

    @PutMapping("/users/{username}/{role}")
    @ResponseStatus(HttpStatus.OK)
    public void update(@PathVariable String role, @PathVariable String username) {
        service.addUserRole(username, role);
    }

    @DeleteMapping("/users/{username}/{role}")
    @ResponseStatus(HttpStatus.OK)
    public void delete(@PathVariable String role, @PathVariable String username) {
        service.removeUserRole(username, role);
    }

}
