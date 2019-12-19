package com.todolist.api.repository;

import com.todolist.api.model.Todo;
import com.todolist.api.model.enums.Priority;
import com.todolist.api.model.enums.Status;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.QueryHints;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import javax.persistence.QueryHint;
import java.util.List;
import java.util.Optional;
import java.util.stream.Stream;

import static org.hibernate.jpa.QueryHints.HINT_FETCH_SIZE;

@Repository
public interface TodoRepository extends JpaRepository<Todo, Integer> {
    @Cacheable(cacheNames = "todos", unless = "#result==null")
    Optional<Todo> findById(Integer id);

    Page<Todo> findByUserUsername(String username, Pageable pageable);

    @Query("SELECT t FROM Todo t LEFT JOIN t.user u " +
            "WHERE (:username IS NULL OR u.username = :username) " +
            "AND (:searchString IS NULL OR (LOWER(t.title) LIKE %:searchString% " +
            "OR LOWER(t.description) LIKE %:searchString% " +
            "OR LOWER(t.priority) LIKE %:searchString% " +
            "OR LOWER(t.status) LIKE %:searchString% " +
            "OR LOWER(u.username) LIKE %:searchString%))")
    Page<Todo> findBySearchString(@Param("searchString") String searchString, @Param("username") String username, Pageable pageable);

    Page<Todo> findByPriority(Priority priority, Pageable pageable);

    Page<Todo> findByPriorityAndUserUsername(Priority priority, String username, Pageable pageable);

    Page<Todo> findByStatus(Status status, Pageable pageable);

    Page<Todo> findByStatusAndUserUsername(Status status, String username, Pageable pageable);

    @QueryHints(value = @QueryHint(name = HINT_FETCH_SIZE, value = "0"))
    @Query("SELECT t FROM Todo t LEFT JOIN t.user u " +
            "WHERE (:username IS NULL OR u.username = :username) "+
            "AND (:searchString IS NULL OR (LOWER(t.title) LIKE %:searchString% " +
            "OR LOWER(t.description) LIKE %:searchString% " +
            "OR LOWER(t.priority) LIKE %:searchString% " +
            "OR LOWER(t.status) LIKE %:searchString% " +
            "OR LOWER(u.username) LIKE %:searchString%))")
    Stream<Todo> streamAll(@Param("searchString") String searchString, @Param("username") String username);
}
