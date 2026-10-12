package com.campus.canteen.controller;

import com.campus.canteen.dto.*;
import com.campus.canteen.entity.OrderStatus;
import com.campus.canteen.service.*;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasAuthority('ROLE_ADMIN')")
public class AdminController {

    private final AdminService adminService;
    private final MenuService menuService;
    private final CategoryService categoryService;
    private final PickupSlotService pickupSlotService;
    private final OrderService orderService;

    public AdminController(AdminService adminService,
                           MenuService menuService,
                           CategoryService categoryService,
                           PickupSlotService pickupSlotService,
                           OrderService orderService) {
        this.adminService = adminService;
        this.menuService = menuService;
        this.categoryService = categoryService;
        this.pickupSlotService = pickupSlotService;
        this.orderService = orderService;
    }

    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<AdminStatsDto>> getDashboardStats() {
        AdminStatsDto stats = adminService.getDashboardStats();
        return ResponseEntity.ok(ApiResponse.success(stats));
    }

    @GetMapping("/reports/sales")
    public ResponseEntity<ApiResponse<SalesReportDto>> getSalesReport(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        SalesReportDto report = adminService.getSalesReport(startDate, endDate);
        return ResponseEntity.ok(ApiResponse.success(report));
    }

    @GetMapping("/users")
    public ResponseEntity<ApiResponse<List<UserManagementDto>>> getAllUsers() {
        List<UserManagementDto> users = adminService.getAllUsers();
        return ResponseEntity.ok(ApiResponse.success(users));
    }

    @PatchMapping("/users/{id}/status")
    public ResponseEntity<ApiResponse<UserManagementDto>> updateUserStatus(
            Authentication authentication,
            @PathVariable Long id,
            @Valid @RequestBody UserStatusUpdateRequest request) {
        UserManagementDto updated = adminService.updateUserStatus(id, request.getActive(), authentication.getName());
        return ResponseEntity.ok(ApiResponse.success("User status updated", updated));
    }

    @PatchMapping("/users/{id}/role")
    public ResponseEntity<ApiResponse<UserManagementDto>> updateUserRole(
            Authentication authentication,
            @PathVariable Long id,
            @Valid @RequestBody UserRoleUpdateRequest request) {
        UserManagementDto updated = adminService.updateUserRole(id, request.getRole(), authentication.getName());
        return ResponseEntity.ok(ApiResponse.success("User role updated", updated));
    }

    // MENU CRUD
    @GetMapping("/menu")
    public ResponseEntity<ApiResponse<List<MenuItemDto>>> getAllMenuItems() {
        List<MenuItemDto> items = menuService.getMenuItems(null, null, null);
        return ResponseEntity.ok(ApiResponse.success(items));
    }

    @PostMapping("/menu")
    public ResponseEntity<ApiResponse<MenuItemDto>> createMenuItem(
            Authentication authentication,
            @Valid @RequestBody MenuItemRequest request) {
        MenuItemDto created = menuService.createMenuItem(request, authentication.getName());
        return new ResponseEntity<>(ApiResponse.success("Menu item created successfully", created), HttpStatus.CREATED);
    }

    @PutMapping("/menu/{id}")
    public ResponseEntity<ApiResponse<MenuItemDto>> updateMenuItem(
            Authentication authentication,
            @PathVariable Long id,
            @Valid @RequestBody MenuItemRequest request) {
        MenuItemDto updated = menuService.updateMenuItem(id, request, authentication.getName());
        return ResponseEntity.ok(ApiResponse.success("Menu item updated successfully", updated));
    }

    @DeleteMapping("/menu/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteMenuItem(
            Authentication authentication,
            @PathVariable Long id) {
        menuService.deleteMenuItem(id, authentication.getName());
        return ResponseEntity.ok(ApiResponse.success("Menu item deleted successfully", null));
    }

    // CATEGORY CRUD
    @PostMapping("/categories")
    public ResponseEntity<ApiResponse<CategoryDto>> createCategory(
            Authentication authentication,
            @Valid @RequestBody CategoryRequest request) {
        CategoryDto created = categoryService.createCategory(request, authentication.getName());
        return new ResponseEntity<>(ApiResponse.success("Category created successfully", created), HttpStatus.CREATED);
    }

    @PutMapping("/categories/{id}")
    public ResponseEntity<ApiResponse<CategoryDto>> updateCategory(
            Authentication authentication,
            @PathVariable Long id,
            @Valid @RequestBody CategoryRequest request) {
        CategoryDto updated = categoryService.updateCategory(id, request, authentication.getName());
        return ResponseEntity.ok(ApiResponse.success("Category updated successfully", updated));
    }

    @DeleteMapping("/categories/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteCategory(
            Authentication authentication,
            @PathVariable Long id) {
        categoryService.deleteCategory(id, authentication.getName());
        return ResponseEntity.ok(ApiResponse.success("Category deleted successfully", null));
    }

    // SLOTS CRUD
    @GetMapping("/slots")
    public ResponseEntity<ApiResponse<List<PickupSlotDto>>> getAllSlots() {
        List<PickupSlotDto> slots = pickupSlotService.getAllSlots();
        return ResponseEntity.ok(ApiResponse.success(slots));
    }

    @PostMapping("/slots")
    public ResponseEntity<ApiResponse<PickupSlotDto>> createSlot(
            Authentication authentication,
            @Valid @RequestBody PickupSlotRequest request) {
        PickupSlotDto created = pickupSlotService.createSlot(request, authentication.getName());
        return new ResponseEntity<>(ApiResponse.success("Pickup slot created successfully", created), HttpStatus.CREATED);
    }

    @PutMapping("/slots/{id}")
    public ResponseEntity<ApiResponse<PickupSlotDto>> updateSlot(
            Authentication authentication,
            @PathVariable Long id,
            @Valid @RequestBody PickupSlotRequest request) {
        PickupSlotDto updated = pickupSlotService.updateSlot(id, request, authentication.getName());
        return ResponseEntity.ok(ApiResponse.success("Pickup slot updated successfully", updated));
    }

    @DeleteMapping("/slots/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteSlot(
            Authentication authentication,
            @PathVariable Long id) {
        pickupSlotService.deleteSlot(id, authentication.getName());
        return ResponseEntity.ok(ApiResponse.success("Pickup slot deleted successfully", null));
    }

    // ALL ORDERS
    @GetMapping("/orders")
    public ResponseEntity<ApiResponse<Page<OrderResponse>>> getAllOrders(
            @RequestParam(required = false) OrderStatus status,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Page<OrderResponse> orders = orderService.getAllOrders(status, startDate, endDate, search, PageRequest.of(page, size));
        return ResponseEntity.ok(ApiResponse.success(orders));
    }

    @GetMapping("/activity-logs")
    public ResponseEntity<ApiResponse<List<ActivityLogDto>>> getActivityLogs() {
        List<ActivityLogDto> logs = adminService.getActivityLogs();
        return ResponseEntity.ok(ApiResponse.success(logs));
    }
}
