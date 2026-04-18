package com.groupwd_49_22.smartcampus.controller;

import com.groupwd_49_22.smartcampus.dto.BookingAvailabilityResponse;
import com.groupwd_49_22.smartcampus.dto.BookingRequest;
import com.groupwd_49_22.smartcampus.dto.BookingReviewRequest;
import com.groupwd_49_22.smartcampus.dto.RecurringBookingResponse;
import com.groupwd_49_22.smartcampus.model.Booking;
import com.groupwd_49_22.smartcampus.service.BookingService;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "*")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @PostMapping
    public ResponseEntity<RecurringBookingResponse> createBooking(@Valid @RequestBody BookingRequest request) {
        RecurringBookingResponse response = bookingService.createBooking(request);

        HttpStatus status = response.getCreatedCount() == 0
                ? HttpStatus.CONFLICT
                : HttpStatus.CREATED;

        return ResponseEntity.status(status).body(response);
    }

    @GetMapping
    public ResponseEntity<List<Booking>> getAllBookings(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) Long facilityId,
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate bookingDate
    ) {
        return ResponseEntity.ok(bookingService.getAllBookings(status, facilityId, bookingDate));
    }

    @GetMapping("/my-bookings")
    public ResponseEntity<List<Booking>> getMyBookings(@RequestParam String email) {
        return ResponseEntity.ok(bookingService.getMyBookings(email));
    }

    @GetMapping("/availability")
    public ResponseEntity<BookingAvailabilityResponse> getBookingAvailability(
            @RequestParam Long facilityId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate bookingDate
    ) {
        return ResponseEntity.ok(bookingService.getBookingAvailability(facilityId, bookingDate));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Booking> getBookingById(@PathVariable Long id) {
        return ResponseEntity.ok(bookingService.getBookingById(id));
    }

    @PatchMapping("/{id}/review")
    public ResponseEntity<Booking> reviewBooking(
            @PathVariable Long id,
            @Valid @RequestBody BookingReviewRequest request
    ) {
        return ResponseEntity.ok(bookingService.reviewBooking(id, request));
    }

    @PatchMapping("/{id}/cancel")
    public ResponseEntity<Booking> cancelBooking(@PathVariable Long id) {
        return ResponseEntity.ok(bookingService.cancelBooking(id));
    }
}