package com.integraupt.backend.domain.user;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

import java.time.LocalDateTime;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 150)
    private String email;

    @Column(name = "password_cipher", nullable = false, length = 512)
    private String passwordCipher;

    @Column(name = "password_iv", nullable = false, length = 64)
    private String passwordIv;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    protected User() {
        // JPA
    }

    public User(String email, String passwordCipher, String passwordIv) {
        this.email = email;
        this.passwordCipher = passwordCipher;
        this.passwordIv = passwordIv;
    }

    @PrePersist
    public void onCreate() {
        createdAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public String getEmail() {
        return email;
    }

    public String getPasswordCipher() {
        return passwordCipher;
    }

    public String getPasswordIv() {
        return passwordIv;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}