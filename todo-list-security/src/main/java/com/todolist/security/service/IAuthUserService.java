package com.todolist.security.service;

import com.todolist.security.model.AuthUser;

public interface IAuthUserService {
    void registerNewUser(AuthUser user);
}
