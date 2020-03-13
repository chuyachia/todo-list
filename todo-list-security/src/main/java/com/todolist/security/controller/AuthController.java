package com.todolist.security.controller;

import com.todolist.security.model.AuthUser;
import com.todolist.security.service.IAuthUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.provider.token.ConsumerTokenServices;
import org.springframework.security.web.savedrequest.DefaultSavedRequest;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
import org.springframework.web.servlet.view.RedirectView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import javax.validation.Valid;

@RestController
public class AuthController {
    private static final String SPRING_SECURITY_SAVED_REQUEST = "SPRING_SECURITY_SAVED_REQUEST";
    @Autowired
    private IAuthUserService service;

    @Autowired
    private ConsumerTokenServices tokenService;

    @DeleteMapping(value = "/oauth/revoke-token")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void revokeToken(HttpServletRequest request) {
        String authorization = request.getHeader("Authorization");
        if (authorization != null && authorization.contains("Bearer")) {
            String token = authorization.substring("Bearer".length()+1);
            tokenService.revokeToken(token);
        }
        HttpSession session = request.getSession(false);
        if (session != null) {
            session.invalidate();
        }

        SecurityContextHolder.clearContext();
    }

    @PostMapping(value = "/register", consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE)
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
        } else {
            redirectView.setUrl(request.getRedirectUrl());
        }
        return redirectView;
    }
}
