package com.todolist.api.model.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

import javax.persistence.Convert;
import java.util.Collections;
import java.util.Map;
import java.util.Arrays;
import java.util.function.Function;
import java.util.stream.Collectors;

public enum Priority {

    LOW("Low"),
    MEDIUM("Medium"),
    HIGH("High");

    private static final Map<String, Priority> VALUES_MAP;

    static {
        Map<String, Priority> map = Arrays.stream(Priority.values())
                .collect(Collectors
                        .toConcurrentMap(p -> p.name, Function.identity()));

        VALUES_MAP = Collections.unmodifiableMap(map);
    }

    private String name;

    Priority(String name) {
        this.name = name;
    }

    @JsonValue
    public String getName() {
        return name;
    }

    @JsonCreator
    public static Priority getValue(String name) {
        return VALUES_MAP.get(name);
    }
}
