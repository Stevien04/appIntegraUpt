package com.integraupt.backend.dto;

public class AuthResponse {

    private final String message;
    private final Long userId;

    public AuthResponse(String message, Long userId) {
        this.message = message;
        this.userId = userId;
    }

    public String getMessage() {
        return message;
    }

    public Long getUserId() {
        return userId;
    }
}