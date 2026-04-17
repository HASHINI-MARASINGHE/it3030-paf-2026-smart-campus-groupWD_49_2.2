package com.groupwd_49_22.smartcampus.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "roles")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Role {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "role_name", unique = true, nullable = false, length = 30)
    private ERole roleName;

    public Role(ERole roleName) {
        this.roleName = roleName;
    }

    public enum ERole {
        USER,
        ADMIN,
        TECHNICIAN,
        MANAGER
    }
}