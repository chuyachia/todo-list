// https://www.baeldung.com/jpa-persisting-enums-in-jpa
package com.todolist.api.model;

import com.todolist.api.model.enums.Priority;
import com.todolist.api.model.enums.Status;
import lombok.Data;

import javax.persistence.*;

@Data
@Entity
@Table(name = "todos")
public class Todo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String title;
    @Transient
    @Convert
    private Status status;
    @Transient
    @Convert
    private Priority priority;
    private String description;
}
