package com.todolist.api.repository;

import com.todolist.api.model.TodoUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<TodoUser,String> {

    TodoUser findByUsername(String username);
}
