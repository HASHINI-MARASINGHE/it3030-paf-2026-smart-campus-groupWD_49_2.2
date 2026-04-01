package com.groupwd_49_22.smartcampus.repository;

import com.groupwd_49_22.smartcampus.model.Facility;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FacilityRepository extends JpaRepository<Facility, Long> {
    List<Facility> findByNameContainingIgnoreCase(String name);
    List<Facility> findByAvailable(boolean available);

    List<Facility> findByTypeIgnoreCase(String type);
    List<Facility> findByLocationContainingIgnoreCase(String location);
    List<Facility> findByCapacityGreaterThanEqual(int capacity);
    List<Facility> findByStatusIgnoreCase(String status);
}