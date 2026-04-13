package com.groupwd_49_22.smartcampus.repository;

import com.groupwd_49_22.smartcampus.model.Booking;
import com.groupwd_49_22.smartcampus.model.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    List<Booking> findByUserEmailIgnoreCaseOrderByCreatedAtDesc(String userEmail);

    List<Booking> findAllByOrderByCreatedAtDesc();

    @Query("""
            SELECT b FROM Booking b
            WHERE b.facility.id = :facilityId
              AND b.bookingDate = :bookingDate
              AND b.status IN :statuses
              AND (:startTime < b.endTime AND :endTime > b.startTime)
            """)
    List<Booking> findConflictingBookings(
            @Param("facilityId") Long facilityId,
            @Param("bookingDate") LocalDate bookingDate,
            @Param("startTime") LocalTime startTime,
            @Param("endTime") LocalTime endTime,
            @Param("statuses") List<BookingStatus> statuses
    );
}