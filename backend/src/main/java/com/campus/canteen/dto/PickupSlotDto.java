package com.campus.canteen.dto;

import java.time.LocalTime;

public class PickupSlotDto {
    private Long id;
    private String slotLabel;
    private LocalTime startTime;
    private LocalTime endTime;
    private Integer capacity;
    private boolean active;
    private long currentBookings;
    private boolean availableForBooking;

    public PickupSlotDto() {}

    public PickupSlotDto(Long id, String slotLabel, LocalTime startTime, LocalTime endTime,
                         Integer capacity, boolean active, long currentBookings, boolean availableForBooking) {
        this.id = id;
        this.slotLabel = slotLabel;
        this.startTime = startTime;
        this.endTime = endTime;
        this.capacity = capacity;
        this.active = active;
        this.currentBookings = currentBookings;
        this.availableForBooking = availableForBooking;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getSlotLabel() { return slotLabel; }
    public void setSlotLabel(String slotLabel) { this.slotLabel = slotLabel; }

    public LocalTime getStartTime() { return startTime; }
    public void setStartTime(LocalTime startTime) { this.startTime = startTime; }

    public LocalTime getEndTime() { return endTime; }
    public void setEndTime(LocalTime endTime) { this.endTime = endTime; }

    public Integer getCapacity() { return capacity; }
    public void setCapacity(Integer capacity) { this.capacity = capacity; }

    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }

    public long getCurrentBookings() { return currentBookings; }
    public void setCurrentBookings(long currentBookings) { this.currentBookings = currentBookings; }

    public boolean isAvailableForBooking() { return availableForBooking; }
    public void setAvailableForBooking(boolean availableForBooking) { this.availableForBooking = availableForBooking; }
}
