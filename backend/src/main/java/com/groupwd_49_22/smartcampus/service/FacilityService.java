package com.groupwd_49_22.smartcampus.service;

import com.groupwd_49_22.smartcampus.model.Facility;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class FacilityService {

    private final List<Facility> facilities = new ArrayList<>();

    public List<Facility> getAllFacilities() {
        return facilities;
    }

    public String addFacility(Facility facility) {
        facilities.add(facility);
        return "Facility added successfully!";
    }

    public String updateFacility(Long id, Facility updatedFacility) {
        for (Facility facility : facilities) {
            if (facility.getId().equals(id)) {
                facility.setName(updatedFacility.getName());
                facility.setLocation(updatedFacility.getLocation());
                facility.setType(updatedFacility.getType());
                facility.setAvailable(updatedFacility.isAvailable());
                return "Facility updated!";
            }
        }
        return "Facility not found!";
    }

    public String deleteFacility(Long id) {
        boolean removed = facilities.removeIf(facility -> facility.getId().equals(id));
        if (removed) {
            return "Facility deleted!";
        }
        return "Facility not found!";
    }

    public List<Facility> searchByName(String name) {
        List<Facility> result = new ArrayList<>();

        for (Facility facility : facilities) {
            if (facility.getName() != null &&
                facility.getName().toLowerCase().contains(name.toLowerCase())) {
                result.add(facility);
            }
        }

        return result;
    }

    public List<Facility> filterByAvailability(boolean available) {
        List<Facility> result = new ArrayList<>();

        for (Facility facility : facilities) {
            if (facility.isAvailable() == available) {
                result.add(facility);
            }
        }

        return result;
    }
}