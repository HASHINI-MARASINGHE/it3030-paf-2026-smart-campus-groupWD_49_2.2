package com.groupwd_49_22.smartcampus.repository;

import com.groupwd_49_22.smartcampus.model.Ticket;
import com.groupwd_49_22.smartcampus.model.TicketCategory;
import com.groupwd_49_22.smartcampus.model.TicketPriority;
import com.groupwd_49_22.smartcampus.model.TicketStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TicketRepository extends JpaRepository<Ticket, Long> {

    List<Ticket> findAllByOrderByCreatedAtDesc();

    List<Ticket> findByReporterEmailIgnoreCaseOrderByCreatedAtDesc(String reporterEmail);

    List<Ticket> findByFacilityId(Long facilityId);

    List<Ticket> findByStatus(TicketStatus status);

    List<Ticket> findByPriority(TicketPriority priority);

    List<Ticket> findByCategory(TicketCategory category);

    long countByStatus(TicketStatus status);
}
