package com.groupwd_49_22.smartcampus.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Table(name = "booking")
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "facility_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Facility facility;

    @Column(name = "user_name", nullable = false, length = 100)
    private String userName;

    @Column(name = "user_email", nullable = false, length = 150)
    private String userEmail;

    @Column(name = "booking_date", nullable = false)
    private LocalDate bookingDate;

    @Column(name = "start_time", nullable = false)
    private LocalTime startTime;

    @Column(name = "end_time", nullable = false)
    private LocalTime endTime;

    @Column(nullable = false, length = 255)
    private String purpose;

    @Column(name = "expected_attendees")
    private Integer expectedAttendees;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private BookingStatus status;

    @Column(name = "admin_reason", length = 255)
    private String adminReason;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public Booking() {
    }

    public Booking(Long id, Facility facility, String userName, String userEmail,
                   LocalDate bookingDate, LocalTime startTime, LocalTime endTime,
                   String purpose, Integer expectedAttendees, BookingStatus status,
                   String adminReason, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.facility = facility;
        this.userName = userName;
        this.userEmail = userEmail;
        this.bookingDate = bookingDate;
        this.startTime = startTime;
        this.endTime = endTime;
        this.purpose = purpose;
        this.expectedAttendees = expectedAttendees;
        this.status = status;
        this.adminReason = adminReason;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public Long getId() {
        return id;
    }

    public Facility getFacility() {
        return facility;
    }

    public String getUserName() {
        return userName;
    }

    public String getUserEmail() {
        return userEmail;
    }

    public LocalDate getBookingDate() {
        return bookingDate;
    }

    public LocalTime getStartTime() {
        return startTime;
    }

    public LocalTime getEndTime() {
        return endTime;
    }

    public String getPurpose() {
        return purpose;
    }

    public Integer getExpectedAttendees() {
        return expectedAttendees;
    }

    public BookingStatus getStatus() {
        return status;
    }

    public String getAdminReason() {
        return adminReason;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setFacility(Facility facility) {
        this.facility = facility;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }

    public void setBookingDate(LocalDate bookingDate) {
        this.bookingDate = bookingDate;
    }

    public void setStartTime(LocalTime startTime) {
        this.startTime = startTime;
    }

    public void setEndTime(LocalTime endTime) {
        this.endTime = endTime;
    }

    public void setPurpose(String purpose) {
        this.purpose = purpose;
    }

    public void setExpectedAttendees(Integer expectedAttendees) {
        this.expectedAttendees = expectedAttendees;
    }

    public void setStatus(BookingStatus status) {
        this.status = status;
    }

    public void setAdminReason(String adminReason) {
        this.adminReason = adminReason;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}