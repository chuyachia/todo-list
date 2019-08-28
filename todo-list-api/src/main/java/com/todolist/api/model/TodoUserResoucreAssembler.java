package com.todolist.api.model;

import com.todolist.api.controller.UserController;
import com.todolist.api.model.enums.Role;
import org.springframework.hateoas.Resource;
import org.springframework.hateoas.ResourceAssembler;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

import static org.springframework.hateoas.mvc.ControllerLinkBuilder.*;

@Component
public class TodoUserResoucreAssembler implements ResourceAssembler<TodoUser, Resource> {
    @Override
    public Resource<TodoUser> toResource(TodoUser todoUser) {
        Resource<TodoUser> todoUserResource = new Resource<>(todoUser,
                linkTo(methodOn(UserController.class).getOne(todoUser.getUsername())).withSelfRel(),
                linkTo(methodOn(UserController.class).getAll()).withRel("users"));

        List<String> roles = todoUser.getRoles().stream()
        .map(userRole -> userRole.getRole().toString())
        .collect(Collectors.toList());

        // TODO how to express post, put ,delete methods in HATEOS?
//        if (roles.contains("A")) {
//            todoUserResource.add(
//                    linkTo(methodOn(UserController.class)
//                    .delete("A",todoUser.getUsername())).withRel("deleteAdminRole"));
//        } else {
//            todoUserResource.add(
//                    linkTo(methodOn(UserController.class)
//                            .update("A",todoUser.getUsername())).withRel("addAdminRole"));
//        }
//
//        if (roles.contains("U")) {
//            todoUserResource.add(
//                    linkTo(methodOn(UserController.class)
//                            .delete("U",todoUser.getUsername())).withRel("deleteUserRole"));
//        } else {
//            todoUserResource.add(
//                    linkTo(methodOn(UserController.class)
//                            .update("U",todoUser.getUsername())).withRel("addUserRole"));
//        }

        return todoUserResource;
    }
}
