package com.groupwd_49_22.smartcampus.controller;

import com.groupwd_49_22.smartcampus.dto.AuthResponse;
import com.groupwd_49_22.smartcampus.dto.LoginRequest;
import com.groupwd_49_22.smartcampus.dto.RegisterRequest;
import com.groupwd_49_22.smartcampus.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Slf4j
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        try {
            AuthResponse response = authService.register(request);
            log.info("User registered successfully: {}", request.getEmail());
            return new ResponseEntity<>(response, HttpStatus.CREATED);
        } catch (Exception e) {
            log.error("Registration failed: {}", e.getMessage());
            return new ResponseEntity<>(createErrorResponse(e.getMessage()), HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        try {
            AuthResponse response = authService.login(request);
            log.info("User logged in successfully: {}", request.getEmail());
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            log.error("Login failed: {}", e.getMessage());
            return new ResponseEntity<>(createErrorResponse("Invalid email or password"), HttpStatus.UNAUTHORIZED);
        }
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<?> refreshToken(@RequestBody Map<String, String> request) {
        try {
            String refreshToken = request.get("refreshToken");
            if (refreshToken == null || refreshToken.isEmpty()) {
                return new ResponseEntity<>(createErrorResponse("Refresh token is required"), HttpStatus.BAD_REQUEST);
            }
            AuthResponse response = authService.refreshToken(refreshToken);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            log.error("Token refresh failed: {}", e.getMessage());
            return new ResponseEntity<>(createErrorResponse("Invalid or expired refresh token"), HttpStatus.UNAUTHORIZED);
        }
    }

    @PostMapping("/oauth/google")
    public ResponseEntity<?> googleOAuth(@RequestBody Map<String, String> request) {
        try {
            String email = request.get("email");
            String fullName = request.get("fullName");
            String profilePictureUrl = request.get("profilePictureUrl");
            String googleId = request.get("googleId");

            if (email == null || googleId == null) {
                return new ResponseEntity<>(createErrorResponse("Email and googleId are required"), HttpStatus.BAD_REQUEST);
            }

            AuthResponse response = authService.createOrUpdateOAuthUser("GOOGLE", googleId, email, fullName, profilePictureUrl);
            log.info("Google OAuth authentication successful for: {}", email);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            log.error("Google OAuth failed: {}", e.getMessage());
            return new ResponseEntity<>(createErrorResponse("OAuth authentication failed"), HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@RequestHeader("Authorization") String token) {
        try {
            if (token != null && token.startsWith("Bearer ")) {
                String jwt = token.substring(7);
                // The username/email is in the token, but in production you'd fetch from DB
                return new ResponseEntity<>(HttpStatus.OK);
            }
            return new ResponseEntity<>(createErrorResponse("Token is required"), HttpStatus.UNAUTHORIZED);
        } catch (Exception e) {
            log.error("Error fetching current user: {}", e.getMessage());
            return new ResponseEntity<>(createErrorResponse("Error fetching user"), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    private Map<String, Object> createErrorResponse(String message) {
        Map<String, Object> response = new HashMap<>();
        response.put("error", message);
        response.put("timestamp", System.currentTimeMillis());
        return response;
    }
}
