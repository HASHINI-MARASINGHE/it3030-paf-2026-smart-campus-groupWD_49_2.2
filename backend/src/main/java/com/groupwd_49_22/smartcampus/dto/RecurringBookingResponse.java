package com.groupwd_49_22.smartcampus.dto;

import com.groupwd_49_22.smartcampus.model.Booking;

import java.util.List;

public class RecurringBookingResponse {

    private String message;
    private int totalRequested;
    private int createdCount;
    private int skippedCount;
    private List<Booking> createdBookings;
    private List<SkippedOccurrenceDto> skippedOccurrences;

    public RecurringBookingResponse() {
    }

    public RecurringBookingResponse(String message, int totalRequested, int createdCount, int skippedCount,
                                    List<Booking> createdBookings, List<SkippedOccurrenceDto> skippedOccurrences) {
        this.message = message;
        this.totalRequested = totalRequested;
        this.createdCount = createdCount;
        this.skippedCount = skippedCount;
        this.createdBookings = createdBookings;
        this.skippedOccurrences = skippedOccurrences;
    }

    public String getMessage() {
        return message;
    }

    public int getTotalRequested() {
        return totalRequested;
    }

    public int getCreatedCount() {
        return createdCount;
    }

    public int getSkippedCount() {
        return skippedCount;
    }

    public List<Booking> getCreatedBookings() {
        return createdBookings;
    }

    public List<SkippedOccurrenceDto> getSkippedOccurrences() {
        return skippedOccurrences;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public void setTotalRequested(int totalRequested) {
        this.totalRequested = totalRequested;
    }

    public void setCreatedCount(int createdCount) {
        this.createdCount = createdCount;
    }

    public void setSkippedCount(int skippedCount) {
        this.skippedCount = skippedCount;
    }

    public void setCreatedBookings(List<Booking> createdBookings) {
        this.createdBookings = createdBookings;
    }

    public void setSkippedOccurrences(List<SkippedOccurrenceDto> skippedOccurrences) {
        this.skippedOccurrences = skippedOccurrences;
    }
}