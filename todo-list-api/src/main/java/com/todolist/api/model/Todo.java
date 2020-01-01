package com.todolist.api.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.todolist.api.model.enums.Priority;
import com.todolist.api.converter.PriorityConverter;
import com.todolist.api.model.enums.Status;
import com.todolist.api.converter.StatusConverter;

import javax.persistence.*;

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
    @JoinColumn(name = "user_id", nullable = false)
    private TodoUser user;

    public Integer getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public Status getStatus() {
        return status;
    }

    public Priority getPriority() {
        return priority;
    }

    public String getDescription() {
        return description;
    }

    public TodoUser getUser() {
        return user;
    }

    protected Todo() {
    }

    private Todo(Builder builder) {
        id = builder.id;
        title = builder.title;
        status = builder.status;
        priority = builder.priority;
        description = builder.description;
        user = builder.user;
    }

    public static class Builder {
        private Integer id;
        private String title;
        private Status status;
        private Priority priority;
        private String description;
        private TodoUser user;

        public Builder() {
        }

        public Builder(Todo todo) {
            this.id = todo.id;
            this.title = todo.title;
            this.status = todo.status;
            this.priority = todo.priority;
            this.description = todo.description;
            this.user = todo.user;
        }

        public Builder title(String title) {
            if (title != null) {
                this.title = title;
            }
            return this;
        }

        public Builder status(Status status) {
            if (status != null) {
                this.status = status;
            }
            return this;
        }

        public Builder priority(Priority priority) {
            if (priority != null) {
                this.priority = priority;
            }
            return this;
        }

        public Builder description(String description) {
            if (description != null) {
                this.description = description;
            }
            return this;
        }

        public Builder user(TodoUser user) {
            if (user != null) {
                this.user = user;
            }
            return this;
        }

        public Todo build() {
            return new Todo(this);
        }
    }

    public String toCSVString() {
        return this.id + ";" + this.title + ";" + this.status + ";" + this.priority + ";" + this.description + ";" + this.user.getUsername();
    }
}
