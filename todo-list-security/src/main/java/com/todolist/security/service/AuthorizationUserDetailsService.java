package com.todolist.security.service;

import com.todolist.security.repository.UserRepository;
import com.todolist.security.repository.com.todolist.security.model.AuthorizationUser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;


@Service
public class AuthorizationUserDetailsService implements UserDetailsService {
    @Autowired
    private UserRepository repository;

    @Override
    @Transactional
    public UserDetails loadUserByUsername(String username) {
        AuthorizationUser user = repository.findByUsername(username);
        if (user == null) {
            throw new UsernameNotFoundException(username);
        }

        return buildUserDetails(user);
    }

    private UserDetails buildUserDetails(AuthorizationUser user) {
        User userDetail = new User(user.getUsername(), user.getPassword(), Collections.emptyList());

        return userDetail;
    }
}
