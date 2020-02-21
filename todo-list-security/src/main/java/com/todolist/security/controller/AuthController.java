package com.todolist.security.controller;

import com.todolist.security.model.AuthUser;
import com.todolist.security.service.IAuthUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;

@RestController
public class AuthController {
    @Autowired
    private IAuthUserService service;

    @PostMapping(value ="/register",  consumes = MediaType.APPLICATION_JSON_VALUE )
    @ResponseStatus(HttpStatus.CREATED)
    public void create(@Valid @RequestBody AuthUser newUser) {
        service.registerNewUser(newUser);
    }
}
