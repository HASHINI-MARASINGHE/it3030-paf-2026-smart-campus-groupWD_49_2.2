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
}