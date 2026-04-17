package com.groupwd_49_22.smartcampus.config;

import com.groupwd_49_22.smartcampus.model.Role;
import com.groupwd_49_22.smartcampus.repository.RoleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class RoleDataInitializer implements CommandLineRunner {

    private final RoleRepository roleRepository;

    @Override
    public void run(String... args) {
        for (Role.ERole roleName : Role.ERole.values()) {
            roleRepository.findByRoleName(roleName)
                    .orElseGet(() -> roleRepository.save(new Role(roleName)));
        }
    }
}