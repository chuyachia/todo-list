package com.todolist.security.service;

import com.todolist.security.repository.UserRepository;
import com.todolist.security.model.AuthUser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;


@Service
public class AuthUserDetailsService implements UserDetailsService {
    @Autowired
    private UserRepository repository;

    @Override
    @Transactional
    public UserDetails loadUserByUsername(String username) {
        AuthUser user = repository.findById(username)
                .orElseThrow(() -> new UsernameNotFoundException(username));

        return buildUserDetails(user);
    }

    private UserDetails buildUserDetails(AuthUser user) {
        User userDetail = new User(user.getUsername(), user.getPassword(), Collections.emptyList());

        return userDetail;
    }
}
