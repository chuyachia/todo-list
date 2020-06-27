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

    LOW("Low", 0),
    MEDIUM("Medium", 1),
    HIGH("High", 2);

    private static final Map<String, Priority> VALUES_MAP;
    private static final Map<Integer, Priority> NUMBER_VALUES_MAP;

    static {
        Map<String, Priority> map = Arrays.stream(Priority.values())
                .collect(Collectors
                        .toConcurrentMap(p -> p.name, Function.identity()));

        VALUES_MAP = Collections.unmodifiableMap(map);

        Map<Integer, Priority> numberMap = Arrays.stream(Priority.values())
                .collect(Collectors
                        .toConcurrentMap(p -> p.number, Function.identity()));

        NUMBER_VALUES_MAP = Collections.unmodifiableMap(numberMap);
    }

    private String name;
    private Integer number;

    Priority(String name, Integer number) {
        this.name = name;
        this.number= number;
    }

    public int getNumber() {return number;}

    public static Priority getValueFromNumber(Integer number) {return NUMBER_VALUES_MAP.get(number);}

    @JsonValue
    public String getName() {
        return name;
    }

    @JsonCreator
    public static Priority getValue(String name) {
        return VALUES_MAP.get(name);
    }
}
