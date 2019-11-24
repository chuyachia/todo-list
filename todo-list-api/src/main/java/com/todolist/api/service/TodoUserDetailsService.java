package com.todolist.api.service;

import com.todolist.api.exception.UserNotFoundException;
import com.todolist.api.model.TodoUser;
import com.todolist.api.model.TodoUserDetail;
import com.todolist.api.model.UserRole;
import com.todolist.api.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;


@Service
public class TodoUserDetailsService implements UserDetailsService {

    @Autowired
    private UserRepository repository;

    @Override
    @Transactional
    public UserDetails loadUserByUsername(String username) {
        TodoUser user = repository.findByUsername(username);
        if (user == null) {
            throw new UserNotFoundException(username);
        }

        return buildUserDetails(user);
    }

    private UserDetails buildUserDetails(TodoUser user) {
        TodoUserDetail todoUserDetail = new TodoUserDetail(user.getUsername(), user.getPassword(), buildUserAuthority((user.getRoles())));
        todoUserDetail.setTodoUser(user);

        return todoUserDetail;
    }

    private List<GrantedAuthority> buildUserAuthority(List<UserRole> userRoles) {
        return userRoles.stream().map(role -> new SimpleGrantedAuthority(role.getRole().getCode()))
                .collect(Collectors.toList());
    }
}
