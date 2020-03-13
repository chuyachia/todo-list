package com.todolist.security.service;

import com.todolist.security.model.CodeChallengeMethod;
import com.todolist.security.model.PkceProtectedAuthentication;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.support.SqlLobValue;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.common.exceptions.InvalidGrantException;
import org.springframework.security.oauth2.common.exceptions.InvalidRequestException;
import org.springframework.security.oauth2.common.util.RandomValueStringGenerator;
import org.springframework.security.oauth2.common.util.SerializationUtils;
import org.springframework.security.oauth2.provider.ClientDetailsService;
import org.springframework.security.oauth2.provider.OAuth2Authentication;
import org.springframework.security.oauth2.provider.code.AuthorizationCodeServices;
import org.springframework.security.oauth2.provider.code.JdbcAuthorizationCodeServices;
import org.springframework.util.Assert;

import javax.sql.DataSource;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Types;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

public class PkceAuthorizationCodeServices implements AuthorizationCodeServices {
    private static final String DEFAULT_SELECT_STATEMENT = "select code, authentication from oauth_code where code = ?";
    private static final String DEFAULT_INSERT_STATEMENT = "insert into oauth_code (code, authentication) values (?, ?)";
    private static final String DEFAULT_DELETE_STATEMENT = "delete from oauth_code where code = ?";

    private String selectAuthenticationSql = DEFAULT_SELECT_STATEMENT;
    private String insertAuthenticationSql = DEFAULT_INSERT_STATEMENT;
    private String deleteAuthenticationSql = DEFAULT_DELETE_STATEMENT;

    private final RandomValueStringGenerator generator = new RandomValueStringGenerator();

    private final ClientDetailsService clientDetailsService;
    private final PasswordEncoder passwordEncoder;
    private final JdbcTemplate jdbcTemplate;

    public PkceAuthorizationCodeServices(DataSource dataSource, ClientDetailsService clientDetailsService, PasswordEncoder passwordEncoder) {
        Assert.notNull(dataSource, "DataSource required");
        this.jdbcTemplate = new JdbcTemplate(dataSource);
        this.clientDetailsService = clientDetailsService;
        this.passwordEncoder = passwordEncoder;
    }

    protected void store(String code, PkceProtectedAuthentication pkceProtectedAuthentication) {
        jdbcTemplate.update(insertAuthenticationSql,
                new Object[] { code, new SqlLobValue(SerializationUtils.serialize(pkceProtectedAuthentication)) }, new int[] {
                        Types.VARCHAR, Types.BLOB });
    }

    public PkceProtectedAuthentication remove(String code) {
        PkceProtectedAuthentication authentication;

        try {
            authentication = jdbcTemplate.queryForObject(selectAuthenticationSql,
                    new RowMapper<PkceProtectedAuthentication>() {
                        public PkceProtectedAuthentication mapRow(ResultSet rs, int rowNum)
                                throws SQLException {
                            return SerializationUtils.deserialize(rs.getBytes("authentication"));
                        }
                    }, code);
        } catch (EmptyResultDataAccessException e) {
            return null;
        }

        if (authentication != null) {
            jdbcTemplate.update(deleteAuthenticationSql, code);
        }

        return authentication;
    }

    @Override
    public String createAuthorizationCode(OAuth2Authentication authentication) {
        PkceProtectedAuthentication pkceProtectedAuthentication = convertOauth2ToPkceProtected(authentication);
        String code = generator.generate();
        store(code, pkceProtectedAuthentication);

        return code;
    }

    @Override
    public OAuth2Authentication consumeAuthorizationCode(String code) throws InvalidGrantException {
        throw new UnsupportedOperationException();
    }

    public OAuth2Authentication consumeAuthorizationCodeAndCodeVerifier(String code, String codeVerifier) throws InvalidGrantException {
        PkceProtectedAuthentication auth = remove(code);
        return auth.verifierCodeAndGetAuthentication(codeVerifier);
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
       try {
           return Optional.ofNullable(codeChallengeMethod)
                   .map(String::toUpperCase)
                   .map(CodeChallengeMethod::valueOf)
                   .orElse(CodeChallengeMethod.PLAIN);
       } catch(IllegalArgumentException e) {
           throw new InvalidRequestException("Invalid code challenge method: "+ codeChallengeMethod);
       }
    }
}
