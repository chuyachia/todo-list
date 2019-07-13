package com.todolist.api.model;

import lombok.Data;

import javax.persistence.*;

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
    @Column(nullable = false)
    private String role;

}
