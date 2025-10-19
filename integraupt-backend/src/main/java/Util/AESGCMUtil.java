package Util;

import java.nio.BufferUnderflowException;
import java.nio.ByteBuffer;
import java.nio.charset.StandardCharsets;
import java.security.GeneralSecurityException;
import java.security.SecureRandom;
import java.util.Base64;
import javax.crypto.Cipher;
import javax.crypto.SecretKey;
import javax.crypto.spec.GCMParameterSpec;
import javax.crypto.spec.SecretKeySpec;

public final class AESGCMUtil {

    private static final String ALGORITHM = "AES";
    private static final String TRANSFORMATION = "AES/GCM/NoPadding";
    private static final int IV_LENGTH = 12;
    private static final int TAG_LENGTH = 128;
    private static final SecureRandom RANDOM = new SecureRandom();

    // Clave codificada en Base64 ("AESDemoSecretKey" en bytes)
    private static final String BASE64_KEY = "QUVTRGVtb1NlY3JldEtleQ==";

    private AESGCMUtil() {
        // Evita instanciación
    }

    private static SecretKey getSecretKey() {
        byte[] keyBytes = Base64.getDecoder().decode(BASE64_KEY);
        return new SecretKeySpec(keyBytes, ALGORITHM);
    }

    // -------------------------------
    // MÉTODO PARA CIFRAR
    // -------------------------------
    public static String encrypt(String plainText) throws GeneralSecurityException {
        byte[] iv = new byte[IV_LENGTH];
        RANDOM.nextBytes(iv);

        Cipher cipher = Cipher.getInstance(TRANSFORMATION);
        GCMParameterSpec parameterSpec = new GCMParameterSpec(TAG_LENGTH, iv);
        cipher.init(Cipher.ENCRYPT_MODE, getSecretKey(), parameterSpec);

        byte[] cipherText = cipher.doFinal(plainText.getBytes(StandardCharsets.UTF_8));

        ByteBuffer byteBuffer = ByteBuffer.allocate(iv.length + cipherText.length);
        byteBuffer.put(iv);
        byteBuffer.put(cipherText);

        return Base64.getEncoder().encodeToString(byteBuffer.array());
    }

    // -------------------------------
    // MÉTODO PARA DESCIFRAR
    // -------------------------------
    public static String decrypt(String encodedCipherText) throws GeneralSecurityException {
        byte[] cipherMessage = Base64.getDecoder().decode(encodedCipherText);
        ByteBuffer byteBuffer = ByteBuffer.wrap(cipherMessage);

        byte[] iv = new byte[IV_LENGTH];
        byteBuffer.get(iv);

        byte[] cipherText = new byte[byteBuffer.remaining()];
        byteBuffer.get(cipherText);

        Cipher cipher = Cipher.getInstance(TRANSFORMATION);
        GCMParameterSpec parameterSpec = new GCMParameterSpec(TAG_LENGTH, iv);
        cipher.init(Cipher.DECRYPT_MODE, getSecretKey(), parameterSpec);

        byte[] plainText = cipher.doFinal(cipherText);
        return new String(plainText, StandardCharsets.UTF_8);
    }

    // -------------------------------
    // COMPARAR CONTRASEÑAS
    // -------------------------------
    public static boolean matches(String plainPassword, String storedValue) {
        if (plainPassword == null || storedValue == null) {
            return false;
        }
        try {
            String decrypted = decrypt(storedValue);
            return plainPassword.equals(decrypted);
        } catch (IllegalArgumentException | BufferUnderflowException | GeneralSecurityException ex) {
            // Si falla el descifrado, asume que estaba sin cifrar
            return plainPassword.equals(storedValue);
        }
    }
}
