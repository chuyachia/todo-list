package com.todolist.api.service;

import com.todolist.api.exception.InvalidInputException;
import com.todolist.api.exception.UserAlreadyExistsException;
import com.todolist.api.exception.UserNotFoundException;
import com.todolist.api.model.TodoUser;
import com.todolist.api.model.UserRole;
import com.todolist.api.model.enums.Role;
import com.todolist.api.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

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
            UserRole role = new UserRole();
            role.setRole(Role.USER);
            role.setUser(user);
            user.getRoles().add(role);
            repository.save(user);
        }
    }

    @Override
    public TodoUser addUserRole(String username, String role) {
        TodoUser user = repository.findByUsername(username);
        if (user == null) {
            throw new UserNotFoundException(username);
        } else {
            Role newRole = Role.getValue(role);
            if (newRole == null) {
                throw new InvalidInputException(role+" is not a valid role");
            }

            List<String> existingRoles = user.getRoles().stream()
                    .map(userRole->userRole.getRole().toString())
                    .collect(Collectors.toList());
            if (!existingRoles.contains(role)) {
                UserRole newUserRole = new UserRole();
                newUserRole.setRole(newRole);
                newUserRole.setUser(user);
                user.getRoles().add(newUserRole);
            }
            repository.save(user);

            return user;
        }
    }

    @Override
    public TodoUser removeUserRole(String username, String role) {
        TodoUser user = repository.findByUsername(username);
        if (user == null) {
            throw new UserNotFoundException(username);
        } else if (Role.getValue(role)==null){
            throw new InvalidInputException(role+" is not a valid role");
        } else {
            List<UserRole> filteredRoles = user.getRoles().stream()
                    .filter(userRole->userRole.getRole().toString().equals(role))
                    .collect(Collectors.toList());
            user.getRoles().remove(filteredRoles.get(0));
            repository.save(user);

            return user;
        }
    }
}
