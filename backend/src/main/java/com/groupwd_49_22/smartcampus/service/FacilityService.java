package com.groupwd_49_22.smartcampus.service;

import com.groupwd_49_22.smartcampus.exception.ResourceNotFoundException;
import com.groupwd_49_22.smartcampus.model.Facility;
import com.groupwd_49_22.smartcampus.repository.FacilityRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FacilityService {

    private final FacilityRepository facilityRepository;

    public FacilityService(FacilityRepository facilityRepository) {
        this.facilityRepository = facilityRepository;
    }

    public List<Facility> getAllFacilities() {
        return facilityRepository.findAll();
    }

    public Facility getFacilityById(Long id) {
        return facilityRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Facility not found with id: " + id));
    }

    public Facility addFacility(Facility facility) {
        return facilityRepository.save(facility);
    }

    public Facility updateFacility(Long id, Facility updatedFacility) {
        Facility facility = facilityRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Facility not found with id: " + id));

        facility.setName(updatedFacility.getName());
        facility.setLocation(updatedFacility.getLocation());
        facility.setType(updatedFacility.getType());
        facility.setCapacity(updatedFacility.getCapacity());
        facility.setStatus(updatedFacility.getStatus());
        facility.setAvailable(updatedFacility.isAvailable());

        return facilityRepository.save(facility);
    }

    public void deleteFacility(Long id) {
        Facility facility = facilityRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Facility not found with id: " + id));

        facilityRepository.delete(facility);
    }

    public List<Facility> searchByName(String name) {
        return facilityRepository.findByNameContainingIgnoreCase(name);
    }

    public List<Facility> filterByAvailability(boolean available) {
        return facilityRepository.findByAvailable(available);
    }

    public List<Facility> filterByType(String type) {
        return facilityRepository.findByTypeIgnoreCase(type);
    }

    public List<Facility> filterByLocation(String location) {
        return facilityRepository.findByLocationContainingIgnoreCase(location);
    }

    public List<Facility> filterByMinimumCapacity(int capacity) {
        return facilityRepository.findByCapacityGreaterThanEqual(capacity);
    }

    public List<Facility> filterByStatus(String status) {
        return facilityRepository.findByStatusIgnoreCase(status);
    }
}