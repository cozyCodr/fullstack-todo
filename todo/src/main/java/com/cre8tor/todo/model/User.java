package com.cre8tor.todo.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity(name = "app_user")
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column
    private String username;

    @Column
    private String password;

    @JsonIgnore
    @OneToMany
    private List<Todo> todos = new ArrayList<>();

    // The First permission the user role
    @ElementCollection
    Set<String> permissions = new HashSet<>();

    public void addPermission(String p){
        if (permissions == null){
            permissions = new HashSet<>();
            permissions.add(p);
        }
        else {
            permissions.add(p);
        }
    }

    public void addTodo(Todo todo){
        if (todos == null ){
            todos = new ArrayList<>();
            todos.add(todo);
        }
        else {
            todos.add(todo);
        }
    }

    public void removeTodo(Todo todo){
        if (todos != null) todos.remove(todo);
    }
}
