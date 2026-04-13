package com.groupwd_49_22.smartcampus.service;

import com.groupwd_49_22.smartcampus.dto.BookingRequest;
import com.groupwd_49_22.smartcampus.dto.BookingReviewRequest;
import com.groupwd_49_22.smartcampus.exception.ResourceNotFoundException;
import com.groupwd_49_22.smartcampus.model.Booking;
import com.groupwd_49_22.smartcampus.model.BookingStatus;
import com.groupwd_49_22.smartcampus.model.Facility;
import com.groupwd_49_22.smartcampus.repository.BookingRepository;
import com.groupwd_49_22.smartcampus.repository.FacilityRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Locale;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final FacilityRepository facilityRepository;

    public BookingService(BookingRepository bookingRepository, FacilityRepository facilityRepository) {
        this.bookingRepository = bookingRepository;
        this.facilityRepository = facilityRepository;
    }

    public Booking createBooking(BookingRequest request) {
        validateTimeRange(request.getStartTime(), request.getEndTime());

        Facility facility = facilityRepository.findById(request.getFacilityId())
                .orElseThrow(() -> new ResourceNotFoundException("Facility not found with id: " + request.getFacilityId()));

        validateFacilityForBooking(facility, request.getExpectedAttendees());

        List<Booking> conflicts = bookingRepository.findConflictingBookings(
                facility.getId(),
                request.getBookingDate(),
                request.getStartTime(),
                request.getEndTime(),
                List.of(BookingStatus.PENDING, BookingStatus.APPROVED)
        );

        if (!conflicts.isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "This facility already has a booking request or approved booking in the selected time range."
            );
        }

        Booking booking = new Booking();
        booking.setFacility(facility);
        booking.setUserName(request.getUserName().trim());
        booking.setUserEmail(request.getUserEmail().trim().toLowerCase(Locale.ROOT));
        booking.setBookingDate(request.getBookingDate());
        booking.setStartTime(request.getStartTime());
        booking.setEndTime(request.getEndTime());
        booking.setPurpose(request.getPurpose().trim());
        booking.setExpectedAttendees(request.getExpectedAttendees());
        booking.setStatus(BookingStatus.PENDING);
        booking.setAdminReason(null);

        return bookingRepository.save(booking);
    }

    public List<Booking> getAllBookings(String status, Long facilityId, LocalDate bookingDate) {
        List<Booking> bookings = bookingRepository.findAllByOrderByCreatedAtDesc();

        return bookings.stream()
                .filter(booking -> status == null || status.isBlank()
                        || booking.getStatus().name().equalsIgnoreCase(status))
                .filter(booking -> facilityId == null
                        || Objects.equals(booking.getFacility().getId(), facilityId))
                .filter(booking -> bookingDate == null
                        || booking.getBookingDate().equals(bookingDate))
                .collect(Collectors.toList());
    }

    public List<Booking> getMyBookings(String userEmail) {
        if (userEmail == null || userEmail.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "User email is required.");
        }

        return bookingRepository.findByUserEmailIgnoreCaseOrderByCreatedAtDesc(userEmail.trim());
    }

    public Booking getBookingById(Long id) {
        return bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + id));
    }

    public Booking reviewBooking(Long id, BookingReviewRequest request) {
        Booking booking = getBookingById(id);

        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Only PENDING bookings can be approved or rejected."
            );
        }

        if (request.getStatus() != BookingStatus.APPROVED && request.getStatus() != BookingStatus.REJECTED) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Review status must be either APPROVED or REJECTED."
            );
        }

        if (request.getStatus() == BookingStatus.APPROVED) {
            validateFacilityForBooking(booking.getFacility(), booking.getExpectedAttendees());

            List<Booking> approvedConflicts = bookingRepository.findConflictingBookings(
                    booking.getFacility().getId(),
                    booking.getBookingDate(),
                    booking.getStartTime(),
                    booking.getEndTime(),
                    List.of(BookingStatus.APPROVED)
            );

            boolean hasOtherApprovedConflict = approvedConflicts.stream()
                    .anyMatch(existing -> !existing.getId().equals(booking.getId()));

            if (hasOtherApprovedConflict) {
                throw new ResponseStatusException(
                        HttpStatus.CONFLICT,
                        "Cannot approve this booking because the facility is already booked in that time range."
                );
            }

            booking.setStatus(BookingStatus.APPROVED);
            booking.setAdminReason(
                    request.getReason() == null || request.getReason().isBlank()
                            ? null
                            : request.getReason().trim()
            );
        } else {
            if (request.getReason() == null || request.getReason().isBlank()) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "A reason is required when rejecting a booking."
                );
            }

            booking.setStatus(BookingStatus.REJECTED);
            booking.setAdminReason(request.getReason().trim());
        }

        return bookingRepository.save(booking);
    }

    public Booking cancelBooking(Long id) {
        Booking booking = getBookingById(id);

        if (booking.getStatus() != BookingStatus.APPROVED) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Only APPROVED bookings can be cancelled."
            );
        }

        booking.setStatus(BookingStatus.CANCELLED);
        booking.setAdminReason("Cancelled by user/admin");

        return bookingRepository.save(booking);
    }

    private void validateFacilityForBooking(Facility facility, Integer expectedAttendees) {
        if (!facility.isAvailable()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Selected facility is not available."
            );
        }

        String facilityStatus = facility.getStatus() == null ? "" : facility.getStatus().trim();
        if (!facilityStatus.equalsIgnoreCase("ACTIVE")) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Only facilities with ACTIVE status can be booked."
            );
        }

        if (expectedAttendees != null && expectedAttendees > facility.getCapacity()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Expected attendees exceed the facility capacity."
            );
        }
    }

    private void validateTimeRange(LocalTime startTime, LocalTime endTime) {
        if (startTime == null || endTime == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Start time and end time are required."
            );
        }

        if (!startTime.isBefore(endTime)) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Start time must be earlier than end time."
            );
        }
    }
}