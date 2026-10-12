package com.campus.canteen.config;

import com.campus.canteen.entity.*;
import com.campus.canteen.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalTime;
import java.util.Arrays;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private final UserRepository userRepository;
    private final MenuCategoryRepository categoryRepository;
    private final MenuItemRepository menuItemRepository;
    private final PickupSlotRepository slotRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository,
                           MenuCategoryRepository categoryRepository,
                           MenuItemRepository menuItemRepository,
                           PickupSlotRepository slotRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.categoryRepository = categoryRepository;
        this.menuItemRepository = menuItemRepository;
        this.slotRepository = slotRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(String... args) {
        seedUsers();
        seedCategoriesAndMenuItems();
        seedPickupSlots();
        log.info("Data initialization check completed successfully.");
    }

    private void seedUsers() {
        if (!userRepository.existsByEmail("admin@campus.edu")) {
            User admin = new User(
                    "Campus Administrator",
                    "admin@campus.edu",
                    passwordEncoder.encode("Admin@123"),
                    Role.ROLE_ADMIN,
                    "+91 9876543210"
            );
            userRepository.save(admin);
            log.info("Initialized default administrator: admin@campus.edu / Admin@123");
        }

        if (!userRepository.existsByEmail("staff@campus.edu")) {
            User staff = new User(
                    "Canteen Staff (Kitchen Counter)",
                    "staff@campus.edu",
                    passwordEncoder.encode("Staff@123"),
                    Role.ROLE_STAFF,
                    "+91 9876543211"
            );
            userRepository.save(staff);
            log.info("Initialized default canteen staff: staff@campus.edu / Staff@123");
        }

        if (!userRepository.existsByEmail("student@campus.edu")) {
            User student = new User(
                    "Aarav Sharma (Student)",
                    "student@campus.edu",
                    passwordEncoder.encode("Student@123"),
                    Role.ROLE_CUSTOMER,
                    "+91 9876543212"
            );
            userRepository.save(student);
            log.info("Initialized default student customer: student@campus.edu / Student@123");
        }
    }

    private void seedCategoriesAndMenuItems() {
        if (categoryRepository.count() == 0) {
            MenuCategory breakfast = categoryRepository.save(new MenuCategory("Breakfast Specials", "Authentic campus morning staples", 1));
            MenuCategory lunch = categoryRepository.save(new MenuCategory("Lunch & Meals", "Nutritious and fulfilling campus thalis & bowls", 2));
            MenuCategory snacks = categoryRepository.save(new MenuCategory("Quick Bites & Snacks", "Crispy hot evening snacks", 3));
            MenuCategory beverages = categoryRepository.save(new MenuCategory("Beverages & Juices", "Fresh brewed coffees, chai, and chilled juices", 4));
            MenuCategory fastFood = categoryRepository.save(new MenuCategory("Sandwiches & Fast Food", "Grilled sandwiches and continental treats", 5));

            List<MenuItem> items = Arrays.asList(
                    new MenuItem("Steamed Idli (2 Pcs)", "Fluffy steamed rice cakes served with coconut chutney and piping hot sambar.",
                            breakfast, new BigDecimal("35.00"), "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80", true, true, 5),
                    new MenuItem("Masala Dosa", "Golden crispy rice crepe stuffed with spiced potato masala, served with 2 chutneys.",
                            breakfast, new BigDecimal("55.00"), "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=600&q=80", true, true, 10),
                    new MenuItem("Medu Vada (2 Pcs)", "Crispy golden lentil fritters seasoned with peppercorns, curry leaves, and ginger.",
                            breakfast, new BigDecimal("40.00"), "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=600&q=80", true, true, 5),
                    new MenuItem("Veg Fried Rice", "Aromatic basmati rice wok-tossed with fresh crunchy vegetables, garlic, and scallions.",
                            lunch, new BigDecimal("75.00"), "https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=600&q=80", true, true, 12),
                    new MenuItem("South Indian Veg Meals", "Full campus thali with rice, sambar, rasam, kootu, poriyal, curd, papad, and pickle.",
                            lunch, new BigDecimal("85.00"), "https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&w=600&q=80", true, true, 8),
                    new MenuItem("Paneer Butter Masala Combo", "Soft cottage cheese cubes in rich buttery tomato gravy, served with 2 rotis or jeera rice.",
                            lunch, new BigDecimal("110.00"), "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=600&q=80", true, true, 15),
                    new MenuItem("Paneer Grilled Sandwich", "Toasted bread filled with spiced paneer, bell peppers, mint chutney, and melted cheese.",
                            fastFood, new BigDecimal("60.00"), "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=600&q=80", true, true, 8),
                    new MenuItem("Hot Samosa (2 Pcs)", "Flaky golden pastry cones packed with seasoned potatoes and green peas, served with sweet-tangy chutney.",
                            snacks, new BigDecimal("30.00"), "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80", true, true, 3),
                    new MenuItem("Veg Cutlet", "Crispy crumb-coated vegetable patties spiced with herbs and served with tomato sauce.",
                            snacks, new BigDecimal("25.00"), "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80", true, true, 5),
                    new MenuItem("Masala Chai", "Cardamom and ginger infused hot brewed campus milk tea.",
                            beverages, new BigDecimal("15.00"), "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80", true, true, 3),
                    new MenuItem("Filter Coffee", "Authentic South Indian chicory-blend decoction frothed with boiling milk.",
                            beverages, new BigDecimal("20.00"), "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80", true, true, 3),
                    new MenuItem("Fresh Lime Soda", "Refreshing soda mixed with freshly squeezed lime, crushed mint, and sweet-salt seasoning.",
                            beverages, new BigDecimal("30.00"), "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80", true, true, 4),
                    new MenuItem("Seasonal Mango / Watermelon Juice", "Pure freshly blended fruit juice without artificial preservatives.",
                            beverages, new BigDecimal("45.00"), "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?auto=format&fit=crop&w=600&q=80", true, true, 5)
            );

            menuItemRepository.saveAll(items);
            log.info("Initialized default categories and {} menu items.", items.size());
        }
    }

    private void seedPickupSlots() {
        if (slotRepository.count() == 0) {
            List<PickupSlot> slots = Arrays.asList(
                    new PickupSlot("Morning Break Slot 1 (08:30 - 09:00)", LocalTime.of(8, 30), LocalTime.of(9, 0), 40, true),
                    new PickupSlot("Morning Break Slot 2 (09:00 - 09:30)", LocalTime.of(9, 0), LocalTime.of(9, 30), 40, true),
                    new PickupSlot("Morning Break Slot 3 (10:15 - 10:45)", LocalTime.of(10, 15), LocalTime.of(10, 45), 50, true),
                    new PickupSlot("Lunch Rush Slot 1 (12:00 - 12:45)", LocalTime.of(12, 0), LocalTime.of(12, 45), 60, true),
                    new PickupSlot("Lunch Rush Slot 2 (12:45 - 13:30)", LocalTime.of(12, 45), LocalTime.of(13, 30), 60, true),
                    new PickupSlot("Lunch Rush Slot 3 (13:30 - 14:15)", LocalTime.of(13, 30), LocalTime.of(14, 15), 45, true),
                    new PickupSlot("Tea & Snacks Slot 1 (16:00 - 16:45)", LocalTime.of(16, 0), LocalTime.of(16, 45), 50, true),
                    new PickupSlot("Evening Slot 2 (17:00 - 17:45)", LocalTime.of(17, 0), LocalTime.of(17, 45), 40, true)
            );
            slotRepository.saveAll(slots);
            log.info("Initialized {} pickup time slots.", slots.size());
        }
    }
}
