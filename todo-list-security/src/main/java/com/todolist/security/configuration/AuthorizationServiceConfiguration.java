package com.todolist.security.configuration;

import com.todolist.security.service.PkceAuthorizationCodeServices;
import com.todolist.security.service.PkceAuthorizationCodeTokenGranter;
import com.zaxxer.hikari.HikariDataSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
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

@Configuration
@EnableAuthorizationServer
public class AuthorizationServiceConfiguration extends AuthorizationServerConfigurerAdapter {
// client_id=todo-list-app&grant_type=authorization_code&response_type=code&scope=any
    private final static String TODO_LIST_APP = "todo-list-app";
    private final static String TODO_LIST_API = "todo-list-api";
    private final static String TODO_LIST_API_SWAGGER = "todo-list-api-swagger";
    private final static int ACCESS_TOKEN_VALIDITY_SEC = 600;
    @Value("${oauth.todo-list-app-callback-url:}")
    private String todoListAppCallbackUrl;
    @Value("${oauth.todo-list-api-swagger-callback-url:}")
    private String todoListApiSwaggerCallbackUrl;
    @Value("${oauth.todo-list-api-swagger-secret:}")
    private String todoListApiSwaggerSecret;
    @Value("${oauth.todo-list-api-secret:}")
    private String todoListApiSecret;

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
        clients
                .inMemory()
                .withClient(TODO_LIST_APP) // public client
                .accessTokenValiditySeconds(ACCESS_TOKEN_VALIDITY_SEC)
                .autoApprove("any")
                .authorizedGrantTypes("authorization_code")
                .redirectUris(todoListAppCallbackUrl)
                .and()
                .withClient(TODO_LIST_API_SWAGGER)
                .secret(this.passwordEncoder.encode(todoListApiSwaggerSecret))
                .authorizedGrantTypes("authorization_code")
                .redirectUris(todoListApiSwaggerCallbackUrl)
                .accessTokenValiditySeconds(ACCESS_TOKEN_VALIDITY_SEC)
                .and()
                .withClient(TODO_LIST_API)
                .secret(this.passwordEncoder.encode(todoListApiSecret));
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
