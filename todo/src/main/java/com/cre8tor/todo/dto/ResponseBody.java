package com.cre8tor.todo.dto;

import lombok.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ResponseBody {
    int statusCode;
    String message;
    Object data;
}
