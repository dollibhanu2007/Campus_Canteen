# Database Architecture & Setup Guide

## Overview

The **Campus Canteen Pre-Order System** is powered by a normalized MySQL 8.x relational schema (`campus_canteen_db`).

---

## 1. Schema Tables & Relationships

```
 users (id)
   ▲
   │ (user_id)
 orders (id) ──────────────► order_items (order_id)
   │                             │
   ├──────────► pickup_slots (id) └──────► menu_items (id)
   │                                           │
   └──────────► order_status_history (order_id)  └──────► menu_categories (id)
```

1. **`users`**:
   - `id`, `full_name`, `email` (unique index), `password_hash` (BCrypt), `role`, `phone`, `active`, timestamps.
2. **`menu_categories`**:
   - `id`, `name` (unique), `description`, `display_order`, timestamps.
3. **`menu_items`**:
   - `id`, `name`, `description`, `category_id` (FK), `price` (DECIMAL(10,2)), `image_url`, `available`, `is_veg`, `preparation_time_mins`, timestamps.
4. **`pickup_slots`**:
   - `id`, `slot_label`, `start_time`, `end_time`, `capacity`, `active`, timestamps.
5. **`orders`**:
   - `id`, `order_number` (unique index), `user_id` (FK), `status` (ENUM / VARCHAR), `subtotal`, `tax_amount`, `total_amount`, `pickup_slot_id` (FK), `pickup_date`, `payment_method`, `special_instructions`, `cancellation_reason`, timestamps.
6. **`order_items`**:
   - `id`, `order_id` (FK), `menu_item_id` (FK), `item_name_snapshot`, `unit_price`, `quantity`, `line_total`.
   - *Note*: Historical order prices are preserved in `item_name_snapshot` and `unit_price` regardless of future menu price tweaks.
7. **`order_status_history`**:
   - `id`, `order_id` (FK), `previous_status`, `new_status`, `changed_by` (FK to users), `notes`, `changed_at`.
8. **`admin_activity_logs`**:
   - `id`, `actor_user_id` (FK to users), `action`, `entity_type`, `entity_id`, `details`, `created_at`.

---

## 2. Setting Up MySQL

### Option A: Automatic Spring Boot Bootstrapping (Recommended)
When you run the Spring Boot backend (`mvnw spring-boot:run`), Hibernate automatically creates/updates all tables via:
```properties
spring.jpa.hibernate.ddl-auto=update
```
And `DataInitializer.java` automatically seeds default admin, staff, student accounts, categories, items, and slots if the database is fresh.

### Option B: Manual Execution via MySQL CLI
If you prefer running the SQL scripts manually:
```bash
# 1. Login to MySQL
mysql -u root -p

# 2. Execute schema script
source /path/to/campus_canteen/database/schema.sql;

# 3. Execute sample seed data
source /path/to/campus_canteen/database/sample-data.sql;
```

---

## 3. Environment Configuration

You can override database settings via environment variables without touching source code:

| Variable | Default Value | Description |
| :--- | :--- | :--- |
| `DB_URL` | `jdbc:mysql://localhost:3306/campus_canteen_db?...` | JDBC Connection URL |
| `DB_USERNAME` | `root` | Database username |
| `DB_PASSWORD` | `root` | Database password |
| `JWT_SECRET` | `CampusCanteenPreOrderSystemSuperSecretKeyWith...` | 256-bit signing key |
| `JWT_EXPIRATION_MS` | `86400000` (24h) | Token lifespan in ms |
| `CORS_ALLOWED_ORIGINS` | `http://localhost:5173,http://localhost:3000` | Allowed frontend origins |
