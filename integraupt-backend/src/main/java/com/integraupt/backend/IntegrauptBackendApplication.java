package com.integraupt.backend;

import com.integraupt.backend.config.CryptoProperties;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

@SpringBootApplication
@EnableConfigurationProperties(CryptoProperties.class)
public class IntegrauptBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(IntegrauptBackendApplication.class, args);
    }
}