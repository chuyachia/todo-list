package com.todolist.api.controller;

import com.todolist.api.exception.TodoNotFoundException;
import com.todolist.api.model.Todo;
import com.todolist.api.model.TodoResourceAssembler;
import com.todolist.api.repository.TodoRepository;
import org.springframework.hateoas.Resource;
import org.springframework.hateoas.Resources;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import static org.springframework.hateoas.mvc.ControllerLinkBuilder.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
public class TodoController {
    private final TodoRepository repository;
    private final TodoResourceAssembler assembler;

    TodoController(TodoRepository repository, TodoResourceAssembler assembler) {
        this.repository = repository;
        this.assembler = assembler;
    }

    @GetMapping("/todos")
    public Resources<Resource<Todo>> getAll() {
        List<Resource<Todo>> todos =repository.findAll().stream()
                .map(todo -> assembler.toResource(todo))
                .collect(Collectors.toList());

        return new Resources<>(todos,
                linkTo(methodOn(TodoController.class).getAll()).withSelfRel());
    }

    @GetMapping("/todos/{id}")
    public Resource<Todo> getOne(@PathVariable Integer id) {
        Todo todo = repository.findById(id)
                .orElseThrow(() -> new TodoNotFoundException(id));
        return assembler.toResource(todo);
    }

    @PostMapping("/todos")
    @ResponseStatus(HttpStatus.CREATED)
    public Resource<Todo> create(@RequestBody Todo newTodo) {
        Todo todo = repository.save(newTodo);
        return assembler.toResource(todo);
    }

    @PutMapping("/todos/{id}")
    @ResponseStatus(HttpStatus.OK)
    public Resource<Todo> update(@RequestBody Todo newTodo, @PathVariable Integer id) {
        Todo updatedTodo = repository.findById(id)
                .map(todo -> {
                    todo.setTitle(newTodo.getTitle());
                    todo.setStatus(newTodo.getStatus());
                    todo.setPriority(newTodo.getPriority());
                    todo.setDescription(newTodo.getDescription());
                    return repository.save(todo);
                })
                .orElseThrow(() -> new TodoNotFoundException(id));
        return assembler.toResource(updatedTodo);
    }

    @DeleteMapping("/todos/{id}")
    @ResponseStatus(HttpStatus.OK)
    public Integer delete(@PathVariable Integer id) {
        return repository.findById(id)
                .map(todo -> {
                    repository.delete(todo);
                    return todo.getId();
                })
                .orElseThrow(() -> new TodoNotFoundException((id)));
    }
}
