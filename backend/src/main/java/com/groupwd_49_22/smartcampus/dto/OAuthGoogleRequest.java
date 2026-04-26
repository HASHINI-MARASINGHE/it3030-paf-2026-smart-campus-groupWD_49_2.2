package com.groupwd_49_22.smartcampus.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OAuthGoogleRequest {

    @NotBlank(message = "Google credential is required")
    private String credential;
}