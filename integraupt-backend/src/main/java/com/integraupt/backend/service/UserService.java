package com.integraupt.backend.service;

import com.integraupt.backend.domain.user.User;
import com.integraupt.backend.dto.AuthResponse;
import com.integraupt.backend.dto.LoginRequest;
import com.integraupt.backend.dto.RegisterRequest;
import com.integraupt.backend.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@Transactional
public class UserService {

    private final UserRepository userRepository;
    private final CryptoService cryptoService;

    public UserService(UserRepository userRepository, CryptoService cryptoService) {
        this.userRepository = userRepository;
        this.cryptoService = cryptoService;
    }

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "El correo ya está registrado");
        }

        CryptoService.EncryptedPayload encryptedPassword = cryptoService.encrypt(request.getPassword());
        User user = new User(request.getEmail(), encryptedPassword.cipherText(), encryptedPassword.iv());
        User saved = userRepository.save(user);
        return new AuthResponse("Usuario registrado correctamente", saved.getId());
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Credenciales inválidas"));

        String decryptedPassword = cryptoService.decrypt(new CryptoService.EncryptedPayload(
                user.getPasswordCipher(), user.getPasswordIv()));
        if (!decryptedPassword.equals(request.getPassword())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Credenciales inválidas");
        }

        return new AuthResponse("Inicio de sesión exitoso", user.getId());
    }
}