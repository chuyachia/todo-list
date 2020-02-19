package com.todolist.api.service;

import com.todolist.api.exception.UserNotFoundException;
import com.todolist.api.model.TodoUser;
import com.todolist.api.model.TodoUserDetail;
import com.todolist.api.model.enums.Role;
import com.todolist.api.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;


@Service
public class TodoUserDetailsService implements UserDetailsService {

    private String rolePrefix = "ROLE_";

    @Autowired
    private UserRepository repository;
    @Autowired
    private UserService userService;

    @Override
    @Transactional
    public UserDetails loadUserByUsername(String username) {
        TodoUser user = repository.findByUsername(username);
        if (user == null) {
            user = new TodoUser();
            user.setUsername(username);
            userService.registerNewUser(user);
        }

        return buildUserDetails(user);
    }

    private UserDetails buildUserDetails(TodoUser user) {
        TodoUserDetail todoUserDetail = new TodoUserDetail(user.getUsername(), "placeholder", buildUserAuthority((user.getRoles())));
        todoUserDetail.setTodoUser(user);

        return todoUserDetail;
    }

    private List<GrantedAuthority> buildUserAuthority(Set<Role> userRoles) {
        // Need to prefix with ROLE_ because Spring Security by default add this prefix when checking role
        return userRoles.stream().map(role -> new SimpleGrantedAuthority(rolePrefix + role))
                .collect(Collectors.toList());
    }
}
