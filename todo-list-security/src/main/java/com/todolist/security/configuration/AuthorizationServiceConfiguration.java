package com.todolist.security.configuration;

import com.todolist.security.service.PkceAuthorizationCodeServices;
import com.todolist.security.service.PkceAuthorizationCodeTokenGranter;
import com.zaxxer.hikari.HikariDataSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.oauth2.config.annotation.configurers.ClientDetailsServiceConfigurer;
import org.springframework.security.oauth2.config.annotation.web.configuration.AuthorizationServerConfigurerAdapter;
import org.springframework.security.oauth2.config.annotation.web.configuration.EnableAuthorizationServer;
import org.springframework.security.oauth2.config.annotation.web.configurers.AuthorizationServerEndpointsConfigurer;
import org.springframework.security.oauth2.config.annotation.web.configurers.AuthorizationServerSecurityConfigurer;
import org.springframework.security.oauth2.provider.ClientDetailsService;
import org.springframework.security.oauth2.provider.token.TokenStore;
import org.springframework.security.oauth2.provider.token.store.JdbcTokenStore;

import javax.sql.DataSource;

@Configuration
@EnableAuthorizationServer
public class AuthorizationServiceConfiguration extends AuthorizationServerConfigurerAdapter {
// client_id=todo-list-app&grant_type=authorization_code&response_type=code&scope=any
    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Autowired
    private ClientDetailsService clientDetailsService;

    @Autowired
    private HikariDataSource dataSource;

    @Bean
    public TokenStore tokenStore() {
        return new JdbcTokenStore(dataSource);
    }

    @Bean
    public PkceAuthorizationCodeServices pkceAuthorizationCodeServices() {
        return new PkceAuthorizationCodeServices(dataSource, clientDetailsService, passwordEncoder);
    }

    @Override
    public void configure(AuthorizationServerSecurityConfigurer security) throws Exception {
        security
                .tokenKeyAccess("permitAll()")
                .checkTokenAccess("isAuthenticated()")
                .allowFormAuthenticationForClients()
                .passwordEncoder(passwordEncoder);
    }

    @Override
    public void configure(ClientDetailsServiceConfigurer clients) throws Exception {
        // TODO put client details in DB
        // TODO externalize configs
        clients
                .inMemory()
                .withClient("todo-list-app") // public client
                .autoApprove("any")
//                .accessTokenValiditySeconds(1800)
                .accessTokenValiditySeconds(30)
                .authorizedGrantTypes("authorization_code")
                .redirectUris("http://localhost:3000/oauth-callback")
                .and()
                .withClient("todo-list-api")
                .secret(this.passwordEncoder.encode("dev-secret"));
    }

    @Override
    public void configure(AuthorizationServerEndpointsConfigurer endpoints) throws Exception {
        endpoints
                .tokenStore(tokenStore())
                .authorizationCodeServices(pkceAuthorizationCodeServices())
                .tokenGranter(new PkceAuthorizationCodeTokenGranter(endpoints.getTokenServices(),
                        pkceAuthorizationCodeServices(),endpoints.getClientDetailsService(),
                        endpoints.getOAuth2RequestFactory()));
    }
}
