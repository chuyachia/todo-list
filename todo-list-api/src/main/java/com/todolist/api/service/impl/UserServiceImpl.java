package com.todolist.api.service.impl;

import com.todolist.api.exception.UserAlreadyExistsException;
import com.todolist.api.exception.UserNotFoundException;
import com.todolist.api.model.TodoUser;
import com.todolist.api.model.enums.Role;
import com.todolist.api.repository.UserRepository;
import com.todolist.api.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository repository;

    @Override
    public void registerNewUser(TodoUser user) {
        Optional<TodoUser> existingUser = repository.findById(user.getUsername());
        if (existingUser.isPresent()) {
            throw new UserAlreadyExistsException(existingUser.get().getUsername());
        } else {
            user.getRoles().add(Role.USER);
            repository.save(user);
        }
    }

    @Override
    public List<TodoUser> findAll() {
        return repository.findAll();
    }

    @Override
    public TodoUser findById(String username) {
        return repository.findById(username)
                .orElseThrow(()-> new UserNotFoundException(username));
    }

    @Override
    public TodoUser addUserRole(String username, Role role) {
        TodoUser user = findById(username);
        user.getRoles().add(role);
        repository.save(user);

        return user;
    }

    @Override
    public TodoUser removeUserRole(String username, Role role) {
        TodoUser user = findById(username);
        user.getRoles().remove(role);
        repository.save(user);

        return user;
    }
}
