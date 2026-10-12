package com.campus.canteen.dto;

import java.time.LocalDateTime;

public class OrderStatusHistoryResponse {
    private Long id;
    private String previousStatus;
    private String newStatus;
    private String changedByName;
    private String notes;
    private LocalDateTime changedAt;

    public OrderStatusHistoryResponse() {}

    public OrderStatusHistoryResponse(Long id, String previousStatus, String newStatus,
                                      String changedByName, String notes, LocalDateTime changedAt) {
        this.id = id;
        this.previousStatus = previousStatus;
        this.newStatus = newStatus;
        this.changedByName = changedByName;
        this.notes = notes;
        this.changedAt = changedAt;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getPreviousStatus() { return previousStatus; }
    public void setPreviousStatus(String previousStatus) { this.previousStatus = previousStatus; }

    public String getNewStatus() { return newStatus; }
    public void setNewStatus(String newStatus) { this.newStatus = newStatus; }

    public String getChangedByName() { return changedByName; }
    public void setChangedByName(String changedByName) { this.changedByName = changedByName; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public LocalDateTime getChangedAt() { return changedAt; }
    public void setChangedAt(LocalDateTime changedAt) { this.changedAt = changedAt; }
}
