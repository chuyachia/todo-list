package com.todolist.api.repository;

import com.todolist.api.model.TodoUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<TodoUser,String> {

    Optional<TodoUser> findById(String username);
}
