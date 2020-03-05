package com.todolist.security.configuration;

import com.todolist.security.service.PkceAuthorizationCodeServices;
import com.todolist.security.service.PkceAuthorizationCodeTokenGranter;
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

@Configuration
@EnableAuthorizationServer
public class AuthorizationServiceConfiguration extends AuthorizationServerConfigurerAdapter {
// client_id=todo-list-app&grant_type=authorization_code&response_type=code&scope=any
    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Autowired
    private ClientDetailsService clientDetailsService;

    @Bean
    public PkceAuthorizationCodeServices pkceAuthorizationCodeServices() {
        return new PkceAuthorizationCodeServices(clientDetailsService, passwordEncoder);
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
        clients
                .inMemory()
                .withClient("todo-list-app") // public client
                .authorizedGrantTypes("authorization_code")
                .redirectUris("http://localhost:3000/oauth-callback")
                .and()
                .withClient("todo-list-api").secret(this.passwordEncoder.encode("dev-secret"))
                .accessTokenValiditySeconds(120000)
                .refreshTokenValiditySeconds(240000);
    }

    @Override
    public void configure(AuthorizationServerEndpointsConfigurer endpoints) throws Exception {
        endpoints.authorizationCodeServices(pkceAuthorizationCodeServices())
        .tokenGranter(new PkceAuthorizationCodeTokenGranter(endpoints.getTokenServices(),
                pkceAuthorizationCodeServices(),endpoints.getClientDetailsService(),
                endpoints.getOAuth2RequestFactory()));
    }
}
