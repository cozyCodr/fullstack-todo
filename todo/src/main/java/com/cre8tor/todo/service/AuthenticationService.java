package com.cre8tor.todo.service;


import com.cre8tor.todo.constants.Role;
import com.cre8tor.todo.dto.ResponseBody;
import com.cre8tor.todo.dto.requests.UserAuthRequest;
import com.cre8tor.todo.model.User;
import com.cre8tor.todo.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Slf4j
@Service
public record AuthenticationService(
        UserRepository userRepository,
        PasswordEncoder passwordEncoder,
        AuthenticationManager authenticationManager,
        JwtService jwtService
) {

    public ResponseEntity<ResponseBody> registerUser(UserAuthRequest request) {
        try {

            if (userExists(request.getUsername())) {
                throw new CloneNotSupportedException("A user with this username already exists");
            }
            else {
                User user = User.builder()
                        .username(request.getUsername())
                        .password(passwordEncoder.encode(request.getPassword()))
                        .build();

                // Add First Permission: User role
                user.addPermission(Role.User.toString());

                // Save User
                userRepository.save(user);

                // Return
                var body = ResponseBody.builder()
                        .statusCode(HttpStatus.CREATED.value())
                        .message("User created successfully")
                        .build();

                return ResponseEntity.status(HttpStatus.CREATED).body(body);
            }
        }
        // Account exists
        catch (CloneNotSupportedException e) {
            var body = ResponseBody.builder()
                    .message(e.getMessage())
                    .statusCode(HttpStatus.UNPROCESSABLE_ENTITY.value())
                    .build();
            return ResponseEntity.status(HttpStatus.UNPROCESSABLE_ENTITY).body(body);
        }
        catch(Exception e){
            var body = ResponseBody.builder()
                    .data(e.getMessage())
                    .message("Something went wrong. Try Again")
                    .statusCode(HttpStatus.INTERNAL_SERVER_ERROR.value())
                    .build();

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(body);
        }
    }

    public ResponseEntity<ResponseBody> authenticate(UserAuthRequest request) {

        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword()));

            Optional<User> user = userRepository.findByUsername(request.getUsername());
            if (user.isEmpty()) throw new IllegalArgumentException("User with specified username does not exist");

            String jwtToken = jwtService.genToken(user.get(), Role.User.toString());

            ResponseBody body = ResponseBody.builder()
                    .data(jwtToken)
                    .message("Auth Successful")
                    .statusCode(HttpStatus.OK.value())
                    .build();
            return ResponseEntity.status(HttpStatus.OK).body(body);
        }
        catch (IllegalArgumentException e) {
            ResponseBody body = ResponseBody.builder()
                    .statusCode(HttpStatus.INTERNAL_SERVER_ERROR.value())
                    .message(e.getMessage())
                    .build();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(body);
        }
        catch (Exception e) {
            log.error(e.getMessage());
            ResponseBody body = ResponseBody.builder()
                    .statusCode(HttpStatus.INTERNAL_SERVER_ERROR.value())
                    .message("Username or Password Invalid")
                    .build();

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(body);
        }
    }

    public ResponseEntity<ResponseBody> checkIfUserIsAuthenticated(String authorizationHeader){
        if (authorizationHeader == null || authorizationHeader.isBlank()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ResponseBody.builder()
                            .message("User is not authenticated!")
                            .statusCode(HttpStatus.UNAUTHORIZED.value())
                            .build());
        }
        return null;
    }

    public ResponseEntity<ResponseBody>  checkIfUserIsAuthorized(String authorizationHeader){
        // Extract the token from the Authorization header and Check for correct role to initiate action
        String token = authorizationHeader.replace("Bearer ", "");

        if (!jwtService.hasRole(token, String.valueOf(Role.User))){
            ResponseBody body = ResponseBody.builder()
                    .message("User has insufficient permissions to make this request")
                    .statusCode(HttpStatus.FORBIDDEN.value())
                    .build();

            // Return an unauthorized response if the user doesn't have the required role
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(body);
        }

        return null;
    }

    public User  getUser(String authorizationHeader){
        // Extract the token from the Authorization header and Check for correct role to initiate action
        String token = authorizationHeader.replace("Bearer ", "");
        String userId = jwtService.decodeUserId(token);
        return userRepository.findByUsername(userId).orElse(null);

    }

    private boolean userExists(String username) {
        Optional<User> user = userRepository.findByUsername(username);
        return user.isPresent();
    }

}