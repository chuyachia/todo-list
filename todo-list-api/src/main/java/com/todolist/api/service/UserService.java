package com.todolist.api.service;

import com.todolist.api.exception.UserAlreadyExistsException;
import com.todolist.api.model.TodoUser;
import com.todolist.api.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class UserService implements IUserService{

    @Autowired
    private UserRepository repository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void registerNewUser(TodoUser user) {
        TodoUser existingUser = repository.findByUsername(user.getUsername());
        if (existingUser != null ) {
            throw new UserAlreadyExistsException(existingUser.getUsername());
        } else {
            user.setPassword(passwordEncoder.encode(user.getPassword()));
            user.setRole("USER");
            repository.save(user);
        }
    }
}
