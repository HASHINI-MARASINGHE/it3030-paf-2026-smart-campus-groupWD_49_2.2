package com.groupwd_49_22.smartcampus.dto;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public class BookingAvailabilityResponse {

    private Long facilityId;
    private LocalDate bookingDate;
    private LocalTime campusOpenTime;
    private LocalTime campusCloseTime;
    private List<TimeSlotDto> bookedSlots;
    private List<TimeSlotDto> availableSlots;

    public BookingAvailabilityResponse() {
    }

    public BookingAvailabilityResponse(
            Long facilityId,
            LocalDate bookingDate,
            LocalTime campusOpenTime,
            LocalTime campusCloseTime,
            List<TimeSlotDto> bookedSlots,
            List<TimeSlotDto> availableSlots
    ) {
        this.facilityId = facilityId;
        this.bookingDate = bookingDate;
        this.campusOpenTime = campusOpenTime;
        this.campusCloseTime = campusCloseTime;
        this.bookedSlots = bookedSlots;
        this.availableSlots = availableSlots;
    }

    public Long getFacilityId() {
        return facilityId;
    }

    public void setFacilityId(Long facilityId) {
        this.facilityId = facilityId;
    }

    public LocalDate getBookingDate() {
        return bookingDate;
    }

    public void setBookingDate(LocalDate bookingDate) {
        this.bookingDate = bookingDate;
    }

    public LocalTime getCampusOpenTime() {
        return campusOpenTime;
    }

    public void setCampusOpenTime(LocalTime campusOpenTime) {
        this.campusOpenTime = campusOpenTime;
    }

    public LocalTime getCampusCloseTime() {
        return campusCloseTime;
    }

    public void setCampusCloseTime(LocalTime campusCloseTime) {
        this.campusCloseTime = campusCloseTime;
    }

    public List<TimeSlotDto> getBookedSlots() {
        return bookedSlots;
    }

    public void setBookedSlots(List<TimeSlotDto> bookedSlots) {
        this.bookedSlots = bookedSlots;
    }

    public List<TimeSlotDto> getAvailableSlots() {
        return availableSlots;
    }

    public void setAvailableSlots(List<TimeSlotDto> availableSlots) {
        this.availableSlots = availableSlots;
    }
}