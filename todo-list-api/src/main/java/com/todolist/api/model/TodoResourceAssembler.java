package com.todolist.api.model;

import com.todolist.api.controller.TodoController;
import com.todolist.api.model.enums.Status;
import org.springframework.hateoas.Resource;
import org.springframework.hateoas.ResourceAssembler;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import static org.springframework.hateoas.mvc.ControllerLinkBuilder.*;

@Component
public class TodoResourceAssembler implements ResourceAssembler<Todo, Resource> {
    private final String ADMIN_ROLE = "ROLE_A";
    private final SimpleGrantedAuthority adminGrant = new SimpleGrantedAuthority(ADMIN_ROLE);

    @Override
    public Resource<Todo> toResource(Todo todo) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        boolean isAnonymous = auth instanceof AnonymousAuthenticationToken;
        TodoUserDetail todoUserDetail = isAnonymous ? null : (TodoUserDetail) auth.getPrincipal();

        Resource<Todo> todoResource = new Resource<>(todo,
                linkTo(methodOn(TodoController.class).getOne(todo.getId())).withSelfRel());

        if (!isAnonymous &&
                (auth.getAuthorities().contains(adminGrant) ||
                todoUserDetail.getTodoUser().getUsername() == todo.getUser().getUsername())) {
            todoResource.add(
                    linkTo(methodOn(TodoController.class)
                            .update(null, todo.getId())).withRel("edit").withTitle("Edit"));

            Status status = todo.getStatus();
            switch (status) {
                case TODO:
                    todoResource.add(
                            linkTo(methodOn(TodoController.class)
                                    .inProgress(todo.getId())).withRel("inProgress").withTitle(Status.INPROGRESS.getName())
                    );
                    break;
                case INPROGRESS:
                    todoResource.add(
                            linkTo(methodOn(TodoController.class)
                                    .done(todo.getId())).withRel("done").withTitle(Status.DONE.getName())
                    );
                    todoResource.add(
                            linkTo(methodOn(TodoController.class)
                                    .wontDo(todo.getId())).withRel("wontDo").withTitle(Status.WONTDO.getName())
                    );
                    break;
                case DONE:
                    todoResource.add(
                            linkTo(methodOn(TodoController.class)
                                    .unDo(todo.getId())).withRel("unDo").withTitle("Undo")
                    );
                    break;
                case WONTDO:
                    todoResource.add(
                            linkTo(methodOn(TodoController.class)
                                    .unDo(todo.getId())).withRel("unDo").withTitle(Status.TODO.getName())
                    );
            }
        }

        return todoResource;
    }
}
