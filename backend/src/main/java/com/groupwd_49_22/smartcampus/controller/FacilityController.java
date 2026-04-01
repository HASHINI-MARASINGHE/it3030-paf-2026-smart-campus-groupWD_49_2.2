package com.groupwd_49_22.smartcampus.controller;

import com.groupwd_49_22.smartcampus.model.Facility;
import com.groupwd_49_22.smartcampus.service.FacilityService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/facilities")
@CrossOrigin(origins = "*")
public class FacilityController {

    private final FacilityService facilityService;

    public FacilityController(FacilityService facilityService) {
        this.facilityService = facilityService;
    }

    @GetMapping
    public List<Facility> getAllFacilities() {
        return facilityService.getAllFacilities();
    }

    @GetMapping("/search")
    public List<Facility> searchFacilities(@RequestParam String name) {
        return facilityService.searchByName(name);
    }

    @GetMapping("/filter")
    public List<Facility> filterFacilities(@RequestParam boolean available) {
        return facilityService.filterByAvailability(available);
    }

    @GetMapping("/filter/type")
    public List<Facility> filterFacilitiesByType(@RequestParam String type) {
        return facilityService.filterByType(type);
    }

    @GetMapping("/filter/location")
    public List<Facility> filterFacilitiesByLocation(@RequestParam String location) {
        return facilityService.filterByLocation(location);
    }

    @GetMapping("/filter/capacity")
    public List<Facility> filterFacilitiesByCapacity(@RequestParam int capacity) {
        return facilityService.filterByMinimumCapacity(capacity);
    }

    @GetMapping("/filter/status")
    public List<Facility> filterFacilitiesByStatus(@RequestParam String status) {
        return facilityService.filterByStatus(status);
    }

    @GetMapping("/{id}")
    public Facility getFacilityById(@PathVariable Long id) {
        return facilityService.getFacilityById(id);
    }

    @PostMapping
    public Facility addFacility(@Valid @RequestBody Facility facility) {
        return facilityService.addFacility(facility);
    }

    @PutMapping("/{id}")
    public String updateFacility(@PathVariable Long id, @RequestBody Facility facility) {
        return facilityService.updateFacility(id, facility);
    }

    @DeleteMapping("/{id}")
    public String deleteFacility(@PathVariable Long id) {
        return facilityService.deleteFacility(id);
    }
}