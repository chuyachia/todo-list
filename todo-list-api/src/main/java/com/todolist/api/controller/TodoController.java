package com.todolist.api.controller;

import com.todolist.api.model.Todo;
import com.todolist.api.repository.TodoRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

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
    Todo create(@RequestBody Todo newTodo) {
        return repository.save(newTodo);
    }
}
