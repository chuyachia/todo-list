package com.todolist.api.model;

import com.todolist.api.controller.TodoController;
import com.todolist.api.model.enums.Status;
import org.springframework.hateoas.Resource;
import org.springframework.hateoas.ResourceAssembler;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import static org.springframework.hateoas.mvc.ControllerLinkBuilder.*;

@Component
public class TodoResourceAssembler implements ResourceAssembler<Todo, Resource> {

    @Override
    public Resource<Todo> toResource(Todo todo) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        TodoUserDetail todoUserDetail = (TodoUserDetail) auth.getPrincipal();

        Resource<Todo> todoResource = new Resource<>(todo,
                linkTo(methodOn(TodoController.class).getOne(todo.getId())).withSelfRel());

        if (todoUserDetail.getTodoUser().getId() == todo.getUser().getId()) {
            Status status = todo.getStatus();
            switch (status) {
                case TODO :
                    todoResource.add(
                            linkTo(methodOn(TodoController.class)
                                    .inProgress(todo.getId())).withRel("inProgress").withTitle("In Progress")
                    );
                    break;
                case INPROGRESS:
                    todoResource.add(
                            linkTo(methodOn(TodoController.class)
                                    .done(todo.getId())).withRel("done").withTitle("Done")
                    );
                    todoResource.add(
                            linkTo(methodOn(TodoController.class)
                                    .wontDo(todo.getId())).withRel("wontDo").withTitle("Won't Do")
                    );
                    break;
                case DONE:
                    todoResource.add(
                            linkTo(methodOn(TodoController.class)
                                    .unDo(todo.getId())).withRel("unDo").withTitle("Undo")
                    );

            }
        }

        return todoResource;
    }
}
