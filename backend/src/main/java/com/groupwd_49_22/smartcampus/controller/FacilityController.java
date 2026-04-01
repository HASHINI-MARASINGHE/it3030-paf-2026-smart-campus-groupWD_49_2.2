package com.groupwd_49_22.smartcampus.controller;

import com.groupwd_49_22.smartcampus.model.Facility;
import com.groupwd_49_22.smartcampus.service.FacilityService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/facilities")
public class FacilityController {

    private final FacilityService facilityService;

    public FacilityController(FacilityService facilityService) {
        this.facilityService = facilityService;
    }

    @GetMapping
    public List<Facility> getAllFacilities() {
        return facilityService.getAllFacilities();
    }

    @PostMapping
    public String addFacility(@RequestBody Facility facility) {
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

    @GetMapping("/search")
    public List<Facility> searchFacilities(@RequestParam String name) {
        return facilityService.searchByName(name);
    }

    @GetMapping("/filter")
    public List<Facility> filterFacilities(@RequestParam boolean available) {
        return facilityService.filterByAvailability(available);
    }
}