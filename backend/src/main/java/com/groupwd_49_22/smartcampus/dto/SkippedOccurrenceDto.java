package com.groupwd_49_22.smartcampus.dto;

import java.time.LocalDate;
import java.time.LocalTime;

public class SkippedOccurrenceDto {

    private LocalDate bookingDate;
    private LocalTime startTime;
    private LocalTime endTime;
    private String reason;

    public SkippedOccurrenceDto() {
    }

    public SkippedOccurrenceDto(LocalDate bookingDate, LocalTime startTime, LocalTime endTime, String reason) {
        this.bookingDate = bookingDate;
        this.startTime = startTime;
        this.endTime = endTime;
        this.reason = reason;
    }

    public LocalDate getBookingDate() {
        return bookingDate;
    }

    public void setBookingDate(LocalDate bookingDate) {
        this.bookingDate = bookingDate;
    }

    public LocalTime getStartTime() {
        return startTime;
    }

    public void setStartTime(LocalTime startTime) {
        this.startTime = startTime;
    }

    public LocalTime getEndTime() {
        return endTime;
    }

    public void setEndTime(LocalTime endTime) {
        this.endTime = endTime;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }
}