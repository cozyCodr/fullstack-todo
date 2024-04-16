package com.cre8tor.todo.controller;

import com.cre8tor.todo.dto.ResponseBody;
import com.cre8tor.todo.dto.requests.UserAuthRequest;
import com.cre8tor.todo.service.AuthenticationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/auth")
public record AuthenticationController(
        AuthenticationService authenticationService
) {

    @PostMapping("/register")
    public ResponseEntity<ResponseBody> createAccount(
            @RequestBody UserAuthRequest request
            ){
        return authenticationService.registerUser(request);
    }

    @PostMapping("/login")
    public ResponseEntity<ResponseBody> authenticateUser(
            @RequestBody UserAuthRequest request
    ){
        return authenticationService.authenticate(request);
    }
}
