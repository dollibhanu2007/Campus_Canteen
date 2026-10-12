package com.campus.canteen.service;

import com.campus.canteen.dto.PickupSlotDto;
import com.campus.canteen.dto.PickupSlotRequest;
import com.campus.canteen.entity.PickupSlot;
import com.campus.canteen.entity.User;
import com.campus.canteen.exception.BadRequestException;
import com.campus.canteen.exception.ResourceNotFoundException;
import com.campus.canteen.repository.OrderRepository;
import com.campus.canteen.repository.PickupSlotRepository;
import com.campus.canteen.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PickupSlotService {

    private final PickupSlotRepository slotRepository;
    private final OrderRepository orderRepository;
    private final AdminService adminService;
    private final UserRepository userRepository;

    public PickupSlotService(PickupSlotRepository slotRepository,
                             OrderRepository orderRepository,
                             AdminService adminService,
                             UserRepository userRepository) {
        this.slotRepository = slotRepository;
        this.orderRepository = orderRepository;
        this.adminService = adminService;
        this.userRepository = userRepository;
    }

    public List<PickupSlotDto> getActiveSlotsForDate(LocalDate date) {
        LocalDate targetDate = (date != null) ? date : LocalDate.now();
        List<PickupSlot> slots = slotRepository.findByActiveTrueOrderByStartTimeAsc();

        return slots.stream()
                .map(slot -> mapToDtoWithDate(slot, targetDate))
                .collect(Collectors.toList());
    }

    public List<PickupSlotDto> getAllSlots() {
        LocalDate today = LocalDate.now();
        return slotRepository.findAllByOrderByStartTimeAsc().stream()
                .map(slot -> mapToDtoWithDate(slot, today))
                .collect(Collectors.toList());
    }

    public PickupSlotDto getSlotById(Long id) {
        PickupSlot slot = slotRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Pickup slot not found with id: " + id));
        return mapToDtoWithDate(slot, LocalDate.now());
    }

    @Transactional
    public PickupSlotDto createSlot(PickupSlotRequest request, String adminEmail) {
        if (request.getEndTime().isBefore(request.getStartTime()) || request.getEndTime().equals(request.getStartTime())) {
            throw new BadRequestException("Slot end time must be after start time");
        }

        PickupSlot slot = new PickupSlot();
        slot.setSlotLabel(request.getSlotLabel().trim());
        slot.setStartTime(request.getStartTime());
        slot.setEndTime(request.getEndTime());
        slot.setCapacity(request.getCapacity() != null ? request.getCapacity() : 30);
        slot.setActive(request.getActive() != null ? request.getActive() : true);

        PickupSlot saved = slotRepository.save(slot);

        User admin = userRepository.findByEmail(adminEmail.toLowerCase()).orElse(null);
        adminService.logActivity(admin, "CREATE_PICKUP_SLOT", "PickupSlot", saved.getId().toString(),
                "Created pickup slot: " + saved.getSlotLabel());

        return mapToDtoWithDate(saved, LocalDate.now());
    }

    @Transactional
    public PickupSlotDto updateSlot(Long id, PickupSlotRequest request, String adminEmail) {
        PickupSlot slot = slotRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Pickup slot not found with id: " + id));

        if (request.getEndTime().isBefore(request.getStartTime()) || request.getEndTime().equals(request.getStartTime())) {
            throw new BadRequestException("Slot end time must be after start time");
        }

        slot.setSlotLabel(request.getSlotLabel().trim());
        slot.setStartTime(request.getStartTime());
        slot.setEndTime(request.getEndTime());
        slot.setCapacity(request.getCapacity());
        if (request.getActive() != null) {
            slot.setActive(request.getActive());
        }

        PickupSlot saved = slotRepository.save(slot);

        User admin = userRepository.findByEmail(adminEmail.toLowerCase()).orElse(null);
        adminService.logActivity(admin, "UPDATE_PICKUP_SLOT", "PickupSlot", saved.getId().toString(),
                "Updated pickup slot: " + saved.getSlotLabel());

        return mapToDtoWithDate(saved, LocalDate.now());
    }

    @Transactional
    public void deleteSlot(Long id, String adminEmail) {
        PickupSlot slot = slotRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Pickup slot not found with id: " + id));

        slotRepository.delete(slot);

        User admin = userRepository.findByEmail(adminEmail.toLowerCase()).orElse(null);
        adminService.logActivity(admin, "DELETE_PICKUP_SLOT", "PickupSlot", id.toString(),
                "Deleted pickup slot: " + slot.getSlotLabel());
    }

    public PickupSlotDto mapToDtoWithDate(PickupSlot slot, LocalDate date) {
        long bookings = orderRepository.countByPickupSlotIdAndPickupDate(slot.getId(), date);
        boolean capacityAvailable = bookings < slot.getCapacity();

        boolean isNotPast = true;
        if (date.isBefore(LocalDate.now())) {
            isNotPast = false;
        } else if (date.isEqual(LocalDate.now())) {
            isNotPast = slot.getEndTime().isAfter(LocalTime.now());
        }

        boolean availableForBooking = slot.isActive() && capacityAvailable && isNotPast;

        return new PickupSlotDto(
                slot.getId(),
                slot.getSlotLabel(),
                slot.getStartTime(),
                slot.getEndTime(),
                slot.getCapacity(),
                slot.isActive(),
                bookings,
                availableForBooking
        );
    }
}
