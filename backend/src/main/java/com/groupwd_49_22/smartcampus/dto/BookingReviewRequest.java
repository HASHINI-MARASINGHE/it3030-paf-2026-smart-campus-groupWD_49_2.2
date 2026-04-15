package com.groupwd_49_22.smartcampus.dto;

import com.groupwd_49_22.smartcampus.model.BookingStatus;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class BookingReviewRequest {

    @NotNull(message = "Status is required")
    private BookingStatus status;

    @Size(max = 255, message = "Reason cannot exceed 255 characters")
    private String reason;

    public BookingReviewRequest() {
    }

    public BookingStatus getStatus() {
        return status;
    }

    public String getReason() {
        return reason;
    }

    public void setStatus(BookingStatus status) {
        this.status = status;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }
}