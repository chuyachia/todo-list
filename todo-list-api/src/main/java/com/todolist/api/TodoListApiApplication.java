// TODO improve docker setup, add ui
package com.todolist.api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(scanBasePackages = {"com.todolist.api"})
public class TodoListApiApplication {

    public static void main(String... args) {
        SpringApplication.run(TodoListApiApplication.class, args);
    }
}
