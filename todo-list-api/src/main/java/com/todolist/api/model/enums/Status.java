package com.todolist.api.model.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

import java.util.Arrays;
import java.util.Collections;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

public enum Status {

    TODO("To Do"),
    INPROGRESS("In Progress"),
    DONE("Done"),
    WONTDO("Won't Do");


    private static final Map<String, Status> VALUES_MAP;

    static {
        Map<String, Status> map = Arrays.stream(Status.values())
                .collect(Collectors
                        .toConcurrentMap(p -> p.name, Function.identity()));

        VALUES_MAP = Collections.unmodifiableMap(map);
    }

    private String name;

    Status(String name) {
        this.name= name;
    }

    @JsonValue
    public String getName() {
        return name;
    }

    @JsonCreator
    public static Status getValue(String name) {
        return VALUES_MAP.get(name);
    }
}
