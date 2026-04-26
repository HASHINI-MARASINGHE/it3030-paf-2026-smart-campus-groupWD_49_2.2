package com.groupwd_49_22.smartcampus.repository;

import com.groupwd_49_22.smartcampus.model.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {

    Optional<Role> findByRoleName(Role.ERole roleName);
}