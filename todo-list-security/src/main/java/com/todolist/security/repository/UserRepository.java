package com.todolist.security.repository;

import com.todolist.security.repository.com.todolist.security.model.AuthorizationUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<AuthorizationUser,Integer> {

    AuthorizationUser findByUsername(String username);
}
