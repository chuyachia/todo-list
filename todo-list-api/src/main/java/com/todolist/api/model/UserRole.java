package com.todolist.api.model;

import com.todolist.api.model.enums.Role;
import com.todolist.api.model.enums.RoleConverter;
import lombok.Data;

import javax.persistence.*;

@Data
@Entity
@Table(name = "roles")
public class UserRole {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    @Convert(converter = RoleConverter.class)
    private Role role;
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private TodoUser user;

}
