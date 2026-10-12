package com.campus.canteen.entity;

public enum OrderStatus {
    PLACED,
    PREPARING,
    READY,
    COLLECTED,
    CANCELLED;

    public boolean canTransitionTo(OrderStatus next) {
        if (this == next) return false;
        return switch (this) {
            case PLACED -> next == PREPARING || next == CANCELLED;
            case PREPARING -> next == READY;
            case READY -> next == COLLECTED;
            case COLLECTED, CANCELLED -> false;
        };
    }
}
