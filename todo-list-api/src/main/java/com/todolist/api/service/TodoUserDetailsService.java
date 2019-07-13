package com.todolist.api.service;

import com.todolist.api.exception.UserNotFoundException;
import com.todolist.api.model.TodoUser;
import com.todolist.api.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;

@Service
public class TodoUserDetailsService implements UserDetailsService {

    @Autowired
    private UserRepository repository;

    @Override
    public UserDetails loadUserByUsername(String username) {
        TodoUser user = repository.findByUsername(username);
        if (user == null) {
            throw new UserNotFoundException(username);
        }
        return buildUserDetails(user);
    }

    private UserDetails buildUserDetails(TodoUser user) {
        return User.withUsername(user.getUsername())
                .password(user.getPassword())
                .roles(user.getRole()) // roles takes String[]
                .build();
    }
}
