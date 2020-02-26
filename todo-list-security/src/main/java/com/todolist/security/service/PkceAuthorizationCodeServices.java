package com.todolist.security.service;

import com.todolist.security.model.CodeChallengeMethod;
import com.todolist.security.model.PkceProtectedAuthentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.common.exceptions.InvalidGrantException;
import org.springframework.security.oauth2.common.exceptions.InvalidRequestException;
import org.springframework.security.oauth2.common.util.RandomValueStringGenerator;
import org.springframework.security.oauth2.provider.ClientDetailsService;
import org.springframework.security.oauth2.provider.OAuth2Authentication;
import org.springframework.security.oauth2.provider.code.AuthorizationCodeServices;

import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

public class PkceAuthorizationCodeServices implements AuthorizationCodeServices {

    private final RandomValueStringGenerator generator = new RandomValueStringGenerator();
    // TODO put in DB
    private final ConcurrentHashMap<String, PkceProtectedAuthentication> authorizationCodeStore = new ConcurrentHashMap<>();

    private final ClientDetailsService clientDetailsService;
    private final PasswordEncoder passwordEncoder;

    public PkceAuthorizationCodeServices(ClientDetailsService clientDetailsService, PasswordEncoder passwordEncoder) {
        this.clientDetailsService = clientDetailsService;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public String createAuthorizationCode(OAuth2Authentication authentication) {
        PkceProtectedAuthentication pkceProtectedAuthentication = convertOauth2ToPkceProtected(authentication);
        String code = generator.generate();
        authorizationCodeStore.put(code, pkceProtectedAuthentication);

        return code;
    }

    @Override
    public OAuth2Authentication consumeAuthorizationCode(String code) throws InvalidGrantException {
        throw new UnsupportedOperationException();
    }

    public OAuth2Authentication consumeAuthorizationCodeAndCodeVerifier(String code, String codeVerifier) throws InvalidGrantException {
        PkceProtectedAuthentication auth = this.authorizationCodeStore.remove(code);
        return auth.getAuthentication(codeVerifier);
    }

    private PkceProtectedAuthentication convertOauth2ToPkceProtected(OAuth2Authentication authentication) {
        Map<String, String> requestParams = authentication.getOAuth2Request().getRequestParameters();
        String clientId = requestParams.get("client_id");
        String codeChallenge = requestParams.get("code_challenge");

        if (isPublicClient(clientId) && codeChallenge == null) {
            throw new InvalidRequestException("Code challenge is required for public client");
        }

        if (codeChallenge != null) {
            CodeChallengeMethod codeChallengeMethod = getCodeChallengeMethod(requestParams.get("code_challenge_method"));
            return new PkceProtectedAuthentication(authentication, codeChallengeMethod, codeChallenge);
        } else {
            return new PkceProtectedAuthentication(authentication);
        }
    }

    private boolean isPublicClient(String clientId) {
        String clientSecret = clientDetailsService.loadClientByClientId(clientId).getClientSecret();

        return clientSecret == null || passwordEncoder.matches("", clientSecret);
    }

    private CodeChallengeMethod getCodeChallengeMethod(String codeChallengeMethod) {
        return Optional.ofNullable(codeChallengeMethod)
                .map(String::toUpperCase)
                .map(CodeChallengeMethod::valueOf)
                .orElse(CodeChallengeMethod.PLAIN);
    }
}
