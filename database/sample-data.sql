-- =====================================================================
-- CAMPUS CANTEEN PRE-ORDER SYSTEM - SAMPLE DATA SEEDING
-- =====================================================================

USE campus_canteen_db;

-- 1. INSERT INITIAL USERS
-- Password for all seed users is: Password@123
-- BCrypt: $2a$10$w8fA3sSj8a/T3e5KkVxLyuH2H9f1y/n5WdM1oFzG8hHjKlNmOpQrS (or seeded dynamically by Spring DataSeeder)
INSERT INTO users (id, full_name, email, password_hash, role, phone, active) VALUES
(1, 'System Administrator', 'admin@campus.edu', '$2a$10$w8fA3sSj8a/T3e5KkVxLyuH2H9f1y/n5WdM1oFzG8hHjKlNmOpQrS', 'ROLE_ADMIN', '+91 9876543210', TRUE),
(2, 'Canteen Manager Ramesh', 'staff@campus.edu', '$2a$10$w8fA3sSj8a/T3e5KkVxLyuH2H9f1y/n5WdM1oFzG8hHjKlNmOpQrS', 'ROLE_STAFF', '+91 9876543211', TRUE),
(3, 'Aarav Sharma (Student)', 'student@campus.edu', '$2a$10$w8fA3sSj8a/T3e5KkVxLyuH2H9f1y/n5WdM1oFzG8hHjKlNmOpQrS', 'ROLE_CUSTOMER', '+91 9876543212', TRUE),
(4, 'Dr. Priya Nair (Faculty)', 'priya.faculty@campus.edu', '$2a$10$w8fA3sSj8a/T3e5KkVxLyuH2H9f1y/n5WdM1oFzG8hHjKlNmOpQrS', 'ROLE_CUSTOMER', '+91 9876543213', TRUE)
ON DUPLICATE KEY UPDATE full_name=VALUES(full_name);

-- 2. INSERT CATEGORIES
INSERT INTO menu_categories (id, name, description, display_order) VALUES
(1, 'Breakfast Specials', 'Traditional and quick morning breakfast favorites', 1),
(2, 'Lunch & Meals', 'Wholesome rice bowls, thalis, and afternoon combos', 2),
(3, 'Quick Bites & Snacks', 'Crispy evening snacks and light campus refreshments', 3),
(4, 'Beverages & Juices', 'Hot filter coffee, tea, and cold pressed fresh juices', 4),
(5, 'Sandwiches & Fast Food', 'Grilled sandwiches, wraps, and continental bites', 5)
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- 3. INSERT MENU ITEMS
INSERT INTO menu_items (id, name, description, category_id, price, image_url, available, is_veg, preparation_time_mins) VALUES
(1, 'Steamed Idli (2 Pcs)', 'Fluffy steamed rice cakes served with coconut chutney and piping hot sambar.', 1, 35.00, 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80', TRUE, TRUE, 5),
(2, 'Masala Dosa', 'Golden crispy rice crepe stuffed with spiced potato filling, served with 2 chutneys.', 1, 55.00, 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=600&q=80', TRUE, TRUE, 10),
(3, 'Medu Vada (2 Pcs)', 'Crispy golden lentil fritters seasoned with peppercorns, curry leaves, and ginger.', 1, 40.00, 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=600&q=80', TRUE, TRUE, 5),
(4, 'Veg Fried Rice', 'Aromatic basmati rice wok-tossed with fresh crunchy vegetables, garlic, and scallions.', 2, 75.00, 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=600&q=80', TRUE, TRUE, 12),
(5, 'South Indian Veg Meals', 'Full campus thali with rice, sambar, rasam, kootu, poriyal, curd, papad, and pickle.', 2, 85.00, 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&w=600&q=80', TRUE, TRUE, 8),
(6, 'Paneer Butter Masala Combo', 'Soft cottage cheese cubes in rich buttery tomato gravy, served with 2 rotis or jeera rice.', 2, 110.00, 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=600&q=80', TRUE, TRUE, 15),
(7, 'Paneer Grilled Sandwich', 'Toasted bread filled with spiced paneer, bell peppers, mint chutney, and melted cheese.', 5, 60.00, 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=600&q=80', TRUE, TRUE, 8),
(8, 'Hot Samosa (2 Pcs)', 'Flaky golden pastry cones packed with seasoned potatoes and green peas, served with sweet-tangy chutney.', 3, 30.00, 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80', TRUE, TRUE, 3),
(9, 'Veg Cutlet', 'Crispy crumb-coated vegetable patties spiced with herbs and served with tomato sauce.', 3, 25.00, 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80', TRUE, TRUE, 5),
(10, 'Masala Chai', 'Cardamom and ginger infused hot brewed campus milk tea.', 4, 15.00, 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80', TRUE, TRUE, 3),
(11, 'Filter Coffee', 'Authentic South Indian chicory-blend decoction frothed with boiling milk.', 4, 20.00, 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80', TRUE, TRUE, 3),
(12, 'Fresh Lime Soda', 'Refreshing soda mixed with freshly squeezed lime, crushed mint, and sweet-salt seasoning.', 4, 30.00, 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80', TRUE, TRUE, 4),
(13, 'Seasonal Mango / Watermelon Juice', 'Pure freshly blended fruit juice without artificial preservatives.', 4, 45.00, 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?auto=format&fit=crop&w=600&q=80', TRUE, TRUE, 5)
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- 4. INSERT PICKUP SLOTS
INSERT INTO pickup_slots (id, slot_label, start_time, end_time, capacity, active) VALUES
(1, 'Morning Break Slot 1 (08:30 - 09:00)', '08:30:00', '09:00:00', 40, TRUE),
(2, 'Morning Break Slot 2 (09:00 - 09:30)', '09:00:00', '09:30:00', 40, TRUE),
(3, 'Morning Break Slot 3 (10:15 - 10:45)', '10:15:00', '10:45:00', 50, TRUE),
(4, 'Lunch Rush Slot 1 (12:00 - 12:45)', '12:00:00', '12:45:00', 60, TRUE),
(5, 'Lunch Rush Slot 2 (12:45 - 13:30)', '12:45:00', '13:30:00', 60, TRUE),
(6, 'Lunch Rush Slot 3 (13:30 - 14:15)', '13:30:00', '14:15:00', 45, TRUE),
(7, 'Tea & Snacks Slot 1 (16:00 - 16:45)', '16:00:00', '16:45:00', 50, TRUE),
(8, 'Evening Slot 2 (17:00 - 17:45)', '17:00:00', '17:45:00', 40, TRUE)
ON DUPLICATE KEY UPDATE slot_label=VALUES(slot_label);
