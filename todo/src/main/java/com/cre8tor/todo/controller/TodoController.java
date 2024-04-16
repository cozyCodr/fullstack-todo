package com.cre8tor.todo.controller;

import com.cre8tor.todo.dto.ResponseBody;
import com.cre8tor.todo.dto.TodoDto;
import com.cre8tor.todo.service.TodoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/todo")
public record TodoController(
        TodoService todoService
) {

    @GetMapping("/{id}")
    public ResponseEntity<ResponseBody> getTodo(
            @PathVariable Long id,
            @RequestHeader("Authorization") String authorizationHeader
    ){
        return todoService.getTodo(id, authorizationHeader);
    }

    @GetMapping("/all")
    public ResponseEntity<ResponseBody> getTodosByUserId(
            @RequestHeader("Authorization") String authorizationHeader
    ){
        return todoService.getTodosByUserId(authorizationHeader);
    }

    @PostMapping
    public ResponseEntity<ResponseBody> createTodo(
            @RequestBody TodoDto dto,
            @RequestHeader("Authorization") String authorizationHeader
    ){
        return todoService.createTodo(dto, authorizationHeader);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<ResponseBody> updateTodo(
            @PathVariable Long id,
            @RequestBody TodoDto dto,
            @RequestHeader("Authorization") String authorizationHeader
    ){
        return todoService.updateTodo(id, dto, authorizationHeader);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ResponseBody> deleteTodo(
            @PathVariable Long id,
            @RequestHeader("Authorization") String authorizationHeader
    ){
        return todoService.deleteTodo(id, authorizationHeader);
    }
}
