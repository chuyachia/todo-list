// https://www.baeldung.com/jpa-persisting-enums-in-jpa
package com.todolist.api.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.todolist.api.model.enums.Priority;
import com.todolist.api.converter.PriorityConverter;
import com.todolist.api.model.enums.Status;
import com.todolist.api.converter.StatusConverter;
import lombok.Data;

import javax.persistence.*;

@Data
@Entity
@Table(name = "todos")
public class Todo {

    @Id
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String title;
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    @Convert(converter = StatusConverter.class)
    private Status status;
    @Convert(converter = PriorityConverter.class)
    private Priority priority;
    private String description;
    @ManyToOne
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    @JoinColumn(name="user_id", nullable = false)
    private TodoUser user;

    protected Todo(){}

    public Todo(String title, Status status, Priority priority, String description) {
        this.title = title;
        this.status = status;
        this.priority = priority;
        this.description = description;
    }

    public String toCSVString() {
        return this.getId()+";"+this.getTitle()+";"+this.getStatus()+";"+this.getPriority()+";"+this.getDescription()+";"+this.getUser().getUsername();
    }
}
