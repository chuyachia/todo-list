package com.todolist.api.configuration;

import com.todolist.api.model.enums.Role;
import com.todolist.api.service.impl.TodoUserDetailsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.config.annotation.web.configuration.EnableResourceServer;
import org.springframework.security.oauth2.config.annotation.web.configuration.ResourceServerConfigurerAdapter;
import org.springframework.security.oauth2.config.annotation.web.configurers.ResourceServerSecurityConfigurer;
import org.springframework.security.oauth2.provider.token.AccessTokenConverter;
import org.springframework.security.oauth2.provider.token.DefaultAccessTokenConverter;
import org.springframework.security.oauth2.provider.token.DefaultUserAuthenticationConverter;
import org.springframework.security.oauth2.provider.token.RemoteTokenServices;
import org.springframework.security.oauth2.provider.token.UserAuthenticationConverter;

@Configuration
@EnableResourceServer
public class TodoSecurityConfiguration extends ResourceServerConfigurerAdapter {
    private final static String CLIENT_ID = "todo-list-api";
    @Value("${oauth.todo-list-api-secret:}")
    String clientSecret;
    @Value("${oauth.check-token-endpoint:}")
    String checkTokenEndpoint;

    @Autowired
    private TodoUserDetailsService userDetailsService;

    @Bean
    public UserAuthenticationConverter userAuthenticationConverter () {
        DefaultUserAuthenticationConverter userAuthenticationConverter = new DefaultUserAuthenticationConverter();
        // So that username returned from auth server can be convert to user details
        userAuthenticationConverter.setUserDetailsService(userDetailsService);
        return userAuthenticationConverter;
    }

    @Bean
    public AccessTokenConverter accessTokenConverter() {
        DefaultAccessTokenConverter accessTokenConverter = new DefaultAccessTokenConverter();
        accessTokenConverter.setUserTokenConverter(userAuthenticationConverter());
        return accessTokenConverter;
    }

    @Override
    public void configure(ResourceServerSecurityConfigurer resources) {
        RemoteTokenServices remoteTokenServices = new RemoteTokenServices();
        remoteTokenServices.setCheckTokenEndpointUrl(checkTokenEndpoint);
        remoteTokenServices.setClientId(CLIENT_ID);
        remoteTokenServices.setClientSecret(clientSecret);
        remoteTokenServices.setAccessTokenConverter(accessTokenConverter());

        resources.tokenServices(remoteTokenServices);
    }

    @Override
    public void configure(HttpSecurity http) throws Exception {
        http
                .authorizeRequests()
                .antMatchers(HttpMethod.GET, "/api/todos/**")
                .permitAll()
                .antMatchers("/api/todos/**", "/user-info")
                .authenticated()
                .antMatchers("/users/**")
                .hasRole(Role.ADMIN.getName());
    }

    @Bean
    PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
