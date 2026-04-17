package com.groupwd_49_22.smartcampus.service;

import com.groupwd_49_22.smartcampus.dto.AuthResponse;
import com.groupwd_49_22.smartcampus.dto.LoginRequest;
import com.groupwd_49_22.smartcampus.dto.RegisterRequest;
import com.groupwd_49_22.smartcampus.exception.ResourceNotFoundException;
import com.groupwd_49_22.smartcampus.model.Role;
import com.groupwd_49_22.smartcampus.model.User;
import com.groupwd_49_22.smartcampus.repository.RoleRepository;
import com.groupwd_49_22.smartcampus.repository.UserRepository;
import com.groupwd_49_22.smartcampus.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;

    public AuthResponse register(RegisterRequest request) {
        // Check if user already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username already taken");
        }

        // Create new user
        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setFullName(request.getFullName());
        user.setIsActive(true);

        // Set default role
        Role userRole = roleRepository.findByRoleName(Role.ERole.USER)
                .orElseThrow(() -> new ResourceNotFoundException("Default role not found"));
        user.setRoles(new HashSet<>(Set.of(userRole)));

        user = userRepository.save(user);
        log.info("User registered successfully: {}", user.getEmail());

        // Generate token
        String token = jwtTokenProvider.generateTokenFromUsername(
                user.getEmail(),
                getRolesString(user)
        );

        Set<String> roles = user.getRoles().stream()
                .map(role -> role.getRoleName().name())
                .collect(Collectors.toSet());

        return new AuthResponse(token, user.getId(), user.getUsername(), user.getEmail(),
                user.getFullName(), roles);
    }

    public AuthResponse login(LoginRequest request) {
        // Authenticate user
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        // Get user details
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // Generate token
        String token = jwtTokenProvider.generateTokenFromUsername(
                user.getEmail(),
                getRolesString(user)
        );

        String refreshToken = jwtTokenProvider.generateRefreshToken(user.getEmail());

        Set<String> roles = user.getRoles().stream()
                .map(role -> role.getRoleName().name())
                .collect(Collectors.toSet());

        AuthResponse response = new AuthResponse(token, user.getId(), user.getUsername(),
                user.getEmail(), user.getFullName(), roles);
        response.setRefreshToken(refreshToken);
        response.setProfilePictureUrl(user.getProfilePictureUrl());

        log.info("User logged in successfully: {}", user.getEmail());
        return response;
    }

    public User getCurrentUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
    }

    public AuthResponse createOrUpdateOAuthUser(String provider, String oauthId, String email,
                                                 String fullName, String profilePictureUrl) {
        // Try to find existing OAuth user
        User user = userRepository.findByOauthProviderAndOauthId(provider, oauthId)
                .orElseGet(() -> {
                    // Create new user if not exists
                    User newUser = new User();
                    newUser.setEmail(email);
                    newUser.setUsername(email.split("@")[0] + "_" + provider.toLowerCase());
                    newUser.setFullName(fullName);
                    newUser.setOauthProvider(provider);
                    newUser.setOauthId(oauthId);
                    newUser.setProfilePictureUrl(profilePictureUrl);
                    newUser.setPassword(passwordEncoder.encode("oauth-" + System.nanoTime())); // Dummy password
                    newUser.setIsActive(true);

                    // Assign USER role
                    Role userRole = roleRepository.findByRoleName(Role.ERole.USER)
                            .orElseThrow(() -> new ResourceNotFoundException("Default role not found"));
                    newUser.setRoles(new HashSet<>(Set.of(userRole)));

                    return userRepository.save(newUser);
                });

        // Update profile picture if provided
        if (profilePictureUrl != null && !profilePictureUrl.isEmpty()) {
            user.setProfilePictureUrl(profilePictureUrl);
            user = userRepository.save(user);
        }

        // Generate token
        String token = jwtTokenProvider.generateTokenFromUsername(
                user.getEmail(),
                getRolesString(user)
        );

        String refreshToken = jwtTokenProvider.generateRefreshToken(user.getEmail());

        Set<String> roles = user.getRoles().stream()
                .map(role -> role.getRoleName().name())
                .collect(Collectors.toSet());

        AuthResponse response = new AuthResponse(token, user.getId(), user.getUsername(),
                user.getEmail(), user.getFullName(), roles);
        response.setRefreshToken(refreshToken);
        response.setProfilePictureUrl(user.getProfilePictureUrl());

        log.info("OAuth user created/updated: {} ({})", user.getEmail(), provider);
        return response;
    }

    public AuthResponse refreshToken(String refreshToken) {
        if (!jwtTokenProvider.validateToken(refreshToken)) {
            throw new RuntimeException("Invalid or expired refresh token");
        }

        String email = jwtTokenProvider.getUsernameFromToken(refreshToken);
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        String newToken = jwtTokenProvider.generateTokenFromUsername(
                user.getEmail(),
                getRolesString(user)
        );

        Set<String> roles = user.getRoles().stream()
                .map(role -> role.getRoleName().name())
                .collect(Collectors.toSet());

        AuthResponse response = new AuthResponse(newToken, user.getId(), user.getUsername(),
                user.getEmail(), user.getFullName(), roles);
        response.setRefreshToken(refreshToken);
        response.setProfilePictureUrl(user.getProfilePictureUrl());

        return response;
    }

    private String getRolesString(User user) {
        return user.getRoles().stream()
                .map(role -> "ROLE_" + role.getRoleName().name())
                .collect(Collectors.joining(","));
    }
}
