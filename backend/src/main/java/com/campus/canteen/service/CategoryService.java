package com.campus.canteen.service;

import com.campus.canteen.dto.CategoryDto;
import com.campus.canteen.dto.CategoryRequest;
import com.campus.canteen.entity.MenuCategory;
import com.campus.canteen.entity.User;
import com.campus.canteen.exception.BadRequestException;
import com.campus.canteen.exception.ResourceNotFoundException;
import com.campus.canteen.repository.MenuCategoryRepository;
import com.campus.canteen.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CategoryService {

    private final MenuCategoryRepository categoryRepository;
    private final AdminService adminService;
    private final UserRepository userRepository;

    public CategoryService(MenuCategoryRepository categoryRepository,
                           AdminService adminService,
                           UserRepository userRepository) {
        this.categoryRepository = categoryRepository;
        this.adminService = adminService;
        this.userRepository = userRepository;
    }

    public List<CategoryDto> getAllCategories() {
        return categoryRepository.findAllByOrderByDisplayOrderAsc().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public CategoryDto getCategoryById(Long id) {
        MenuCategory cat = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + id));
        return mapToDto(cat);
    }

    @Transactional
    public CategoryDto createCategory(CategoryRequest request, String adminEmail) {
        if (categoryRepository.existsByNameIgnoreCase(request.getName().trim())) {
            throw new BadRequestException("Category with name '" + request.getName() + "' already exists");
        }

        MenuCategory cat = new MenuCategory();
        cat.setName(request.getName().trim());
        cat.setDescription(request.getDescription());
        cat.setDisplayOrder(request.getDisplayOrder() != null ? request.getDisplayOrder() : 0);

        MenuCategory saved = categoryRepository.save(cat);

        User admin = userRepository.findByEmail(adminEmail.toLowerCase()).orElse(null);
        adminService.logActivity(admin, "CREATE_CATEGORY", "MenuCategory", saved.getId().toString(), "Created category " + saved.getName());

        return mapToDto(saved);
    }

    @Transactional
    public CategoryDto updateCategory(Long id, CategoryRequest request, String adminEmail) {
        MenuCategory cat = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + id));

        cat.setName(request.getName().trim());
        cat.setDescription(request.getDescription());
        if (request.getDisplayOrder() != null) {
            cat.setDisplayOrder(request.getDisplayOrder());
        }

        MenuCategory saved = categoryRepository.save(cat);

        User admin = userRepository.findByEmail(adminEmail.toLowerCase()).orElse(null);
        adminService.logActivity(admin, "UPDATE_CATEGORY", "MenuCategory", saved.getId().toString(), "Updated category " + saved.getName());

        return mapToDto(saved);
    }

    @Transactional
    public void deleteCategory(Long id, String adminEmail) {
        MenuCategory cat = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + id));

        categoryRepository.delete(cat);

        User admin = userRepository.findByEmail(adminEmail.toLowerCase()).orElse(null);
        adminService.logActivity(admin, "DELETE_CATEGORY", "MenuCategory", id.toString(), "Deleted category " + cat.getName());
    }

    public CategoryDto mapToDto(MenuCategory cat) {
        return new CategoryDto(cat.getId(), cat.getName(), cat.getDescription(), cat.getDisplayOrder());
    }
}
