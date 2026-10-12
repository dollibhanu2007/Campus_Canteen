package com.campus.canteen;

import com.campus.canteen.dto.CreateOrderRequest;
import com.campus.canteen.dto.OrderItemRequest;
import com.campus.canteen.dto.OrderResponse;
import com.campus.canteen.dto.OrderStatusUpdateRequest;
import com.campus.canteen.entity.OrderStatus;
import com.campus.canteen.exception.OrderLifecycleException;
import com.campus.canteen.repository.MenuItemRepository;
import com.campus.canteen.repository.PickupSlotRepository;
import com.campus.canteen.service.OrderService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.Collections;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
public class OrderServiceTest {

    @Autowired
    private OrderService orderService;

    @Autowired
    private MenuItemRepository menuItemRepository;

    @Autowired
    private PickupSlotRepository slotRepository;

    @Test
    @DisplayName("TEST 5 - Order Placement: Calculates server total and creates initial PLACED order")
    public void testOrderCreation() {
        var items = menuItemRepository.findByAvailableTrue();
        assertFalse(items.isEmpty(), "MenuItems should be seeded");
        var item = items.get(0);

        var slots = slotRepository.findByActiveTrueOrderByStartTimeAsc();
        assertFalse(slots.isEmpty(), "Slots should be seeded");
        var slot = slots.get(0);

        CreateOrderRequest request = new CreateOrderRequest();
        request.setPickupDate(LocalDate.now().plusDays(1));
        request.setPickupSlotId(slot.getId());
        request.setPaymentMethod("CAMPUS_COUNTER_PAY");
        request.setItems(Collections.singletonList(new OrderItemRequest(item.getId(), 2)));

        OrderResponse response = orderService.createOrder(request, "student@campus.edu");

        assertNotNull(response.getId());
        assertNotNull(response.getOrderNumber());
        assertEquals(OrderStatus.PLACED, response.getStatus());
        assertEquals(item.getPrice().multiply(java.math.BigDecimal.valueOf(2)), response.getTotalAmount());
        assertEquals(1, response.getItems().size());
    }

    @Test
    @DisplayName("TEST 7 - Order Workflow & Lifecycle: Staff transitions PLACED -> PREPARING -> READY -> COLLECTED")
    public void testOrderStatusLifecycle() {
        var items = menuItemRepository.findByAvailableTrue();
        var slots = slotRepository.findByActiveTrueOrderByStartTimeAsc();

        CreateOrderRequest request = new CreateOrderRequest();
        request.setPickupDate(LocalDate.now().plusDays(1));
        request.setPickupSlotId(slots.get(0).getId());
        request.setItems(Collections.singletonList(new OrderItemRequest(items.get(0).getId(), 1)));

        OrderResponse placed = orderService.createOrder(request, "student@campus.edu");
        assertEquals(OrderStatus.PLACED, placed.getStatus());

        // Move to PREPARING
        OrderResponse preparing = orderService.updateOrderStatus(
                placed.getId(),
                new OrderStatusUpdateRequest(OrderStatus.PREPARING, "Chef started cooking"),
                "staff@campus.edu"
        );
        assertEquals(OrderStatus.PREPARING, preparing.getStatus());

        // Attempting to cancel an order once in PREPARING must throw OrderLifecycleException
        assertThrows(OrderLifecycleException.class, () -> {
            orderService.cancelOrder(placed.getId(), "Want to cancel", "student@campus.edu", false);
        });

        // Move to READY
        OrderResponse ready = orderService.updateOrderStatus(
                placed.getId(),
                new OrderStatusUpdateRequest(OrderStatus.READY, "Order ready at counter 2"),
                "staff@campus.edu"
        );
        assertEquals(OrderStatus.READY, ready.getStatus());

        // Move to COLLECTED
        OrderResponse collected = orderService.updateOrderStatus(
                placed.getId(),
                new OrderStatusUpdateRequest(OrderStatus.COLLECTED, "Collected by student"),
                "staff@campus.edu"
        );
        assertEquals(OrderStatus.COLLECTED, collected.getStatus());
    }
}
