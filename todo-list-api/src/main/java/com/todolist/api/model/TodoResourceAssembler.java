package com.todolist.api.model;

import com.todolist.api.controller.TodoController;
import com.todolist.api.model.enums.Status;
import org.springframework.hateoas.Resource;
import org.springframework.hateoas.ResourceAssembler;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import static org.springframework.hateoas.mvc.ControllerLinkBuilder.*;

@Component
public class TodoResourceAssembler implements ResourceAssembler<Todo, Resource> {

    @Override
    public Resource<Todo> toResource(Todo todo) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        Resource<Todo> todoResource = new Resource<>(todo,
                linkTo(methodOn(TodoController.class).getOne(todo.getId())).withSelfRel());

        if (todo.getStatus() == Status.TODO) {
            todoResource.add(
                    linkTo(methodOn(TodoController.class)
                            .inProgress(todo.getId())).withRel("inProgress").withTitle("In Progress")
            );
        } else if (todo.getStatus() == Status.INPROGRESS) {
            todoResource.add(
                    linkTo(methodOn(TodoController.class)
                            .done(todo.getId())).withRel("done").withTitle("Done")
            );
            todoResource.add(
                    linkTo(methodOn(TodoController.class)
                            .wontDo(todo.getId())).withRel("wontDo").withTitle("Won't Do")
            );

        }

        return todoResource;
    }
}
