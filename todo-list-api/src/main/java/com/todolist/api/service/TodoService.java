package com.todolist.api.service;

import com.todolist.api.model.Todo;
import com.todolist.api.repository.TodoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.io.OutputStream;
import java.util.Arrays;
import java.util.stream.Stream;

@Service
public class TodoService implements ITodoService {
    @Autowired
    private TodoRepository repository;

    @Override
    @Transactional(readOnly = true)
    public void streamTodos(OutputStream outputStream) {
        Stream<Todo> todoStream = repository.streamAll();
        writeCSVHeader(outputStream);
        todoStream.forEach(todo -> writeCSVRow(todo,outputStream));
    }

    private void writeCSVHeader(OutputStream outputStream) {
         Arrays.asList(Todo.class.getDeclaredFields()).stream()
                 .map(field -> field.getName())
                 .reduce((x, y) -> x +";" + y)
                 .ifPresent(s -> {
                     try {
                         outputStream.write(s.getBytes());
                         outputStream.write("\n".getBytes());
                     } catch (IOException e) {
                         e.printStackTrace();
                     }
                 });
    }

    private void writeCSVRow(Todo todo, OutputStream outputStream) {
        try {
            outputStream.write(todo.toCSVString().getBytes());
            outputStream.write("\n".getBytes());
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
