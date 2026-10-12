package com.campus.canteen.service;

import com.campus.canteen.dto.*;
import com.campus.canteen.entity.*;
import com.campus.canteen.exception.BadRequestException;
import com.campus.canteen.exception.OrderLifecycleException;
import com.campus.canteen.exception.ResourceNotFoundException;
import com.campus.canteen.exception.UnauthorizedException;
import com.campus.canteen.repository.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.concurrent.ThreadLocalRandom;
import java.util.stream.Collectors;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final OrderStatusHistoryRepository historyRepository;
    private final MenuItemRepository menuItemRepository;
    private final PickupSlotRepository pickupSlotRepository;
    private final UserRepository userRepository;
    private final PickupSlotService pickupSlotService;
    private final AdminService adminService;

    public OrderService(OrderRepository orderRepository,
                        OrderItemRepository orderItemRepository,
                        OrderStatusHistoryRepository historyRepository,
                        MenuItemRepository menuItemRepository,
                        PickupSlotRepository pickupSlotRepository,
                        UserRepository userRepository,
                        PickupSlotService pickupSlotService,
                        AdminService adminService) {
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.historyRepository = historyRepository;
        this.menuItemRepository = menuItemRepository;
        this.pickupSlotRepository = pickupSlotRepository;
        this.userRepository = userRepository;
        this.pickupSlotService = pickupSlotService;
        this.adminService = adminService;
    }

    @Transactional
    public OrderResponse createOrder(CreateOrderRequest request, String userEmail) {
        User user = userRepository.findByEmail(userEmail.toLowerCase())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (!user.isActive()) {
            throw new BadRequestException("User account is inactive. Order cannot be placed.");
        }

        // Validate Pickup Date
        LocalDate pickupDate = request.getPickupDate();
        if (pickupDate == null) {
            pickupDate = LocalDate.now();
        }
        if (pickupDate.isBefore(LocalDate.now())) {
            throw new BadRequestException("Cannot select a past date for pickup");
        }

        // Validate Slot
        PickupSlot slot = pickupSlotRepository.findById(request.getPickupSlotId())
                .orElseThrow(() -> new ResourceNotFoundException("Pickup slot not found with id: " + request.getPickupSlotId()));

        if (!slot.isActive()) {
            throw new BadRequestException("Selected pickup slot is currently inactive");
        }

        if (pickupDate.isEqual(LocalDate.now()) && slot.getEndTime().isBefore(LocalTime.now())) {
            throw new BadRequestException("Selected pickup slot has already passed for today");
        }

        long existingSlotBookings = orderRepository.countByPickupSlotIdAndPickupDate(slot.getId(), pickupDate);
        if (existingSlotBookings >= slot.getCapacity()) {
            throw new BadRequestException("Selected pickup slot is fully booked. Please select another time slot.");
        }

        // Validate Items
        if (request.getItems() == null || request.getItems().isEmpty()) {
            throw new BadRequestException("Order must contain at least one item");
        }

        BigDecimal subtotal = BigDecimal.ZERO;
        List<OrderItem> itemsToSave = new ArrayList<>();

        for (OrderItemRequest itemReq : request.getItems()) {
            if (itemReq.getQuantity() == null || itemReq.getQuantity() <= 0) {
                throw new BadRequestException("Item quantity must be at least 1");
            }

            MenuItem menuItem = menuItemRepository.findById(itemReq.getMenuItemId())
                    .orElseThrow(() -> new ResourceNotFoundException("Menu item not found with id: " + itemReq.getMenuItemId()));

            if (!menuItem.isAvailable()) {
                throw new BadRequestException("Item '" + menuItem.getName() + "' is currently sold out and unavailable");
            }

            BigDecimal lineTotal = menuItem.getPrice().multiply(BigDecimal.valueOf(itemReq.getQuantity()));
            subtotal = subtotal.add(lineTotal);

            OrderItem orderItem = new OrderItem(
                    menuItem,
                    menuItem.getName(),
                    menuItem.getPrice(),
                    itemReq.getQuantity(),
                    lineTotal
            );
            itemsToSave.add(orderItem);
        }

        BigDecimal tax = BigDecimal.ZERO;
        BigDecimal grandTotal = subtotal.add(tax);

        // Generate human-friendly unique order number
        String dateStr = LocalDate.now().format(DateTimeFormatter.ofPattern("yyMMdd"));
        int rand = ThreadLocalRandom.current().nextInt(1000, 9999);
        String orderNumber = "CC-" + dateStr + "-" + rand;

        Order order = new Order();
        order.setOrderNumber(orderNumber);
        order.setUser(user);
        order.setStatus(OrderStatus.PLACED);
        order.setSubtotal(subtotal);
        order.setTaxAmount(tax);
        order.setTotalAmount(grandTotal);
        order.setPickupSlot(slot);
        order.setPickupDate(pickupDate);
        order.setPaymentMethod(request.getPaymentMethod() != null ? request.getPaymentMethod() : "CAMPUS_COUNTER_PAY");
        order.setSpecialInstructions(request.getSpecialInstructions());

        for (OrderItem oi : itemsToSave) {
            order.addItem(oi);
        }

        Order savedOrder = orderRepository.save(order);

        // Record Initial History
        OrderStatusHistory history = new OrderStatusHistory(
                savedOrder,
                null,
                OrderStatus.PLACED.name(),
                user,
                "Order placed by customer via pre-order portal"
        );
        historyRepository.save(history);

        return mapToOrderResponse(savedOrder);
    }

    public List<OrderResponse> getCustomerOrders(String userEmail) {
        User user = userRepository.findByEmail(userEmail.toLowerCase())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return orderRepository.findByUserIdOrderByCreatedAtDesc(user.getId()).stream()
                .map(this::mapToOrderResponse)
                .collect(Collectors.toList());
    }

    public OrderResponse getOrderById(Long orderId, String userEmail, boolean isStaffOrAdmin) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + orderId));

        if (!isStaffOrAdmin && !order.getUser().getEmail().equalsIgnoreCase(userEmail)) {
            throw new UnauthorizedException("You are not authorized to view this order");
        }

        return mapToOrderResponse(order);
    }

    public OrderResponse getOrderByNumber(String orderNumber, String userEmail, boolean isStaffOrAdmin) {
        Order order = orderRepository.findByOrderNumber(orderNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with number: " + orderNumber));

        if (!isStaffOrAdmin && !order.getUser().getEmail().equalsIgnoreCase(userEmail)) {
            throw new UnauthorizedException("You are not authorized to view this order");
        }

        return mapToOrderResponse(order);
    }

    @Transactional
    public OrderResponse cancelOrder(Long orderId, String reason, String userEmail, boolean isStaffOrAdmin) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + orderId));

        if (!isStaffOrAdmin && !order.getUser().getEmail().equalsIgnoreCase(userEmail)) {
            throw new UnauthorizedException("You can only cancel your own orders");
        }

        if (order.getStatus() != OrderStatus.PLACED) {
            throw new OrderLifecycleException("Order cannot be cancelled because it is already in '" +
                    order.getStatus() + "' status. Cancellation is only allowed when status is 'PLACED'.");
        }

        User actingUser = userRepository.findByEmail(userEmail.toLowerCase()).orElse(null);

        String previousStatus = order.getStatus().name();
        order.setStatus(OrderStatus.CANCELLED);
        order.setCancellationReason(reason != null ? reason : "Cancelled by user");

        Order savedOrder = orderRepository.save(order);

        OrderStatusHistory history = new OrderStatusHistory(
                savedOrder,
                previousStatus,
                OrderStatus.CANCELLED.name(),
                actingUser,
                "Cancelled: " + (reason != null ? reason : "No reason provided")
        );
        historyRepository.save(history);

        return mapToOrderResponse(savedOrder);
    }

    @Transactional
    public OrderResponse updateOrderStatus(Long orderId, OrderStatusUpdateRequest request, String staffEmail) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + orderId));

        OrderStatus currentStatus = order.getStatus();
        OrderStatus nextStatus = request.getStatus();

        if (!currentStatus.canTransitionTo(nextStatus)) {
            throw new OrderLifecycleException("Invalid status transition: Cannot move order from " +
                    currentStatus + " to " + nextStatus);
        }

        User staff = userRepository.findByEmail(staffEmail.toLowerCase()).orElse(null);

        order.setStatus(nextStatus);
        Order savedOrder = orderRepository.save(order);

        OrderStatusHistory history = new OrderStatusHistory(
                savedOrder,
                currentStatus.name(),
                nextStatus.name(),
                staff,
                request.getNotes() != null ? request.getNotes() : ("Status changed to " + nextStatus)
        );
        historyRepository.save(history);

        return mapToOrderResponse(savedOrder);
    }

    public List<OrderResponse> getStaffOperationalOrders(OrderStatus status) {
        List<Order> orders;
        if (status != null) {
            orders = orderRepository.findByStatusOrderByCreatedAtDesc(status);
        } else {
            // All active operational orders: PLACED, PREPARING, READY
            orders = orderRepository.findByStatusInOrderByCreatedAtAsc(
                    Arrays.asList(OrderStatus.PLACED, OrderStatus.PREPARING, OrderStatus.READY)
            );
        }

        return orders.stream()
                .map(this::mapToOrderResponse)
                .collect(Collectors.toList());
    }

    public Page<OrderResponse> getAllOrders(OrderStatus status, LocalDate startDate, LocalDate endDate,
                                            String orderNumber, Pageable pageable) {
        String cleanNumber = (orderNumber != null && !orderNumber.trim().isEmpty()) ? orderNumber.trim() : null;
        Page<Order> page = orderRepository.searchOrders(status, startDate, endDate, cleanNumber, pageable);
        return page.map(this::mapToOrderResponse);
    }

    public OrderResponse mapToOrderResponse(Order order) {
        OrderResponse resp = new OrderResponse();
        resp.setId(order.getId());
        resp.setOrderNumber(order.getOrderNumber());
        resp.setUserId(order.getUser().getId());
        resp.setCustomerName(order.getUser().getFullName());
        resp.setCustomerEmail(order.getUser().getEmail());
        resp.setCustomerPhone(order.getUser().getPhone());
        resp.setStatus(order.getStatus());
        resp.setSubtotal(order.getSubtotal());
        resp.setTaxAmount(order.getTaxAmount());
        resp.setTotalAmount(order.getTotalAmount());
        resp.setPickupDate(order.getPickupDate());
        resp.setPaymentMethod(order.getPaymentMethod());
        resp.setSpecialInstructions(order.getSpecialInstructions());
        resp.setCancellationReason(order.getCancellationReason());
        resp.setCreatedAt(order.getCreatedAt());
        resp.setUpdatedAt(order.getUpdatedAt());

        resp.setPickupSlot(pickupSlotService.mapToDtoWithDate(order.getPickupSlot(), order.getPickupDate()));

        List<OrderItemResponse> itemResponses = order.getItems().stream()
                .map(item -> new OrderItemResponse(
                        item.getId(),
                        item.getMenuItem() != null ? item.getMenuItem().getId() : null,
                        item.getItemNameSnapshot(),
                        item.getUnitPrice(),
                        item.getQuantity(),
                        item.getLineTotal(),
                        item.getMenuItem() != null ? item.getMenuItem().getImageUrl() : null
                ))
                .collect(Collectors.toList());
        resp.setItems(itemResponses);

        List<OrderStatusHistory> histories = historyRepository.findByOrderIdOrderByChangedAtAsc(order.getId());
        List<OrderStatusHistoryResponse> historyResponses = histories.stream()
                .map(h -> new OrderStatusHistoryResponse(
                        h.getId(),
                        h.getPreviousStatus(),
                        h.getNewStatus(),
                        h.getChangedBy() != null ? h.getChangedBy().getFullName() : "System",
                        h.getNotes(),
                        h.getChangedAt()
                ))
                .collect(Collectors.toList());
        resp.setStatusHistory(historyResponses);

        return resp;
    }
}
