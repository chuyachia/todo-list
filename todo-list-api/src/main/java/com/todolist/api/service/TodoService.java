package com.todolist.api.service;

import com.todolist.api.model.Todo;
import com.todolist.api.model.enums.Priority;
import com.todolist.api.model.enums.Status;
import org.springframework.data.domain.Page;

import java.io.OutputStream;

public interface TodoService {
    Page<Todo> findAll(Integer page, Integer size);
    Page<Todo> findByUserUsername(String username, Integer page, Integer size);
    Page<Todo> findByCriteria(String q, Priority p, Status s, String user, Integer page, Integer size);
    Todo findById(Integer id);
    Todo updateStatus(Integer id, Status status);
    Todo update(Integer id, Todo todo);
    Todo save(Todo todo);
    void delete(Integer id);
    void streamAll(OutputStream outputStream, String q, String username);
}
