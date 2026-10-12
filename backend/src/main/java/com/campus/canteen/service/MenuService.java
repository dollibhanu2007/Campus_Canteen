package com.campus.canteen.service;

import com.campus.canteen.dto.AvailabilityRequest;
import com.campus.canteen.dto.MenuItemDto;
import com.campus.canteen.dto.MenuItemRequest;
import com.campus.canteen.entity.MenuCategory;
import com.campus.canteen.entity.MenuItem;
import com.campus.canteen.entity.User;
import com.campus.canteen.exception.ResourceNotFoundException;
import com.campus.canteen.repository.MenuCategoryRepository;
import com.campus.canteen.repository.MenuItemRepository;
import com.campus.canteen.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class MenuService {

    private final MenuItemRepository menuItemRepository;
    private final MenuCategoryRepository categoryRepository;
    private final AdminService adminService;
    private final UserRepository userRepository;

    public MenuService(MenuItemRepository menuItemRepository,
                       MenuCategoryRepository categoryRepository,
                       AdminService adminService,
                       UserRepository userRepository) {
        this.menuItemRepository = menuItemRepository;
        this.categoryRepository = categoryRepository;
        this.adminService = adminService;
        this.userRepository = userRepository;
    }

    public List<MenuItemDto> getMenuItems(Long categoryId, Boolean available, String search) {
        String cleanSearch = (search != null && !search.trim().isEmpty()) ? search.trim() : null;
        return menuItemRepository.searchMenuItems(categoryId, available, cleanSearch).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public MenuItemDto getMenuItemById(Long id) {
        MenuItem item = menuItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Menu item not found with id: " + id));
        return mapToDto(item);
    }

    @Transactional
    public MenuItemDto createMenuItem(MenuItemRequest request, String adminEmail) {
        MenuCategory category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + request.getCategoryId()));

        MenuItem item = new MenuItem();
        item.setName(request.getName().trim());
        item.setDescription(request.getDescription());
        item.setCategory(category);
        item.setPrice(request.getPrice());
        item.setImageUrl(request.getImageUrl());
        item.setAvailable(request.getAvailable() != null ? request.getAvailable() : true);
        item.setVeg(request.getIsVeg() != null ? request.getIsVeg() : true);
        item.setPreparationTimeMins(request.getPreparationTimeMins() != null ? request.getPreparationTimeMins() : 10);

        MenuItem saved = menuItemRepository.save(item);

        User admin = userRepository.findByEmail(adminEmail.toLowerCase()).orElse(null);
        adminService.logActivity(admin, "CREATE_MENU_ITEM", "MenuItem", saved.getId().toString(), "Added menu item " + saved.getName());

        return mapToDto(saved);
    }

    @Transactional
    public MenuItemDto updateMenuItem(Long id, MenuItemRequest request, String adminEmail) {
        MenuItem item = menuItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Menu item not found with id: " + id));

        MenuCategory category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + request.getCategoryId()));

        item.setName(request.getName().trim());
        item.setDescription(request.getDescription());
        item.setCategory(category);
        item.setPrice(request.getPrice());
        if (request.getImageUrl() != null) {
            item.setImageUrl(request.getImageUrl());
        }
        if (request.getAvailable() != null) {
            item.setAvailable(request.getAvailable());
        }
        if (request.getIsVeg() != null) {
            item.setVeg(request.getIsVeg());
        }
        if (request.getPreparationTimeMins() != null) {
            item.setPreparationTimeMins(request.getPreparationTimeMins());
        }

        MenuItem saved = menuItemRepository.save(item);

        User admin = userRepository.findByEmail(adminEmail.toLowerCase()).orElse(null);
        adminService.logActivity(admin, "UPDATE_MENU_ITEM", "MenuItem", saved.getId().toString(), "Updated menu item " + saved.getName());

        return mapToDto(saved);
    }

    @Transactional
    public MenuItemDto updateAvailability(Long id, boolean available, String staffEmail) {
        MenuItem item = menuItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Menu item not found with id: " + id));

        item.setAvailable(available);
        MenuItem saved = menuItemRepository.save(item);

        User user = userRepository.findByEmail(staffEmail.toLowerCase()).orElse(null);
        adminService.logActivity(user, "UPDATE_AVAILABILITY", "MenuItem", saved.getId().toString(),
                "Changed availability of " + saved.getName() + " to " + (available ? "AVAILABLE" : "UNAVAILABLE"));

        return mapToDto(saved);
    }

    @Transactional
    public void deleteMenuItem(Long id, String adminEmail) {
        MenuItem item = menuItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Menu item not found with id: " + id));

        menuItemRepository.delete(item);

        User admin = userRepository.findByEmail(adminEmail.toLowerCase()).orElse(null);
        adminService.logActivity(admin, "DELETE_MENU_ITEM", "MenuItem", id.toString(), "Deleted menu item " + item.getName());
    }

    public MenuItemDto mapToDto(MenuItem item) {
        return new MenuItemDto(
                item.getId(),
                item.getName(),
                item.getDescription(),
                item.getCategory().getId(),
                item.getCategory().getName(),
                item.getPrice(),
                item.getImageUrl(),
                item.isAvailable(),
                item.isVeg(),
                item.getPreparationTimeMins()
        );
    }
}
