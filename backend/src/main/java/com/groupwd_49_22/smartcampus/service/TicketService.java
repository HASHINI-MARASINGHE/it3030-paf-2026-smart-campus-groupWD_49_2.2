package com.groupwd_49_22.smartcampus.service;

import com.groupwd_49_22.smartcampus.dto.TicketRequest;
import com.groupwd_49_22.smartcampus.dto.TicketUpdateRequest;
import com.groupwd_49_22.smartcampus.exception.ResourceNotFoundException;
import com.groupwd_49_22.smartcampus.model.*;
import com.groupwd_49_22.smartcampus.repository.FacilityRepository;
import com.groupwd_49_22.smartcampus.repository.TicketRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class TicketService {

    private final TicketRepository ticketRepository;
    private final FacilityRepository facilityRepository;

    public TicketService(TicketRepository ticketRepository, FacilityRepository facilityRepository) {
        this.ticketRepository = ticketRepository;
        this.facilityRepository = facilityRepository;
    }

    public Ticket createTicket(TicketRequest request) {
        Facility facility = facilityRepository.findById(request.getFacilityId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Facility not found with id: " + request.getFacilityId()));

        Ticket ticket = new Ticket();
        ticket.setFacility(facility);
        ticket.setReporterName(request.getReporterName().trim());
        ticket.setReporterEmail(request.getReporterEmail().trim().toLowerCase(Locale.ROOT));
        ticket.setTitle(request.getTitle().trim());
        ticket.setDescription(request.getDescription().trim());
        ticket.setCategory(request.getCategory());
        ticket.setPriority(request.getPriority());
        ticket.setStatus(TicketStatus.OPEN);
        ticket.setAssignedTo(null);
        ticket.setResolutionNote(null);

        return ticketRepository.save(ticket);
    }

    public List<Ticket> getAllTickets(String status, String priority, String category, Long facilityId) {
        return ticketRepository.findAllByOrderByCreatedAtDesc().stream()
                .filter(t -> status == null || status.isBlank()
                        || t.getStatus().name().equalsIgnoreCase(status))
                .filter(t -> priority == null || priority.isBlank()
                        || t.getPriority().name().equalsIgnoreCase(priority))
                .filter(t -> category == null || category.isBlank()
                        || t.getCategory().name().equalsIgnoreCase(category))
                .filter(t -> facilityId == null
                        || t.getFacility().getId().equals(facilityId))
                .collect(Collectors.toList());
    }

    public List<Ticket> getMyTickets(String reporterEmail) {
        if (reporterEmail == null || reporterEmail.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Reporter email is required.");
        }
        return ticketRepository.findByReporterEmailIgnoreCaseOrderByCreatedAtDesc(reporterEmail.trim());
    }

    public Ticket getTicketById(Long id) {
        return ticketRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found with id: " + id));
    }

    public Ticket updateTicket(Long id, TicketUpdateRequest request) {
        Ticket ticket = getTicketById(id);

        TicketStatus newStatus = request.getStatus();

        if (newStatus == TicketStatus.RESOLVED || newStatus == TicketStatus.CLOSED) {
            if (request.getResolutionNote() == null || request.getResolutionNote().isBlank()) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "A resolution note is required when resolving or closing a ticket."
                );
            }
        }

        ticket.setStatus(newStatus);

        if (request.getAssignedTo() != null && !request.getAssignedTo().isBlank()) {
            ticket.setAssignedTo(request.getAssignedTo().trim());
        }

        if (request.getResolutionNote() != null && !request.getResolutionNote().isBlank()) {
            ticket.setResolutionNote(request.getResolutionNote().trim());
        }

        return ticketRepository.save(ticket);
    }

    public void deleteTicket(Long id) {
        Ticket ticket = getTicketById(id);
        ticketRepository.delete(ticket);
    }

    public Map<String, Long> getTicketStats() {
        Map<String, Long> stats = new LinkedHashMap<>();
        stats.put("total", ticketRepository.count());
        stats.put("open", ticketRepository.countByStatus(TicketStatus.OPEN));
        stats.put("inProgress", ticketRepository.countByStatus(TicketStatus.IN_PROGRESS));
        stats.put("resolved", ticketRepository.countByStatus(TicketStatus.RESOLVED));
        stats.put("closed", ticketRepository.countByStatus(TicketStatus.CLOSED));
        return stats;
    }
}
