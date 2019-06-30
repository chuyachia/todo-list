package com.todolist.api.model;

import com.todolist.api.controller.TodoController;
import org.springframework.hateoas.Resource;
import org.springframework.hateoas.ResourceAssembler;
import org.springframework.stereotype.Component;
import static org.springframework.hateoas.mvc.ControllerLinkBuilder.*;

@Component
public class TodoResourceAssembler implements ResourceAssembler<Todo, Resource> {

    @Override
    public Resource<Todo> toResource(Todo todo) {

        return new Resource<>(todo,
                linkTo(methodOn(TodoController.class).getOne(todo.getId())).withSelfRel(),
                linkTo(methodOn(TodoController.class).getAll()).withRel("todos"));
    }
}
