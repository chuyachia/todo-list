package com.todolist.api.model.enums;

import java.util.Arrays;
import java.util.Collections;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

public enum Status {

    TODO("T"),
    INPROGRESS("I"),
    DONE("D"),
    WONTDO("W");

    private static final Map<String, Status> VALUES_MAP;

    static {
        Map<String, Status> map = Arrays.stream(Status.values())
                .collect(Collectors
                        .toConcurrentMap(s -> s.code, Function.identity()));

        VALUES_MAP = Collections.unmodifiableMap(map);
    }

    private String code;

    Status(String code) {
        this.code = code;
    }

    public String getCode() {
        return code;
    }

    public static Status getValue(String code) {
        return VALUES_MAP.get(code);
    }

    @Override
    public String toString() {
        return code;
    }
}
