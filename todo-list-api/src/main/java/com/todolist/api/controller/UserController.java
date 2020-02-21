package com.todolist.api.controller;

import com.todolist.api.exception.UserNotFoundException;
import com.todolist.api.model.*;
import com.todolist.api.model.enums.Role;
import com.todolist.api.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.hateoas.Resource;
import org.springframework.hateoas.Resources;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.stream.Collectors;

import static org.springframework.hateoas.mvc.ControllerLinkBuilder.linkTo;
import static org.springframework.hateoas.mvc.ControllerLinkBuilder.methodOn;

@RestController
public class UserController {

    @Autowired
    private UserService service;

    @Autowired
    private TodoUserResoucreAssembler assembler;

    @GetMapping("/user-info")
    @ResponseStatus(HttpStatus.OK)
    public Resource<TodoUser> getLoggedInUser(Principal principal) {
        return getOne(principal != null ? principal.getName() : "");
    }

    @GetMapping("/users")
    @ResponseStatus(HttpStatus.OK)
    public Resources<Resource<TodoUser>> getAll() {
        List<Resource<TodoUser>> todoUsers = service.findAll().stream()
                .map(todoUser -> assembler.toResource(todoUser))
                .collect(Collectors.toList());

        return new Resources<>(todoUsers,
                linkTo(methodOn(UserController.class).getAll()).withSelfRel());
    }

    @GetMapping("/users/{username}")
    @ResponseStatus(HttpStatus.OK)
    public Resource<TodoUser> getOne(@PathVariable String username) {
        TodoUser user = service.findById(username);
        if (user == null) {
            throw new UserNotFoundException(username);
        }

        return assembler.toResource(user);
    }


    @PutMapping("/users/{username}/{role}")
    @ResponseStatus(HttpStatus.OK)
    public Resource<TodoUser> update(@PathVariable Role role, @PathVariable String username) {
        TodoUser todoUser = service.addUserRole(username, role);

        return assembler.toResource(todoUser);
    }

    @DeleteMapping("/users/{username}/{role}")
    @ResponseStatus(HttpStatus.OK)
    public Resource<TodoUser> delete(@PathVariable Role role, @PathVariable String username) {
        TodoUser todoUser = service.removeUserRole(username, role);

        return assembler.toResource(todoUser);
    }

}
