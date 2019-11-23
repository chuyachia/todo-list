package com.todolist.api.controller;

import com.todolist.api.exception.UserNotFoundException;
import com.todolist.api.model.*;
import com.todolist.api.repository.UserRepository;
import com.todolist.api.service.IUserService;
import com.todolist.api.validator.TodoUserValidator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.hateoas.Resource;
import org.springframework.hateoas.Resources;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.WebDataBinder;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;
import java.util.stream.Collectors;

import static org.springframework.hateoas.mvc.ControllerLinkBuilder.linkTo;
import static org.springframework.hateoas.mvc.ControllerLinkBuilder.methodOn;

@RestController
public class UserController {

    @Autowired
    private UserRepository repository;

    @Autowired
    private IUserService service;

    @Autowired
    private TodoUserResoucreAssembler assembler;

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

    @GetMapping("/users")
    @ResponseStatus(HttpStatus.OK)
    public Resources<Resource<TodoUser>> getAll() {
        List<Resource<TodoUser>> todoUsers =  repository.findAll().stream()
                .map(todoUser -> assembler.toResource(todoUser))
                .collect(Collectors.toList());

        return new Resources<>(todoUsers,
                linkTo(methodOn(UserController.class).getAll()).withSelfRel());
    }

    @GetMapping("/users/{username}")
    @ResponseStatus(HttpStatus.OK)
    public Resource<TodoUser> getOne(@PathVariable String username) {
        TodoUser user =  repository.findByUsername(username);
        if (user == null) {
            throw new UserNotFoundException(username);
        }

        return assembler.toResource(user);
    }


    @PutMapping("/users/{username}/{role}")
    @ResponseStatus(HttpStatus.OK)
    public Resource<TodoUser> update(@PathVariable String role, @PathVariable String username) {
        TodoUser todoUser =  service.addUserRole(username, role);

        return assembler.toResource(todoUser);
    }

    @DeleteMapping("/users/{username}/{role}")
    @ResponseStatus(HttpStatus.OK)
    public Resource<TodoUser> delete(@PathVariable String role, @PathVariable String username) {
        TodoUser todoUser = service.removeUserRole(username, role);

        return assembler.toResource(todoUser);
    }

}
