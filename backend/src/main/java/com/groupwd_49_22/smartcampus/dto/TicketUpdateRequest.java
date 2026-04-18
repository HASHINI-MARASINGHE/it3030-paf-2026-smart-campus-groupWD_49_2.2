package com.groupwd_49_22.smartcampus.dto;

import com.groupwd_49_22.smartcampus.model.TicketStatus;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class TicketUpdateRequest {

    @NotNull(message = "Status is required")
    private TicketStatus status;

    @Size(max = 100, message = "Assigned to cannot exceed 100 characters")
    private String assignedTo;

    private String resolutionNote;

    public TicketUpdateRequest() {
    }

    public TicketStatus getStatus() {
        return status;
    }

    public String getAssignedTo() {
        return assignedTo;
    }

    public String getResolutionNote() {
        return resolutionNote;
    }

    public void setStatus(TicketStatus status) {
        this.status = status;
    }

    public void setAssignedTo(String assignedTo) {
        this.assignedTo = assignedTo;
    }

    public void setResolutionNote(String resolutionNote) {
        this.resolutionNote = resolutionNote;
    }
}
