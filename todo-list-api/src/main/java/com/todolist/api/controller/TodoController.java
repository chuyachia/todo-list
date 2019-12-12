package com.todolist.api.controller;

import com.todolist.api.exception.TodoNotFoundException;
import com.todolist.api.exception.UnAuthorizedOperationException;
import com.todolist.api.model.Todo;
import com.todolist.api.model.TodoResourceAssembler;
import com.todolist.api.model.TodoUserDetail;
import com.todolist.api.model.enums.Status;
import com.todolist.api.repository.TodoRepository;
import com.todolist.api.service.TodoService;
import com.todolist.api.validator.TodoValidator;
import org.springframework.hateoas.Resource;
import org.springframework.hateoas.Resources;
import org.springframework.http.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.WebDataBinder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.StreamingResponseBody;


import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;

import static org.springframework.hateoas.mvc.ControllerLinkBuilder.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("api")
public class TodoController {
    private final TodoRepository repository;
    private final TodoResourceAssembler assembler;
    private final TodoService service;
    private final TodoValidator todoValidator;

    TodoController(TodoRepository repository, TodoResourceAssembler assembler, TodoService service, TodoValidator todoValidator) {
        this.repository = repository;
        this.assembler = assembler;
        this.service = service;
        this.todoValidator = todoValidator;
    }

    @InitBinder
    private void initBinder(WebDataBinder webDataBinder) {
        webDataBinder.addValidators(todoValidator);
    }


    @GetMapping("/todos")
    public Resources<Resource<Todo>> getAll() {
        List<Resource<Todo>> todos =repository.findAll().stream()
                .map(todo -> assembler.toResource(todo))
                .collect(Collectors.toList());

        return new Resources<>(todos,
                linkTo(methodOn(TodoController.class).getAll()).withSelfRel());
    }

    @GetMapping("/todos/file")
    public ResponseEntity<StreamingResponseBody> downloadAll()  {
            StreamingResponseBody stream = outputStream -> {
                service.streamAll(outputStream);
                outputStream.flush();
            };
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
        headers.add("Content-disposition", "attachment; filename=todos.csv");

        return new ResponseEntity(stream,headers,HttpStatus.OK);
    }

    @GetMapping("/todos/id/{id}")
    public Resource<Todo> getOne(@PathVariable Integer id) {
        Todo todo = repository.findById(id)
                .orElseThrow(() -> new TodoNotFoundException(id));

        return assembler.toResource(todo);
    }

    @GetMapping("/todos/user/{username}")
    public Resources<Resource<Todo>> getByUsername(@PathVariable String username, HttpServletRequest request) {
        List<Resource<Todo>> todos = repository.findByUserUsername(username)
                .stream().map(t-> assembler.toResource(t))
                .collect(Collectors.toList());

        return new Resources<>(todos,
                linkTo(methodOn(TodoController.class).getAll()).withSelfRel());
    }


    @PostMapping("/todos")
    @ResponseStatus(HttpStatus.CREATED)
    public Resource<Todo> create(@Valid @RequestBody Todo newTodo) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        TodoUserDetail todoUserDetail = (TodoUserDetail) auth.getPrincipal();
        newTodo.setStatus(Status.TODO);
        newTodo.setUser(todoUserDetail.getTodoUser());
        Todo todo = repository.save(newTodo);

        return assembler.toResource(todo);
    }

    @PostMapping("/todos/{id}/done")
    @ResponseStatus(HttpStatus.OK)
    public Resource<Todo> done(@PathVariable Integer id) {
        return repository.findById(id)
                .map(todo -> {
                    if (isTodoAuthor(todo)) {
                        todo.setStatus(Status.DONE);
                        return update(todo, id);
                    } else {
                        throw new UnAuthorizedOperationException("Modifying other users' todos are not allowed");
                    }
                })
                .orElseThrow(() -> new TodoNotFoundException(id));
    }

    @PostMapping("/todos/{id}/in-progress")
    @ResponseStatus(HttpStatus.OK)
    public Resource<Todo> inProgress(@PathVariable Integer id) {
        return repository.findById(id)
                .map(todo -> {
                    if (isTodoAuthor(todo)) {
                        todo.setStatus(Status.INPROGRESS);
                        return update(todo, id);
                    } else {
                        throw new UnAuthorizedOperationException("Modifying other users' todos are not allowed");
                    }
                })
                .orElseThrow(() -> new TodoNotFoundException(id));
    }

    @PostMapping("/todos/{id}/wont-do")
    @ResponseStatus(HttpStatus.OK)
    public Resource<Todo> wontDo(@PathVariable Integer id) {
        return repository.findById(id)
                .map(todo -> {
                    if (isTodoAuthor(todo)) {
                        todo.setStatus(Status.WONTDO);
                        return update(todo, id);
                    } else {
                        throw new UnAuthorizedOperationException("Modifying other users' todos are not allowed");
                    }
                })
                .orElseThrow(() -> new TodoNotFoundException(id));

    }

    @PostMapping("/todos/{id}/undo")
    @ResponseStatus(HttpStatus.OK)
    public Resource<Todo> unDo(@PathVariable Integer id) {
        return repository.findById(id)
                .map(todo -> {
                    if (isTodoAuthor(todo)) {
                        todo.setStatus(Status.TODO);
                        return update(todo, id);
                    } else {
                        throw new UnAuthorizedOperationException("Modifying other users' todos are not allowed");
                    }
                })
                .orElseThrow(() -> new TodoNotFoundException(id));

    }

    @PutMapping("/todos/{id}")
    @ResponseStatus(HttpStatus.OK)
    public Resource<Todo> update(@RequestBody Todo newTodo, @PathVariable Integer id) {
        Todo updatedTodo = repository.findById(id)
                .map(todo -> {
                    if (newTodo.getTitle()!=null) { todo.setTitle(newTodo.getTitle());}
                    if (newTodo.getStatus()!=null) {todo.setStatus(newTodo.getStatus());}
                    if (newTodo.getPriority()!=null) {todo.setPriority(newTodo.getPriority());}
                    if (newTodo.getDescription()!=null) {todo.setDescription(newTodo.getDescription());}
                    return repository.save(todo);
                })
                .orElseThrow(() -> new TodoNotFoundException(id));

        return assembler.toResource(updatedTodo);
    }

    @DeleteMapping("/todos/{id}")
    @ResponseStatus(HttpStatus.OK)
    public void delete(@PathVariable Integer id) {
        Todo todo = repository.findById(id)
                .orElseThrow(() -> new TodoNotFoundException((id)));
        repository.delete(todo);
    }

    TodoUserDetail getLoggedInUser() {
        return (TodoUserDetail) SecurityContextHolder.getContext().getAuthentication()
                .getPrincipal();
    }

    boolean isTodoAuthor(Todo todo) {
        TodoUserDetail todoUserDetail = getLoggedInUser();
        return todo.getUser().getId() == todoUserDetail.getTodoUser().getId();
    }
}
