package com.groupwd_49_22.smartcampus.repository;

import com.groupwd_49_22.smartcampus.model.Facility;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FacilityRepository extends JpaRepository<Facility, Long> {
    List<Facility> findByNameContainingIgnoreCase(String name);
    List<Facility> findByAvailable(boolean available);
}