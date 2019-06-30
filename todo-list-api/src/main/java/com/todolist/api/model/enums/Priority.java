package com.todolist.api.model.enums;

import java.util.Collections;
import java.util.Map;
import java.util.Arrays;
import java.util.function.Function;
import java.util.stream.Collectors;

public enum Priority {

    LOW("L"),
    MEDIUM("M"),
    HIGH("H");

    private static final Map<String, Priority> VALUES_MAP;

    static {
        Map<String, Priority> map = Arrays.stream(Priority.values())
                .collect(Collectors
                        .toConcurrentMap(p -> p.code, Function.identity()));

        VALUES_MAP = Collections.unmodifiableMap(map);
    }

    private String code;

    private Priority(String code) {
        this.code = code;
    }

    public String getCode() {
        return code;
    }

    public static Priority getValue(String code) {
        return VALUES_MAP.get(code);
    }

    @Override
    public String toString() {
        return code;
    }

}
