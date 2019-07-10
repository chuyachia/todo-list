package com.todolist.api.model;

import lombok.Data;

import javax.persistence.*;

@Data
@Entity
public class TodoUser {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    @Column(nullable=false, unique=true)
    private String username;
    private String password;

}
