package com.todolist.api.repository;

import com.todolist.api.model.Todo;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.QueryHints;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.QueryHint;
import java.util.List;
import java.util.Optional;
import java.util.stream.Stream;

@Repository
public interface TodoRepository extends JpaRepository<Todo,Integer> {
    @Cacheable(cacheNames = "todos", unless="#result==null")
    Optional<Todo> findById(Integer id);

    List<Todo> findByUserUsername(String username);

    @QueryHints(value = @QueryHint(name ="org.hibernate.fetchSize", value = "" + Integer.MIN_VALUE))
    @Query("SELECT t FROM Todo t")
    Stream<Todo> streamAll();
}
