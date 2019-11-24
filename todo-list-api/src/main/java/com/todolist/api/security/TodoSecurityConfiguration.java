package com.todolist.api.security;

import com.todolist.api.model.enums.Role;
import com.todolist.api.service.TodoUserDetailsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationFailureHandler;

@Configuration
@EnableWebSecurity
public class TodoSecurityConfiguration extends WebSecurityConfigurerAdapter {

    @Autowired
    private TodoUserDetailsService userDetailsService;
    @Autowired
    private TodoAuthenticationEntryPoint entryPoint;
    @Autowired
    private LoginSuccessHandler loginSuccessHandler;
    @Autowired
    private LogoutSuccessHandler logoutSuccessHandler;
    private SimpleUrlAuthenticationFailureHandler failureHandler = new SimpleUrlAuthenticationFailureHandler();

    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {

        auth
                .userDetailsService(userDetailsService)
                .passwordEncoder(passwordEncoder());
    }

    @Override
    protected void configure(HttpSecurity http)
            throws Exception {

        http
                .csrf()
                .disable()
                .exceptionHandling()
                .authenticationEntryPoint(entryPoint)
                .and()
                .authorizeRequests()
                .antMatchers("/api/todos")
                .authenticated()
//                .antMatchers("/users/**")
//                .hasRole(Role.ADMIN.getCode()) // TODO use enum in hasRole
                .and()
                .formLogin()
                .successHandler(loginSuccessHandler)
                .failureHandler(failureHandler)
                .and()
                .logout()
                .invalidateHttpSession(true)
                .deleteCookies("JSESSIONID")
                .logoutSuccessHandler(logoutSuccessHandler);
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
