package com.todolist.api.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.todolist.api.model.converter.RoleConverter;
import com.todolist.api.model.enums.Role;
import lombok.Data;
import lombok.ToString;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Data
@ToString(exclude = {"roles", "todos"}) // To avoid infinite loop
@Entity
@Table(name = "users")
public class TodoUser {

    @Id
    @Column(nullable = false, unique = true)
    private String username;
    @ElementCollection
    @Convert(converter = RoleConverter.class)
    @CollectionTable(name = "users_roles", joinColumns = @JoinColumn(name = "username"))
    @Column(name = "rolename")
    private Set<Role> roles = new HashSet<>();
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    @JsonBackReference
    @OneToMany(cascade = CascadeType.ALL, mappedBy = "user", orphanRemoval = true)
    private List<Todo> todos = new ArrayList<>();
}
