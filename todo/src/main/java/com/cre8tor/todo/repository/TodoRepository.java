package com.cre8tor.todo.repository;

import com.cre8tor.todo.model.Todo;
import com.cre8tor.todo.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TodoRepository extends JpaRepository<Todo, Long> {
    List<Todo> findTodosByUser(User user);
}
