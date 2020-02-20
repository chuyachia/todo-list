package com.todolist.security.service;

import com.todolist.security.repository.UserRepository;
import com.todolist.security.model.AuthUser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityExistsException;
import java.util.Optional;

@Service
@Transactional
public class AuthUserService implements IAuthUserService {

    @Autowired
    private UserRepository repository;

    @Override
    public void registerNewUser(AuthUser user) {
        Optional<AuthUser> existingUser = repository.findById(user.getUsername());
        if (existingUser.isPresent()) {
            throw new EntityExistsException(existingUser.get().getUsername());
        } else {
            repository.save(user);
        }
    }
}
