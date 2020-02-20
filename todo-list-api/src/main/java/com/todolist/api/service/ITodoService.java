package com.todolist.api.service;

import com.todolist.api.model.Todo;
import com.todolist.api.model.enums.Priority;
import com.todolist.api.model.enums.Status;
import org.springframework.data.domain.Page;

import java.io.OutputStream;

public interface ITodoService {
    Page<Todo> findAll(int page, int size);
    Page<Todo> findByUserUsername(String username, int page, int size);
    Page<Todo> findByCriteria(String q, Priority p, Status s, String user, int page, int size);
    Todo findById(Integer id);
    Todo updateStatus(Integer id, Status status);
    Todo update(Integer id, Todo todo);
    Todo save(Todo todo);
    void delete(Integer id);
    void streamAll(OutputStream outputStream, String q, String username);
}
