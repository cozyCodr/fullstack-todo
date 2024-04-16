package com.cre8tor.todo.dto.requests;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserAuthRequest {
    String username;
    String password;
}
