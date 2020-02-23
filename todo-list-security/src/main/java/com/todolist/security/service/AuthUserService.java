package com.todolist.security.service;

import com.todolist.security.repository.UserRepository;
import com.todolist.security.model.AuthUser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityExistsException;
import java.util.Optional;

@Service
@Transactional
public class AuthUserService implements IAuthUserService {

    @Autowired
    private UserRepository repository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void registerNewUser(AuthUser user) {
        Optional<AuthUser> existingUser = repository.findById(user.getUsername());
        if (existingUser.isPresent()) {
            throw new EntityExistsException(String.format("User %s already exists", existingUser.get().getUsername()));
        } else {
            user.setPassword(passwordEncoder.encode(user.getPassword()));
            AuthUser savedUser = repository.save(user);
            // Authenticate newly registered user
            UsernamePasswordAuthenticationToken auth
                    = new UsernamePasswordAuthenticationToken(savedUser.getUsername(), savedUser.getPassword(), null);
            SecurityContextHolder.getContext().setAuthentication(auth);
        }
    }
}
