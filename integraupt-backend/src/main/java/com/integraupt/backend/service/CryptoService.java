package com.integraupt.backend.service;

import com.integraupt.backend.config.CryptoProperties;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Service;

import javax.crypto.Cipher;
import javax.crypto.SecretKey;
import javax.crypto.spec.GCMParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.GeneralSecurityException;
import java.security.SecureRandom;
import java.util.Base64;

@Service
public class CryptoService {

    private static final String AES_ALGORITHM = "AES";
    private static final String TRANSFORMATION = "AES/GCM/NoPadding";
    private static final int TAG_LENGTH_BIT = 128;
    private static final int IV_LENGTH_BYTE = 12;

    private final CryptoProperties properties;
    private final SecureRandom secureRandom = new SecureRandom();

    private SecretKey secretKey;

    public CryptoService(CryptoProperties properties) {
        this.properties = properties;
    }

    @PostConstruct
    void init() {
        byte[] keyBytes = Base64.getDecoder().decode(properties.getSecretKey());
        if (keyBytes.length != 16 && keyBytes.length != 24 && keyBytes.length != 32) {
            throw new IllegalStateException("La llave AES debe tener 16, 24 o 32 bytes en formato Base64");
        }
        this.secretKey = new SecretKeySpec(keyBytes, AES_ALGORITHM);
    }

    public EncryptedPayload encrypt(String plainText) {
        try {
            byte[] iv = new byte[IV_LENGTH_BYTE];
            secureRandom.nextBytes(iv);

            Cipher cipher = Cipher.getInstance(TRANSFORMATION);
            GCMParameterSpec parameterSpec = new GCMParameterSpec(TAG_LENGTH_BIT, iv);
            cipher.init(Cipher.ENCRYPT_MODE, secretKey, parameterSpec);

            byte[] cipherText = cipher.doFinal(plainText.getBytes(StandardCharsets.UTF_8));
            return new EncryptedPayload(Base64.getEncoder().encodeToString(cipherText),
                    Base64.getEncoder().encodeToString(iv));
        } catch (GeneralSecurityException e) {
            throw new IllegalStateException("Error while encrypting data", e);
        }
    }

    public String decrypt(EncryptedPayload payload) {
        try {
            byte[] iv = Base64.getDecoder().decode(payload.iv());
            byte[] cipherBytes = Base64.getDecoder().decode(payload.cipherText());

            Cipher cipher = Cipher.getInstance(TRANSFORMATION);
            GCMParameterSpec parameterSpec = new GCMParameterSpec(TAG_LENGTH_BIT, iv);
            cipher.init(Cipher.DECRYPT_MODE, secretKey, parameterSpec);

            byte[] plainBytes = cipher.doFinal(cipherBytes);
            return new String(plainBytes, StandardCharsets.UTF_8);
        } catch (GeneralSecurityException e) {
            throw new IllegalStateException("Error while decrypting data", e);
        }
    }

    public record EncryptedPayload(String cipherText, String iv) {
        public EncryptedPayload {
            if (cipherText == null || iv == null) {
                throw new IllegalArgumentException("Cipher text and IV must not be null");
            }
        }
    }
}