package com.groupwd_49_22.smartcampus.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthResponse {
    private String token;
    private String refreshToken;
    private Long id;
    private String username;
    private String email;
    private String fullName;
    private String profilePictureUrl;
    private Set<String> roles;
}