package com.todolist.api.controller;

import com.todolist.api.exception.TodoNotFoundException;
import com.todolist.api.model.Todo;
import com.todolist.api.repository.TodoRepository;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class TodoController {
    private TodoRepository repository;

    TodoController(TodoRepository repository) {
        this.repository = repository;
    }

    @GetMapping("/todos")
    List<Todo> getAll() {
        return repository.findAll();
    }

    @PostMapping("/todos")
    @ResponseStatus(HttpStatus.CREATED)
    Todo create(@RequestBody Todo newTodo) {
        return repository.save(newTodo);
    }

    @PutMapping("/todos/{id}")
    @ResponseStatus(HttpStatus.OK)
    Todo update(@RequestBody Todo newTodo, @PathVariable Integer id) {
        return repository.findById(id)
                .map(todo-> {
                    todo.setTitle(newTodo.getTitle());
                    todo.setStatus(newTodo.getStatus());
                    todo.setPriority(newTodo.getPriority());
                    todo.setDescription(newTodo.getDescription());
                    return repository.save(todo);
                })
                .orElseThrow(()-> new TodoNotFoundException(id));
    }

    @DeleteMapping("/todos/{id}")
    @ResponseStatus(HttpStatus.OK)
    Integer delete(@PathVariable Integer id) {
        return repository.findById(id)
                .map(todo -> {
                    repository.delete(todo);
                    return todo.getId();
                })
                .orElseThrow(()-> new TodoNotFoundException((id)));
    }
}
