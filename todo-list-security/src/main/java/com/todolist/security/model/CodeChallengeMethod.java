package com.todolist.security.model;


import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;

public enum CodeChallengeMethod {
    S256 {
        @Override
        public String transform(String codeVerifier) {
            String transformedCodeVerifier = null;
            try {
                MessageDigest digest =MessageDigest.getInstance("SHA-256");
                byte[] hash = digest.digest(codeVerifier.getBytes(StandardCharsets.UTF_8));
                transformedCodeVerifier = Base64.getUrlEncoder().encodeToString(hash);
            } catch (NoSuchAlgorithmException e) {
                // TODO throw appropriate exception
            }

            return transformedCodeVerifier;
        }
    },
    PLAIN {
        @Override
        public String transform(String codeVerifier) {
            return  codeVerifier;
        }
    },
    NONE {
        @Override
        public String transform(String codeVerifier) {
            throw new UnsupportedOperationException();
        }
    };

    public abstract String transform(String codeVerifier);
}
