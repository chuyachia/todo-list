package com.todolist.security.controller;

import com.todolist.security.model.AuthUser;
import com.todolist.security.service.IAuthUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.security.web.savedrequest.DefaultSavedRequest;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
import org.springframework.web.servlet.view.RedirectView;

import javax.servlet.http.HttpSession;
import javax.validation.Valid;

@RestController
public class AuthController {
    private static final String SPRING_SECURITY_SAVED_REQUEST = "SPRING_SECURITY_SAVED_REQUEST";

    @Autowired
    private IAuthUserService service;

    @PostMapping(value ="/register",  consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE )
    public RedirectView create(@Valid AuthUser newUser) {
        RedirectView redirectView = new RedirectView();
            try {
                service.registerNewUser(newUser);
            } catch (RuntimeException e) {
                redirectView.setUrl("/login?error=registrationError");

                return redirectView;
            }

            ServletRequestAttributes attr = (ServletRequestAttributes) RequestContextHolder.currentRequestAttributes();
            HttpSession session = attr.getRequest().getSession();
            DefaultSavedRequest request = (DefaultSavedRequest) session.getAttribute(SPRING_SECURITY_SAVED_REQUEST);

            if (request == null) {
                redirectView.setUrl("/login?success=registered");
                return redirectView;
            } else {
                redirectView.setUrl(request.getRedirectUrl());
                return redirectView;
            }

            // TODO handle register error display on login html

    }
}
