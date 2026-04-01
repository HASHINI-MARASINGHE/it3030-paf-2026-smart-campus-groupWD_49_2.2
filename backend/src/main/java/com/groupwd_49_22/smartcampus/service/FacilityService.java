package com.groupwd_49_22.smartcampus.service;

import com.groupwd_49_22.smartcampus.model.Facility;
import com.groupwd_49_22.smartcampus.repository.FacilityRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

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
                .orElseThrow(() -> new RuntimeException("Facility not found with id: " + id));
    }

    public Facility addFacility(Facility facility) {
        return facilityRepository.save(facility);
    }

    public String updateFacility(Long id, Facility updatedFacility) {
        Optional<Facility> optionalFacility = facilityRepository.findById(id);

        if (optionalFacility.isPresent()) {
            Facility facility = optionalFacility.get();
            facility.setName(updatedFacility.getName());
            facility.setLocation(updatedFacility.getLocation());
            facility.setType(updatedFacility.getType());
            facility.setCapacity(updatedFacility.getCapacity());
            facility.setStatus(updatedFacility.getStatus());
            facility.setAvailable(updatedFacility.isAvailable());

            facilityRepository.save(facility);
            return "Facility updated!";
        }

        return "Facility not found!";
    }

    public String deleteFacility(Long id) {
        if (facilityRepository.existsById(id)) {
            facilityRepository.deleteById(id);
            return "Facility deleted!";
        }
        return "Facility not found!";
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