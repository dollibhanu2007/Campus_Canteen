package com.campus.canteen.controller;

import com.campus.canteen.dto.ApiResponse;
import com.campus.canteen.dto.CreateOrderRequest;
import com.campus.canteen.dto.OrderCancelRequest;
import com.campus.canteen.dto.OrderResponse;
import com.campus.canteen.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<OrderResponse>> createOrder(
            Authentication authentication,
            @Valid @RequestBody CreateOrderRequest request) {
        OrderResponse response = orderService.createOrder(request, authentication.getName());
        return new ResponseEntity<>(ApiResponse.success("Order placed successfully", response), HttpStatus.CREATED);
    }

    @GetMapping("/my")
    public ResponseEntity<ApiResponse<List<OrderResponse>>> getMyOrders(Authentication authentication) {
        List<OrderResponse> orders = orderService.getCustomerOrders(authentication.getName());
        return ResponseEntity.ok(ApiResponse.success(orders));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<OrderResponse>> getOrderById(
            Authentication authentication,
            @PathVariable Long id) {
        boolean isStaffOrAdmin = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .anyMatch(a -> a.equals("ROLE_STAFF") || a.equals("ROLE_ADMIN"));

        OrderResponse order = orderService.getOrderById(id, authentication.getName(), isStaffOrAdmin);
        return ResponseEntity.ok(ApiResponse.success(order));
    }

    @GetMapping("/number/{orderNumber}")
    public ResponseEntity<ApiResponse<OrderResponse>> getOrderByNumber(
            Authentication authentication,
            @PathVariable String orderNumber) {
        boolean isStaffOrAdmin = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .anyMatch(a -> a.equals("ROLE_STAFF") || a.equals("ROLE_ADMIN"));

        OrderResponse order = orderService.getOrderByNumber(orderNumber, authentication.getName(), isStaffOrAdmin);
        return ResponseEntity.ok(ApiResponse.success(order));
    }

    @PostMapping("/{id}/cancel")
    public ResponseEntity<ApiResponse<OrderResponse>> cancelOrder(
            Authentication authentication,
            @PathVariable Long id,
            @Valid @RequestBody(required = false) OrderCancelRequest request) {
        boolean isStaffOrAdmin = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .anyMatch(a -> a.equals("ROLE_STAFF") || a.equals("ROLE_ADMIN"));

        String reason = (request != null) ? request.getReason() : "Cancelled by customer";
        OrderResponse cancelled = orderService.cancelOrder(id, reason, authentication.getName(), isStaffOrAdmin);
        return ResponseEntity.ok(ApiResponse.success("Order cancelled successfully", cancelled));
    }
}
