package com.groupwd_49_22.smartcampus.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.UnsupportedJwtException;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.security.SecurityException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Collection;
import java.util.Date;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Component
@Slf4j
public class JwtTokenProvider {

    @Value("${app.jwt-secret:ChangeThisDevelopmentSecretKeyToAtLeast64CharactersLong1234567890}")
    private String jwtSecret;

    @Value("${app.jwt-expiration-ms:86400000}")
    private long jwtExpirationMs;

    @Value("${app.jwt-refresh-expiration-ms:604800000}")
    private long refreshTokenExpirationMs;

    public String generateAccessToken(Authentication authentication) {
        Set<String> roles = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .map(role -> role.startsWith("ROLE_") ? role.substring(5) : role)
                .collect(Collectors.toCollection(LinkedHashSet::new));
        return generateAccessToken(authentication.getName(), roles);
    }

    public String generateAccessToken(String username, Set<String> roles) {
        Date now = new Date();
        Date expiry = new Date(now.getTime() + jwtExpirationMs);

        return Jwts.builder()
                .setSubject(username)
                .claim("roles", roles)
                .claim("type", "access")
                .setIssuedAt(now)
                .setExpiration(expiry)
                .signWith(getSigningKey(), SignatureAlgorithm.HS512)
                .compact();
    }

    public String generateRefreshToken(String username) {
        Date now = new Date();
        Date expiry = new Date(now.getTime() + refreshTokenExpirationMs);

        return Jwts.builder()
                .setSubject(username)
                .claim("type", "refresh")
                .setIssuedAt(now)
                .setExpiration(expiry)
                .signWith(getSigningKey(), SignatureAlgorithm.HS512)
                .compact();
    }

    public String getUsernameFromToken(String token) {
        return getClaims(token).getSubject();
    }

    public Set<String> getRolesFromToken(String token) {
        Object rolesClaim = getClaims(token).get("roles");

        if (rolesClaim instanceof Collection<?> collection) {
            return collection.stream()
                    .map(String::valueOf)
                    .collect(Collectors.toCollection(LinkedHashSet::new));
        }

        if (rolesClaim instanceof String value && !value.isBlank()) {
            return List.of(value.split(",")).stream()
                    .map(String::trim)
                    .filter(role -> !role.isBlank())
                    .collect(Collectors.toCollection(LinkedHashSet::new));
        }

        return Set.of();
    }

    public boolean isRefreshToken(String token) {
        Object type = getClaims(token).get("type");
        return "refresh".equals(type);
    }

    public boolean validateToken(String authToken) {
        try {
            Jwts.parserBuilder().setSigningKey(getSigningKey()).build().parseClaimsJws(authToken);
            return true;
        } catch (SecurityException | MalformedJwtException exception) {
            log.error("Invalid JWT signature or malformed token: {}", exception.getMessage());
        } catch (ExpiredJwtException exception) {
            log.error("Expired JWT token: {}", exception.getMessage());
        } catch (UnsupportedJwtException exception) {
            log.error("Unsupported JWT token: {}", exception.getMessage());
        } catch (IllegalArgumentException exception) {
            log.error("JWT claims string is empty: {}", exception.getMessage());
        }
        return false;
    }

    private Claims getClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    private SecretKey getSigningKey() {
        byte[] bytes = jwtSecret.getBytes(StandardCharsets.UTF_8);

        if (bytes.length < 64) {
            byte[] padded = new byte[64];
            System.arraycopy(bytes, 0, padded, 0, bytes.length);
            for (int i = bytes.length; i < padded.length; i++) {
                padded[i] = (byte) ('a' + (i % 26));
            }
            bytes = padded;
        }

        return Keys.hmacShaKeyFor(bytes);
    }
}