// https://www.baeldung.com/spring-security-authentication-with-a-database
//https://www.baeldung.com/securing-a-restful-web-service-with-spring-security
//https://www.baeldung.com/spring-security-registration-password-encoding-bcrypt

// TODO /login is not found
package com.todolist.api.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationFailureHandler;

@Configuration
@EnableWebSecurity
public class SecurityAdapter extends WebSecurityConfigurerAdapter {

    @Autowired
    private TodoUserDetailsService userDetailsService;
    @Autowired
    private TodoAuthenticationEntryPoint entryPoint;
    @Autowired
    private SuccessHandler successHandler;
    private SimpleUrlAuthenticationFailureHandler failureHandler = new SimpleUrlAuthenticationFailureHandler();

    @Override
    protected void configure(AuthenticationManagerBuilder builder)
            throws Exception {
        builder.userDetailsService(userDetailsService)
                .passwordEncoder(encoder());
    }

    @Override
    protected void configure(HttpSecurity http)
            throws Exception {
        http
        .csrf().disable()
        .exceptionHandling()
        .authenticationEntryPoint(entryPoint)
        .and()
        .authorizeRequests()
        .antMatchers("/api/**").authenticated()
        .and()
        .formLogin()
        .loginProcessingUrl("/login")
        .successHandler(successHandler)
        .failureHandler(failureHandler)
        .and()
        .logout();
    }

    @Bean
    public PasswordEncoder encoder() {
        return new BCryptPasswordEncoder(11);
    }
}
