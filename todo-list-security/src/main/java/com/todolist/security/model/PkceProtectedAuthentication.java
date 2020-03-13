package com.todolist.security.model;

import org.springframework.security.oauth2.common.exceptions.InvalidGrantException;
import org.springframework.security.oauth2.provider.OAuth2Authentication;

import java.io.Serializable;

public class PkceProtectedAuthentication implements Serializable {

    private static final long serialVersionUID = -2497941503429890572L;

    private final OAuth2Authentication authentication;
    private final CodeChallengeMethod codeChallengeMethod;
    private final String codeChallenge;

    public PkceProtectedAuthentication(OAuth2Authentication authentication) {
        this.authentication = authentication;
        this.codeChallengeMethod = CodeChallengeMethod.NONE;
        this.codeChallenge = null;
    }

    public PkceProtectedAuthentication(OAuth2Authentication authentication, CodeChallengeMethod codeChallengeMethod, String codeChallenge) {
        this.authentication = authentication;
        this.codeChallengeMethod = codeChallengeMethod;
        this.codeChallenge = codeChallenge;
    }

    public OAuth2Authentication verifierCodeAndGetAuthentication(String codeVerifier) {
        if (codeChallengeMethod == CodeChallengeMethod.NONE ||
                codeChallengeMethod.transform(codeVerifier).equals(codeChallenge)) {
            return authentication;
        } else {
            throw new InvalidGrantException("Invalid code verifier");
        }
    }
}
