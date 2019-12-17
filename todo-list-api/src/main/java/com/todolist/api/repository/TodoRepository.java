package com.todolist.api.repository;

import com.todolist.api.model.Todo;
import com.todolist.api.model.enums.Priority;
import com.todolist.api.model.enums.Status;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.QueryHints;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.QueryHint;
import java.util.List;
import java.util.Optional;
import java.util.stream.Stream;

@Repository
public interface TodoRepository extends JpaRepository<Todo, Integer> {
    @Cacheable(cacheNames = "todos", unless = "#result==null")
    Optional<Todo> findById(Integer id);

    List<Todo> findByUserUsername(String username);

    @Query("SELECT t FROM Todo t LEFT JOIN t.user u " +
            "WHERE (:username is null OR u.username = :username) " +
            "AND (LOWER(t.title) LIKE %:searchString% " +
            "OR LOWER(t.description) LIKE %:searchString% " +
            "OR LOWER(t.priority) LIKE %:searchString% " +
            "OR LOWER(t.status) LIKE %:searchString%)")
    List<Todo> findBySearchString(@Param("searchString") String searchString, @Param("username") String username);

    List<Todo> findByPriority(Priority priority);

    List<Todo> findByPriorityAndUserUsername(Priority priority, String username);

    List<Todo> findByStatus(Status status);

    List<Todo> findByStatusAndUserUsername(Status status, String username);

    @QueryHints(value = @QueryHint(name = "org.hibernate.fetchSize", value = "" + Integer.MIN_VALUE))
    @Query("SELECT t FROM Todo t")
    Stream<Todo> streamAll();
}
