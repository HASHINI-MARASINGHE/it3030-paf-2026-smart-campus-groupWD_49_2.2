package com.groupwd_49_22.smartcampus.controller;

import com.groupwd_49_22.smartcampus.model.Facility;
import com.groupwd_49_22.smartcampus.service.FacilityService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
    public ResponseEntity<List<Facility>> getAllFacilities() {
        return ResponseEntity.ok(facilityService.getAllFacilities());
    }

    @GetMapping("/search")
    public ResponseEntity<List<Facility>> searchFacilities(@RequestParam String name) {
        return ResponseEntity.ok(facilityService.searchByName(name));
    }

    @GetMapping("/filter")
    public ResponseEntity<List<Facility>> filterFacilities(@RequestParam boolean available) {
        return ResponseEntity.ok(facilityService.filterByAvailability(available));
    }

    @GetMapping("/filter/type")
    public ResponseEntity<List<Facility>> filterFacilitiesByType(@RequestParam String type) {
        return ResponseEntity.ok(facilityService.filterByType(type));
    }

    @GetMapping("/filter/location")
    public ResponseEntity<List<Facility>> filterFacilitiesByLocation(@RequestParam String location) {
        return ResponseEntity.ok(facilityService.filterByLocation(location));
    }

    @GetMapping("/filter/capacity")
    public ResponseEntity<List<Facility>> filterFacilitiesByCapacity(@RequestParam int capacity) {
        return ResponseEntity.ok(facilityService.filterByMinimumCapacity(capacity));
    }

    @GetMapping("/filter/status")
    public ResponseEntity<List<Facility>> filterFacilitiesByStatus(@RequestParam String status) {
        return ResponseEntity.ok(facilityService.filterByStatus(status));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Facility> getFacilityById(@PathVariable Long id) {
        return ResponseEntity.ok(facilityService.getFacilityById(id));
    }

    @PostMapping
    public ResponseEntity<Facility> addFacility(@Valid @RequestBody Facility facility) {
        Facility savedFacility = facilityService.addFacility(facility);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedFacility);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Facility> updateFacility(@PathVariable Long id, @Valid @RequestBody Facility facility) {
        Facility updatedFacility = facilityService.updateFacility(id, facility);
        return ResponseEntity.ok(updatedFacility);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFacility(@PathVariable Long id) {
        facilityService.deleteFacility(id);
        return ResponseEntity.noContent().build();
    }
}