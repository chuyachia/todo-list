package com.todolist.api.model.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

import java.util.Arrays;
import java.util.Collections;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

public enum Role {

    ADMIN("A"),
    USER("U");

    private static final Map<String, Role> VALUES_MAP;

    static {
        Map<String, Role> map = Arrays.stream(Role.values())
                .collect(Collectors
                        .toConcurrentMap(r -> r.code, Function.identity()));
        VALUES_MAP = Collections.unmodifiableMap(map);
    }

    private String code;

    Role(String role) { this.code = role; }

    @JsonCreator
    public static Role getValue(String code) {
        return VALUES_MAP.get(code);
    }

    @JsonValue
    public String getName() {
        return code;
    }

}
