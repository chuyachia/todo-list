package com.todolist.api.repository;

import com.todolist.api.model.Todo;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TodoRepository extends JpaRepository<Todo,Integer> {
    @Cacheable(cacheNames = "todos")
    Optional<Todo> findById(Integer id);
}
