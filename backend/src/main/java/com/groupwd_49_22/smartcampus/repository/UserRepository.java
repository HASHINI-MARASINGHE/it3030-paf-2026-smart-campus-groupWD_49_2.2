package com.groupwd_49_22.smartcampus.repository;

import com.groupwd_49_22.smartcampus.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    Optional<User> findByUsername(String username);

    Optional<User> findByOauthProviderAndOauthId(String oauthProvider, String oauthId);

    boolean existsByEmail(String email);

    boolean existsByUsername(String username);
}