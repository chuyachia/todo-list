// TODO what makes something restful https://spring.io/guides/tutorials/rest/
package com.todolist.api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(scanBasePackages = {"com.todolist.api"})
public class TodoListApiApplication {

    public static void main(String... args) {
        SpringApplication.run(TodoListApiApplication.class, args);
    }
}
