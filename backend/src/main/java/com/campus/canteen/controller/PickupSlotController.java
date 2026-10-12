package com.campus.canteen.controller;

import com.campus.canteen.dto.ApiResponse;
import com.campus.canteen.dto.PickupSlotDto;
import com.campus.canteen.service.PickupSlotService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/slots")
public class PickupSlotController {

    private final PickupSlotService slotService;

    public PickupSlotController(PickupSlotService slotService) {
        this.slotService = slotService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<PickupSlotDto>>> getSlots(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        List<PickupSlotDto> slots = slotService.getActiveSlotsForDate(date);
        return ResponseEntity.ok(ApiResponse.success(slots));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<PickupSlotDto>> getSlotById(@PathVariable Long id) {
        PickupSlotDto slot = slotService.getSlotById(id);
        return ResponseEntity.ok(ApiResponse.success(slot));
    }
}
