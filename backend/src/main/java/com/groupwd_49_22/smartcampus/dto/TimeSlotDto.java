package com.groupwd_49_22.smartcampus.dto;

import java.time.LocalTime;

public class TimeSlotDto {

    private LocalTime startTime;
    private LocalTime endTime;

    public TimeSlotDto() {
    }

    public TimeSlotDto(LocalTime startTime, LocalTime endTime) {
        this.startTime = startTime;
        this.endTime = endTime;
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
}