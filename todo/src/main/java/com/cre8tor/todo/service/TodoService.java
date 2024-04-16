package com.cre8tor.todo.service;

import com.cre8tor.todo.dto.ResponseBody;
import com.cre8tor.todo.dto.TodoDto;
import com.cre8tor.todo.model.Todo;
import com.cre8tor.todo.model.User;
import com.cre8tor.todo.repository.TodoRepository;
import com.cre8tor.todo.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;

@Slf4j
@Service
public record TodoService(
        TodoRepository todoRepository,
        UserRepository userRepository,
        AuthenticationService authenticationService,
        JwtService jwtService
) {
    public ResponseEntity<ResponseBody> getTodo(Long id, String authorizationHeader) {
        try {
            authenticationService.checkIfUserIsAuthenticated(authorizationHeader);
            authenticationService.checkIfUserIsAuthorized(authorizationHeader);

            Todo todo = todoRepository.findById(id).orElseThrow(
                    () -> new NoSuchElementException("Todo with specified ID does not exist"));
            return ResponseEntity.status(HttpStatus.OK).body(
                    ResponseBody.builder()
                            .message("Fetched Todo")
                            .statusCode(HttpStatus.OK.value())
                            .data(todo)
                            .build());
        }
        catch (NoSuchElementException e){
            log.error(e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                    ResponseBody.builder()
                            .message(e.getMessage())
                            .statusCode(HttpStatus.NOT_FOUND.value())
                            .build());
        }
        catch(Exception e){
            log.error(e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    ResponseBody.builder()
                            .message(e.getMessage())
                            .statusCode(HttpStatus.INTERNAL_SERVER_ERROR.value())
                            .build());
        }
    }

    public ResponseEntity<ResponseBody> getTodosByUserId(String authorizationHeader) {
        try {
            authenticationService.checkIfUserIsAuthenticated(authorizationHeader);
            authenticationService.checkIfUserIsAuthorized(authorizationHeader);

            String token = authorizationHeader.replace("Bearer ", "");
            String username = jwtService.decodeUsername(token);
            User user = userRepository.findByUsername(username).orElseThrow(
                    ()-> new NoSuchElementException("User with specified username does not exist"));


            List<Todo> todos = todoRepository.findTodosByUser(user);

            return ResponseEntity.status(HttpStatus.OK).body(
                    ResponseBody.builder()
                            .message("Fetched Todos")
                            .statusCode(HttpStatus.OK.value())
                            .data(todos)
                            .build());
        }
        catch (NoSuchElementException e){
            log.error(e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                    ResponseBody.builder()
                            .message(e.getMessage())
                            .statusCode(HttpStatus.NOT_FOUND.value())
                            .build());
        }
        catch(Exception e){
            log.error(e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    ResponseBody.builder()
                            .message(e.getMessage())
                            .statusCode(HttpStatus.INTERNAL_SERVER_ERROR.value())
                            .build());
        }
    }

    public ResponseEntity<ResponseBody> createTodo(TodoDto dto, String authorizationHeader) {
        try {
            authenticationService.checkIfUserIsAuthenticated(authorizationHeader);
            authenticationService.checkIfUserIsAuthorized(authorizationHeader);


            // Extract User
            String token = authorizationHeader.replace("Bearer ", "");
            String username = jwtService.decodeUsername(token);
            User user = userRepository.findByUsername(username).orElseThrow(
                    ()-> new NoSuchElementException("User with specified username does not exist"));


            Todo todo = Todo.builder()
                    .content(dto.getContent())
                    .complete(dto.getComplete())
                    .user(user)
                    .build();

            // Save
            todoRepository.save(todo);

            // Add to Users List
            user.addTodo(todo);
            userRepository.save(user);

            // return created to-do
            return ResponseEntity.status(HttpStatus.OK).body(
                    ResponseBody.builder()
                            .message("Created Todo")
                            .statusCode(HttpStatus.OK.value())
                            .data(todo)
                            .build());
        }
        catch (NoSuchElementException e){
            log.error(e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                    ResponseBody.builder()
                            .message(e.getMessage())
                            .statusCode(HttpStatus.NOT_FOUND.value())
                            .build());
        }
        catch(Exception e){
            log.error(e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    ResponseBody.builder()
                            .message(e.getMessage())
                            .statusCode(HttpStatus.INTERNAL_SERVER_ERROR.value())
                            .build());
        }
    }

    public ResponseEntity<ResponseBody> updateTodo(Long id, TodoDto dto, String authorizationHeader) {
        try {
            authenticationService.checkIfUserIsAuthenticated(authorizationHeader);
            authenticationService.checkIfUserIsAuthorized(authorizationHeader);


            Todo todo = todoRepository.findById(id).orElseThrow(
                    ()-> new NoSuchElementException("Todo with specified ID does not exist"));

            // Update and Save
            todo.setContent(dto.getContent());
            todo.setComplete(dto.getComplete());
            todoRepository.save(todo);

            // return updated to-do
            return ResponseEntity.status(HttpStatus.OK).body(
                    ResponseBody.builder()
                            .message("Updated Todo")
                            .statusCode(HttpStatus.OK.value())
                            .data(todo)
                            .build());
        }
        catch (NoSuchElementException e){
            log.error(e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                    ResponseBody.builder()
                            .message(e.getMessage())
                            .statusCode(HttpStatus.NOT_FOUND.value())
                            .build());
        }
        catch(Exception e){
            log.error(e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    ResponseBody.builder()
                            .message(e.getMessage())
                            .statusCode(HttpStatus.INTERNAL_SERVER_ERROR.value())
                            .build());
        }
    }

    public ResponseEntity<ResponseBody> deleteTodo(Long id, String authorizationHeader) {
        try {
            authenticationService.checkIfUserIsAuthenticated(authorizationHeader);
            authenticationService.checkIfUserIsAuthorized(authorizationHeader);


            Todo todo = todoRepository.findById(id).orElseThrow(
                    ()-> new NoSuchElementException("Todo with specified ID does not exist"));

            // Extract User
            String token = authorizationHeader.replace("Bearer ", "");
            String username = jwtService.decodeUsername(token);
            User user = userRepository.findByUsername(username).orElseThrow(
                    ()-> new NoSuchElementException("User with specified username does not exist"));

            // Detach To-do
            user.removeTodo(todo);
            userRepository.save(user);

            todo.setUser(null);
            todoRepository.delete(todo);

            // return id of to-do
            return ResponseEntity.status(HttpStatus.OK).body(
                    ResponseBody.builder()
                            .message("Deleted Todo")
                            .statusCode(HttpStatus.OK.value())
                            .data(id)
                            .build());
        }
        catch (NoSuchElementException e){
            log.error(e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                    ResponseBody.builder()
                            .message(e.getMessage())
                            .statusCode(HttpStatus.NOT_FOUND.value())
                            .build());
        }
        catch(Exception e){
            log.error(e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    ResponseBody.builder()
                            .message(e.getMessage())
                            .statusCode(HttpStatus.INTERNAL_SERVER_ERROR.value())
                            .build());
        }
    }
}
