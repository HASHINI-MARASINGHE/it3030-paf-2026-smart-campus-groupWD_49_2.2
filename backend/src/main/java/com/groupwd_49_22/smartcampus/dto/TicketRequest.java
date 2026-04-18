package com.groupwd_49_22.smartcampus.dto;

import com.groupwd_49_22.smartcampus.model.TicketCategory;
import com.groupwd_49_22.smartcampus.model.TicketPriority;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class TicketRequest {

    @NotNull(message = "Facility ID is required")
    private Long facilityId;

    @NotBlank(message = "Reporter name is required")
    @Size(max = 100, message = "Reporter name cannot exceed 100 characters")
    private String reporterName;

    @NotBlank(message = "Reporter email is required")
    @Email(message = "Invalid email format")
    private String reporterEmail;

    @NotBlank(message = "Title is required")
    @Size(max = 200, message = "Title cannot exceed 200 characters")
    private String title;

    @NotBlank(message = "Description is required")
    private String description;

    @NotNull(message = "Category is required")
    private TicketCategory category;

    @NotNull(message = "Priority is required")
    private TicketPriority priority;

    public TicketRequest() {
    }

    public Long getFacilityId() {
        return facilityId;
    }

    public String getReporterName() {
        return reporterName;
    }

    public String getReporterEmail() {
        return reporterEmail;
    }

    public String getTitle() {
        return title;
    }

    public String getDescription() {
        return description;
    }

    public TicketCategory getCategory() {
        return category;
    }

    public TicketPriority getPriority() {
        return priority;
    }

    public void setFacilityId(Long facilityId) {
        this.facilityId = facilityId;
    }

    public void setReporterName(String reporterName) {
        this.reporterName = reporterName;
    }

    public void setReporterEmail(String reporterEmail) {
        this.reporterEmail = reporterEmail;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setCategory(TicketCategory category) {
        this.category = category;
    }

    public void setPriority(TicketPriority priority) {
        this.priority = priority;
    }
}
