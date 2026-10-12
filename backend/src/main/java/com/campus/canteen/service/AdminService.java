package com.campus.canteen.service;

import com.campus.canteen.dto.*;
import com.campus.canteen.entity.*;
import com.campus.canteen.exception.BadRequestException;
import com.campus.canteen.exception.ResourceNotFoundException;
import com.campus.canteen.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdminService {

    private final UserRepository userRepository;
    private final OrderRepository orderRepository;
    private final MenuItemRepository menuItemRepository;
    private final AdminActivityLogRepository activityLogRepository;

    public AdminService(UserRepository userRepository,
                        OrderRepository orderRepository,
                        MenuItemRepository menuItemRepository,
                        AdminActivityLogRepository activityLogRepository) {
        this.userRepository = userRepository;
        this.orderRepository = orderRepository;
        this.menuItemRepository = menuItemRepository;
        this.activityLogRepository = activityLogRepository;
    }

    public AdminStatsDto getDashboardStats() {
        AdminStatsDto stats = new AdminStatsDto();
        stats.setTotalUsers(userRepository.countTotalUsers());
        stats.setTotalCustomers(userRepository.countByRole(Role.ROLE_CUSTOMER));
        stats.setTotalStaff(userRepository.countByRole(Role.ROLE_STAFF));
        stats.setActiveMenuItems(menuItemRepository.countByAvailableTrue());

        stats.setTotalOrders(orderRepository.count());
        stats.setPendingOrders(orderRepository.countByStatus(OrderStatus.PLACED));
        stats.setPreparingOrders(orderRepository.countByStatus(OrderStatus.PREPARING));
        stats.setReadyOrders(orderRepository.countByStatus(OrderStatus.READY));
        stats.setCompletedOrders(orderRepository.countByStatus(OrderStatus.COLLECTED));
        stats.setCancelledOrders(orderRepository.countByStatus(OrderStatus.CANCELLED));

        stats.setTotalSales(orderRepository.sumTotalSalesExcludingCancelled());
        return stats;
    }

    public SalesReportDto getSalesReport(LocalDate startDate, LocalDate endDate) {
        LocalDate start = (startDate != null) ? startDate : LocalDate.now().minusDays(30);
        LocalDate end = (endDate != null) ? endDate : LocalDate.now();

        List<Object[]> rawDaily = orderRepository.findDailySalesSummary(start, end);
        List<DailySalesDto> dailyBreakdown = new ArrayList<>();
        long totalOrders = 0;
        BigDecimal totalRevenue = BigDecimal.ZERO;

        for (Object[] row : rawDaily) {
            LocalDate date = (LocalDate) row[0];
            long count = ((Number) row[1]).longValue();
            BigDecimal sales = (BigDecimal) row[2];

            totalOrders += count;
            totalRevenue = totalRevenue.add(sales);
            dailyBreakdown.add(new DailySalesDto(date, count, sales));
        }

        return new SalesReportDto(start, end, totalOrders, totalRevenue, dailyBreakdown);
    }

    public List<UserManagementDto> getAllUsers() {
        return userRepository.findAll().stream()
                .map(u -> new UserManagementDto(
                        u.getId(), u.getFullName(), u.getEmail(),
                        u.getRole(), u.getPhone(), u.isActive(), u.getCreatedAt()))
                .collect(Collectors.toList());
    }

    @Transactional
    public UserManagementDto updateUserStatus(Long userId, boolean active, String adminEmail) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        user.setActive(active);
        User saved = userRepository.save(user);

        User admin = userRepository.findByEmail(adminEmail.toLowerCase()).orElse(null);
        logActivity(admin, "UPDATE_USER_STATUS", "User", userId.toString(),
                "Set user " + user.getEmail() + " active status to " + active);

        return new UserManagementDto(saved.getId(), saved.getFullName(), saved.getEmail(),
                saved.getRole(), saved.getPhone(), saved.isActive(), saved.getCreatedAt());
    }

    @Transactional
    public UserManagementDto updateUserRole(Long userId, Role role, String adminEmail) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        user.setRole(role);
        User saved = userRepository.save(user);

        User admin = userRepository.findByEmail(adminEmail.toLowerCase()).orElse(null);
        logActivity(admin, "UPDATE_USER_ROLE", "User", userId.toString(),
                "Changed user " + user.getEmail() + " role to " + role);

        return new UserManagementDto(saved.getId(), saved.getFullName(), saved.getEmail(),
                saved.getRole(), saved.getPhone(), saved.isActive(), saved.getCreatedAt());
    }

    public List<ActivityLogDto> getActivityLogs() {
        return activityLogRepository.findTop50ByOrderByCreatedAtDesc().stream()
                .map(log -> new ActivityLogDto(
                        log.getId(),
                        log.getActor() != null ? log.getActor().getId() : null,
                        log.getActor() != null ? log.getActor().getFullName() : "System",
                        log.getActor() != null ? log.getActor().getEmail() : "system@campus.edu",
                        log.getAction(),
                        log.getEntityType(),
                        log.getEntityId(),
                        log.getDetails(),
                        log.getCreatedAt()
                ))
                .collect(Collectors.toList());
    }

    @Transactional
    public void logActivity(User actor, String action, String entityType, String entityId, String details) {
        AdminActivityLog log = new AdminActivityLog(actor, action, entityType, entityId, details);
        activityLogRepository.save(log);
    }
}
