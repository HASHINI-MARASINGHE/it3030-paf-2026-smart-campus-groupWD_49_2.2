package com.groupwd_49_22.smartcampus.service;

import com.groupwd_49_22.smartcampus.dto.BookingAvailabilityResponse;
import com.groupwd_49_22.smartcampus.dto.BookingRequest;
import com.groupwd_49_22.smartcampus.dto.BookingReviewRequest;
import com.groupwd_49_22.smartcampus.dto.RecurringBookingResponse;
import com.groupwd_49_22.smartcampus.dto.SkippedOccurrenceDto;
import com.groupwd_49_22.smartcampus.dto.TimeSlotDto;
import com.groupwd_49_22.smartcampus.exception.ResourceNotFoundException;
import com.groupwd_49_22.smartcampus.model.Booking;
import com.groupwd_49_22.smartcampus.model.BookingStatus;
import com.groupwd_49_22.smartcampus.model.Facility;
import com.groupwd_49_22.smartcampus.model.RecurrenceType;
import com.groupwd_49_22.smartcampus.repository.BookingRepository;
import com.groupwd_49_22.smartcampus.repository.FacilityRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Objects;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class BookingService {

    private static final LocalTime CAMPUS_OPEN_TIME = LocalTime.of(6, 0);
    private static final LocalTime CAMPUS_CLOSE_TIME = LocalTime.of(22, 0);

    private final BookingRepository bookingRepository;
    private final FacilityRepository facilityRepository;

    public BookingService(BookingRepository bookingRepository, FacilityRepository facilityRepository) {
        this.bookingRepository = bookingRepository;
        this.facilityRepository = facilityRepository;
    }

    public RecurringBookingResponse createBooking(BookingRequest request) {
        validateTimeRange(request.getStartTime(), request.getEndTime());

        Facility facility = facilityRepository.findById(request.getFacilityId())
                .orElseThrow(() -> new ResourceNotFoundException("Facility not found with id: " + request.getFacilityId()));

        validateFacilityForBooking(facility, request.getExpectedAttendees());

        RecurrenceType recurrenceType = request.getRecurrenceType() == null
                ? RecurrenceType.NONE
                : request.getRecurrenceType();

        int totalOccurrences = resolveTotalOccurrences(recurrenceType, request.getRepeatCount());
        String recurrenceGroupId = totalOccurrences > 1 ? UUID.randomUUID().toString() : null;

        List<Booking> createdBookings = new ArrayList<>();
        List<SkippedOccurrenceDto> skippedOccurrences = new ArrayList<>();

        for (int i = 0; i < totalOccurrences; i++) {
            LocalDate occurrenceDate = calculateOccurrenceDate(request.getBookingDate(), recurrenceType, i);

            try {
                validateBookingDate(occurrenceDate);

                List<Booking> conflicts = bookingRepository.findConflictingBookings(
                        facility.getId(),
                        occurrenceDate,
                        request.getStartTime(),
                        request.getEndTime(),
                        List.of(BookingStatus.PENDING, BookingStatus.APPROVED)
                );

                if (!conflicts.isEmpty()) {
                    skippedOccurrences.add(new SkippedOccurrenceDto(
                            occurrenceDate,
                            request.getStartTime(),
                            request.getEndTime(),
                            "Time conflict exists for this occurrence."
                    ));
                    continue;
                }

                Booking booking = new Booking();
                booking.setFacility(facility);
                booking.setUserName(request.getUserName().trim());
                booking.setUserEmail(request.getUserEmail().trim().toLowerCase(Locale.ROOT));
                booking.setBookingDate(occurrenceDate);
                booking.setStartTime(request.getStartTime());
                booking.setEndTime(request.getEndTime());
                booking.setPurpose(request.getPurpose().trim());
                booking.setExpectedAttendees(request.getExpectedAttendees());
                booking.setStatus(BookingStatus.PENDING);
                booking.setAdminReason(null);

                if (totalOccurrences > 1) {
                    booking.setRecurrenceType(recurrenceType);
                    booking.setRecurrenceGroupId(recurrenceGroupId);
                    booking.setOccurrenceNumber(i + 1);
                    booking.setTotalOccurrences(totalOccurrences);
                } else {
                    booking.setRecurrenceType(RecurrenceType.NONE);
                    booking.setRecurrenceGroupId(null);
                    booking.setOccurrenceNumber(1);
                    booking.setTotalOccurrences(1);
                }

                createdBookings.add(bookingRepository.save(booking));

            } catch (ResponseStatusException ex) {
                skippedOccurrences.add(new SkippedOccurrenceDto(
                        occurrenceDate,
                        request.getStartTime(),
                        request.getEndTime(),
                        ex.getReason()
                ));
            }
        }

        int createdCount = createdBookings.size();
        int skippedCount = skippedOccurrences.size();

        String message;
        if (totalOccurrences == 1) {
            message = createdCount == 1
                    ? "Booking request submitted successfully."
                    : "Booking request could not be created.";
        } else {
            message = "Recurring booking processed. " + createdCount + " created, " + skippedCount + " skipped.";
        }

        return new RecurringBookingResponse(
                message,
                totalOccurrences,
                createdCount,
                skippedCount,
                createdBookings,
                skippedOccurrences
        );
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

        validateBookingDate(booking.getBookingDate());
        validateTimeRange(booking.getStartTime(), booking.getEndTime());

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

    public BookingAvailabilityResponse getBookingAvailability(Long facilityId, LocalDate bookingDate) {
        validateBookingDate(bookingDate);

        facilityRepository.findById(facilityId)
                .orElseThrow(() -> new ResourceNotFoundException("Facility not found with id: " + facilityId));

        List<Booking> sameDayBookings = bookingRepository.findByFacilityIdAndBookingDateAndStatusInOrderByStartTimeAsc(
                facilityId,
                bookingDate,
                List.of(BookingStatus.PENDING, BookingStatus.APPROVED)
        );

        List<TimeSlotDto> bookedSlots = sameDayBookings.stream()
                .map(booking -> new TimeSlotDto(booking.getStartTime(), booking.getEndTime()))
                .collect(Collectors.toList());

        List<TimeSlotDto> availableSlots = new ArrayList<>();
        LocalTime cursor = CAMPUS_OPEN_TIME;

        for (Booking booking : sameDayBookings) {
            LocalTime start = booking.getStartTime();
            LocalTime end = booking.getEndTime();

            if (cursor.isBefore(start)) {
                availableSlots.add(new TimeSlotDto(cursor, start));
            }

            if (end.isAfter(cursor)) {
                cursor = end;
            }
        }

        if (cursor.isBefore(CAMPUS_CLOSE_TIME)) {
            availableSlots.add(new TimeSlotDto(cursor, CAMPUS_CLOSE_TIME));
        }

        return new BookingAvailabilityResponse(
                facilityId,
                bookingDate,
                CAMPUS_OPEN_TIME,
                CAMPUS_CLOSE_TIME,
                bookedSlots,
                availableSlots
        );
    }

    private int resolveTotalOccurrences(RecurrenceType recurrenceType, Integer repeatCount) {
        if (recurrenceType == RecurrenceType.NONE) {
            return 1;
        }

        if (repeatCount == null || repeatCount < 2) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Repeat count must be at least 2 for recurring bookings."
            );
        }

        if (repeatCount > 12) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Repeat count cannot exceed 12."
            );
        }

        return repeatCount;
    }

    private LocalDate calculateOccurrenceDate(LocalDate baseDate, RecurrenceType recurrenceType, int index) {
        if (recurrenceType == RecurrenceType.WEEKLY) {
            return baseDate.plusWeeks(index);
        }

        if (recurrenceType == RecurrenceType.MONTHLY) {
            return baseDate.plusMonths(index);
        }

        return baseDate;
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

        if (expectedAttendees == null || expectedAttendees < 1) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Expected attendees must be at least 1."
            );
        }

        if (expectedAttendees > facility.getCapacity()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Expected attendees exceed the facility capacity."
            );
        }
    }

    private void validateBookingDate(LocalDate bookingDate) {
        if (bookingDate == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Booking date is required."
            );
        }

        if (bookingDate.isBefore(LocalDate.now())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Past dates cannot be booked."
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

        if (startTime.isBefore(CAMPUS_OPEN_TIME) || endTime.isAfter(CAMPUS_CLOSE_TIME)) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Bookings are allowed only between 06:00 and 22:00."
            );
        }
    }
}