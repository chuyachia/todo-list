package com.todolist.api.model;

import lombok.Data;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Data
@Entity
@Table(name="users")
public class TodoUser {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    @Column(nullable=false, unique=true)
    private String username;
    @Column(nullable = false)
    private String password;
    @OneToMany(cascade = CascadeType.ALL, mappedBy = "user")
    private List<UserRole> roles  = new ArrayList<UserRole>();


}
