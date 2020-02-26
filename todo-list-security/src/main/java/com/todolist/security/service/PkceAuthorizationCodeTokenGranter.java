package com.todolist.security.service;

import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.common.exceptions.InvalidClientException;
import org.springframework.security.oauth2.common.exceptions.InvalidGrantException;
import org.springframework.security.oauth2.common.exceptions.InvalidRequestException;
import org.springframework.security.oauth2.common.exceptions.RedirectMismatchException;
import org.springframework.security.oauth2.common.util.OAuth2Utils;
import org.springframework.security.oauth2.provider.ClientDetails;
import org.springframework.security.oauth2.provider.ClientDetailsService;
import org.springframework.security.oauth2.provider.OAuth2Authentication;
import org.springframework.security.oauth2.provider.OAuth2Request;
import org.springframework.security.oauth2.provider.OAuth2RequestFactory;
import org.springframework.security.oauth2.provider.TokenRequest;
import org.springframework.security.oauth2.provider.code.AuthorizationCodeTokenGranter;
import org.springframework.security.oauth2.provider.token.AuthorizationServerTokenServices;

import java.util.HashMap;
import java.util.Map;

public class PkceAuthorizationCodeTokenGranter extends AuthorizationCodeTokenGranter {
    private final PkceAuthorizationCodeServices pkceAuthorizationCodeServices;

    public PkceAuthorizationCodeTokenGranter(AuthorizationServerTokenServices tokenServices, PkceAuthorizationCodeServices pkceAuthorizationCodeServices, ClientDetailsService clientDetailsService, OAuth2RequestFactory requestFactory) {
        super(tokenServices, pkceAuthorizationCodeServices, clientDetailsService, requestFactory);
        this.pkceAuthorizationCodeServices = pkceAuthorizationCodeServices;
    }

    @Override
    protected OAuth2Authentication getOAuth2Authentication(ClientDetails client, TokenRequest tokenRequest) {
        Map<String, String> parameters = tokenRequest.getRequestParameters();
        String authorizationCode = parameters.get("code");
        String codeVerifier = parameters.getOrDefault("code_verifier", "");
        String redirectUri = parameters.get(OAuth2Utils.REDIRECT_URI);

        if (authorizationCode == null) {
            throw new InvalidRequestException("An authorization code must be supplied.");
        }

        OAuth2Authentication storedAuth = pkceAuthorizationCodeServices.consumeAuthorizationCodeAndCodeVerifier(authorizationCode, codeVerifier);
        if (storedAuth == null) {
            throw new InvalidGrantException("Invalid authorization code: " + authorizationCode);
        }

        OAuth2Request pendingOAuth2Request = storedAuth.getOAuth2Request();
        String redirectUriApprovalParameter = pendingOAuth2Request.getRequestParameters().get(
                OAuth2Utils.REDIRECT_URI);

        if ((redirectUri != null || redirectUriApprovalParameter != null)
                && !pendingOAuth2Request.getRedirectUri().equals(redirectUri)) {
            throw new RedirectMismatchException("Redirect URI mismatch.");
        }

        String pendingClientId = pendingOAuth2Request.getClientId();
        String clientId = tokenRequest.getClientId();
        if (clientId != null && !clientId.equals(pendingClientId)) {
            throw new InvalidClientException("Client ID mismatch");
        }

        Map<String, String> combinedParameters = new HashMap<String, String>(pendingOAuth2Request
                .getRequestParameters());
        combinedParameters.putAll(parameters);

        OAuth2Request finalStoredOAuth2Request = pendingOAuth2Request.createOAuth2Request(combinedParameters);

        Authentication userAuth = storedAuth.getUserAuthentication();

        return new OAuth2Authentication(finalStoredOAuth2Request, userAuth);
    }
}
