package com.todolist.api.service;

import java.io.OutputStream;

public interface ITodoService {
    void streamTodos(OutputStream outputStream);
}
