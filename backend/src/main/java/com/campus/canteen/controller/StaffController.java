package com.campus.canteen.controller;

import com.campus.canteen.dto.ApiResponse;
import com.campus.canteen.dto.AvailabilityRequest;
import com.campus.canteen.dto.MenuItemDto;
import com.campus.canteen.dto.OrderResponse;
import com.campus.canteen.dto.OrderStatusUpdateRequest;
import com.campus.canteen.entity.OrderStatus;
import com.campus.canteen.service.MenuService;
import com.campus.canteen.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/staff")
@PreAuthorize("hasAnyAuthority('ROLE_STAFF', 'ROLE_ADMIN')")
public class StaffController {

    private final OrderService orderService;
    private final MenuService menuService;

    public StaffController(OrderService orderService, MenuService menuService) {
        this.orderService = orderService;
        this.menuService = menuService;
    }

    @GetMapping("/orders")
    public ResponseEntity<ApiResponse<List<OrderResponse>>> getOperationalOrders(
            @RequestParam(required = false) OrderStatus status) {
        List<OrderResponse> orders = orderService.getStaffOperationalOrders(status);
        return ResponseEntity.ok(ApiResponse.success(orders));
    }

    @PatchMapping("/orders/{id}/status")
    public ResponseEntity<ApiResponse<OrderResponse>> updateOrderStatus(
            Authentication authentication,
            @PathVariable Long id,
            @Valid @RequestBody OrderStatusUpdateRequest request) {
        OrderResponse updated = orderService.updateOrderStatus(id, request, authentication.getName());
        return ResponseEntity.ok(ApiResponse.success("Order status updated successfully", updated));
    }

    @PatchMapping("/menu/{id}/availability")
    public ResponseEntity<ApiResponse<MenuItemDto>> updateMenuAvailability(
            Authentication authentication,
            @PathVariable Long id,
            @Valid @RequestBody AvailabilityRequest request) {
        MenuItemDto updated = menuService.updateAvailability(id, request.getAvailable(), authentication.getName());
        return ResponseEntity.ok(ApiResponse.success("Menu item availability updated", updated));
    }
}
