package com.todolist.security.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;

@Data
@Entity
@Table(name = "users")
public class AuthUser {

    @Id
    @Column(nullable = false, unique = true)
    @NotBlank(message = "Username must not be empty")
    private String username;

    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    @Column(nullable = false)
    @NotBlank(message = "Password must not be empty")
    @Pattern(regexp = "(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{5,}",
            message = "Must contain at least one number and one uppercase and lowercase letter, and at least 5 or more characters")
    private String password;

}
