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
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jwt.BadJwtException;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.LinkedHashSet;
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

    @Value("${app.google.client-id:}")
    private String googleClientId;

    private static final String GOOGLE_JWK_SET_URI = "https://www.googleapis.com/oauth2/v3/certs";

    public AuthResponse register(RegisterRequest request) {
        String email = request.getEmail().trim().toLowerCase();
        String username = request.getUsername().trim();

        if (userRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("Email already registered");
        }

        if (userRepository.existsByUsername(username)) {
            throw new IllegalArgumentException("Username already taken");
        }

        User user = new User();
        user.setUsername(username);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setFullName(request.getFullName().trim());
        user.setIsActive(true);
        user.getRoles().add(getOrCreateRole(Role.ERole.USER));

        user = userRepository.save(user);
        log.info("User registered successfully: {}", user.getEmail());

        return buildAuthResponse(user, true);
    }

    public AuthResponse login(LoginRequest request) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail().trim().toLowerCase(),
                            request.getPassword()
                    )
            );

            User user = getCurrentUserEntity(authentication.getName());

            if (!Boolean.TRUE.equals(user.getIsActive())) {
                throw new DisabledException("User account is inactive");
            }

            return buildAuthResponse(user, true);
        } catch (BadCredentialsException exception) {
            throw new BadCredentialsException("Invalid email or password");
        }
    }

    public AuthResponse refreshToken(String refreshToken) {
        if (refreshToken == null || refreshToken.isBlank()) {
            throw new IllegalArgumentException("Refresh token is required");
        }

        if (!jwtTokenProvider.validateToken(refreshToken) || !jwtTokenProvider.isRefreshToken(refreshToken)) {
            throw new IllegalArgumentException("Invalid or expired refresh token");
        }

        String email = jwtTokenProvider.getUsernameFromToken(refreshToken);
        User user = getCurrentUserEntity(email);

        AuthResponse response = buildUserProfile(user);
        response.setToken(jwtTokenProvider.generateAccessToken(user.getEmail(), getRoleNames(user)));
        response.setRefreshToken(refreshToken);

        return response;
    }

    public AuthResponse getCurrentUserProfile(String email) {
        return buildUserProfile(getCurrentUserEntity(email));
    }

    public AuthResponse loginWithGoogle(String credential) {
        Jwt googleJwt = decodeAndValidateGoogleToken(credential);

        String email = stringClaim(googleJwt, "email");
        String fullName = stringClaim(googleJwt, "name");
        String picture = stringClaim(googleJwt, "picture");
        String subject = googleJwt.getSubject();
        Boolean emailVerified = googleJwt.getClaim("email_verified");

        if (email == null || subject == null) {
            throw new IllegalArgumentException("Google token does not contain the required user details");
        }

        if (emailVerified != null && !emailVerified) {
            throw new IllegalArgumentException("Google account email is not verified");
        }

        User user = userRepository.findByOauthProviderAndOauthId("GOOGLE", subject)
                .or(() -> userRepository.findByEmail(email.toLowerCase()))
                .orElseGet(User::new);

        boolean isNewUser = user.getId() == null;

        user.setEmail(email.toLowerCase());
        user.setFullName(fullName != null && !fullName.isBlank() ? fullName : email);
        user.setOauthProvider("GOOGLE");
        user.setOauthId(subject);
        user.setProfilePictureUrl(picture);
        user.setIsActive(true);

        if (isNewUser) {
            user.setUsername(generateUniqueUsername(email));
            user.setPassword(passwordEncoder.encode("oauth-login-" + subject));
            user.getRoles().add(getOrCreateRole(Role.ERole.USER));
        }

        user = userRepository.save(user);
        log.info("Google OAuth login success for {}", user.getEmail());

        return buildAuthResponse(user, true);
    }

    public User getCurrentUserEntity(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
    }

    private Jwt decodeAndValidateGoogleToken(String credential) {
        if (credential == null || credential.isBlank()) {
            throw new IllegalArgumentException("Google credential is required");
        }

        JwtDecoder decoder = NimbusJwtDecoder.withJwkSetUri(GOOGLE_JWK_SET_URI).build();
        Jwt jwt;

        try {
            jwt = decoder.decode(credential);
        } catch (Exception exception) {
            throw new BadJwtException("Invalid Google token");
        }

        String issuer = jwt.getIssuer() != null ? jwt.getIssuer().toString() : "";
        if (!("https://accounts.google.com".equals(issuer) || "accounts.google.com".equals(issuer))) {
            throw new BadJwtException("Google token issuer is invalid");
        }

        if (googleClientId != null && !googleClientId.isBlank()) {
            Object aud = jwt.getClaims().get("aud");
            boolean audienceMatches = false;

            if (aud instanceof String value) {
                audienceMatches = googleClientId.equals(value);
            } else if (aud instanceof Iterable<?> iterable) {
                for (Object item : iterable) {
                    if (googleClientId.equals(String.valueOf(item))) {
                        audienceMatches = true;
                        break;
                    }
                }
            }

            if (!audienceMatches) {
                throw new BadJwtException("Google token audience is invalid");
            }
        }

        return jwt;
    }

    private AuthResponse buildAuthResponse(User user, boolean includeRefreshToken) {
        AuthResponse response = buildUserProfile(user);
        response.setToken(jwtTokenProvider.generateAccessToken(user.getEmail(), getRoleNames(user)));

        if (includeRefreshToken) {
            response.setRefreshToken(jwtTokenProvider.generateRefreshToken(user.getEmail()));
        }

        return response;
    }

    private AuthResponse buildUserProfile(User user) {
        return AuthResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .profilePictureUrl(user.getProfilePictureUrl())
                .roles(getRoleNames(user))
                .build();
    }

    private Set<String> getRoleNames(User user) {
        return user.getRoles().stream()
                .map(role -> role.getRoleName().name())
                .collect(Collectors.toCollection(LinkedHashSet::new));
    }

    private Role getOrCreateRole(Role.ERole roleName) {
        return roleRepository.findByRoleName(roleName)
                .orElseGet(() -> roleRepository.save(new Role(roleName)));
    }

    private String generateUniqueUsername(String email) {
        String base = email.split("@")[0]
                .replaceAll("[^a-zA-Z0-9._-]", "")
                .toLowerCase();

        if (base.isBlank()) {
            base = "user";
        }

        String candidate = base;
        int counter = 1;

        while (userRepository.existsByUsername(candidate)) {
            candidate = base + counter;
            counter++;
        }

        return candidate;
    }

    private String stringClaim(Jwt jwt, String name) {
        Object value = jwt.getClaims().get(name);
        return value == null ? null : String.valueOf(value);
    }
}