package com.todolist.api.controller;

import com.todolist.api.exception.TodoNotFoundException;
import com.todolist.api.model.Todo;
import com.todolist.api.model.TodoResourceAssembler;
import com.todolist.api.model.enums.Status;
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
        newTodo.setStatus(Status.TODO);
        Todo todo = repository.save(newTodo);
        return assembler.toResource(todo);
    }

    @PostMapping("/todos/{id}/done")
    @ResponseStatus(HttpStatus.OK)
    public Resource<Todo> done(@PathVariable Integer id) {
        Todo updatedTodo = repository.findById(id)
                .map(todo -> {
                    todo.setStatus(Status.DONE);
                    return repository.save(todo);
                })
                .orElseThrow(() -> new TodoNotFoundException(id));
        return assembler.toResource(updatedTodo);
    }

    @PostMapping("/todos/{id}/in-progress")
    @ResponseStatus(HttpStatus.OK)
    public Resource<Todo> inProgress(@PathVariable Integer id) {
        Todo updatedTodo = repository.findById(id)
                .map(todo -> {
                    todo.setStatus(Status.INPROGRESS);
                    return repository.save(todo);
                })
                .orElseThrow(() -> new TodoNotFoundException(id));
        return assembler.toResource(updatedTodo);
    }

    @PostMapping("/todos/{id}/wont-do")
    @ResponseStatus(HttpStatus.OK)
    public Resource<Todo> wontDo(@PathVariable Integer id) {
        Todo updatedTodo = repository.findById(id)
                .map(todo -> {
                    todo.setStatus(Status.WONTDO);
                    return repository.save(todo);
                })
                .orElseThrow(() -> new TodoNotFoundException(id));
        return assembler.toResource(updatedTodo);
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
    public void delete(@PathVariable Integer id) {
        Todo todo = repository.findById(id)
                .orElseThrow(() -> new TodoNotFoundException((id)));
        repository.delete(todo);
    }
}
