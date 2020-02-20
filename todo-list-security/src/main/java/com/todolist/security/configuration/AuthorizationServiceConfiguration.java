package com.todolist.security.configuration;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.oauth2.config.annotation.configurers.ClientDetailsServiceConfigurer;
import org.springframework.security.oauth2.config.annotation.web.configuration.AuthorizationServerConfigurerAdapter;
import org.springframework.security.oauth2.config.annotation.web.configuration.EnableAuthorizationServer;
import org.springframework.security.oauth2.config.annotation.web.configurers.AuthorizationServerSecurityConfigurer;

@Configuration
@EnableAuthorizationServer
public class AuthorizationServiceConfiguration extends AuthorizationServerConfigurerAdapter {
// client_id=todo-list-api&grant_type=authorization_code&response_type=code&scope=any
@Autowired
private BCryptPasswordEncoder passwordEncoder;
    @Override
    public void configure(AuthorizationServerSecurityConfigurer security) throws Exception {
        security
                .tokenKeyAccess("permitAll()")
                .checkTokenAccess("isAuthenticated()")
                .allowFormAuthenticationForClients();
    }
    //localhost:8089/oauth/authorize?client_id=todo-list-api&response_type=code&scope=any
    //http://localhost:8089/oauth/token?code=Oy4a34&grant_type=authorization_code
    @Override
    public void configure(ClientDetailsServiceConfigurer clients) throws Exception {
        clients
                .inMemory()
                .withClient("todo-list-api").secret(passwordEncoder.encode("dev-secret"))
                .authorizedGrantTypes("password", "authorization_code", "refresh_token")
                .authorities("READ_ONLY_CLIENT")
                .scopes("any")
                .resourceIds("oauth2-resource")
                .redirectUris("http://localhost:8089/login")
                .accessTokenValiditySeconds(120000)
                .refreshTokenValiditySeconds(240000);
    }
}
