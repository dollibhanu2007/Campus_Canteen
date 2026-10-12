# Campus Canteen Pre-Order System
### A Smart Way to Dine on Campus

[![Spring Boot 3](https://img.shields.io/badge/Spring%20Boot-3.3.4-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![React Vite](https://img.shields.io/badge/React%20Vite-18.3.1-blue.svg)](https://vitejs.dev/)
[![Java](https://img.shields.io/badge/Java-21%20LTS-orange.svg)](https://www.oracle.com/java/)
[![MySQL](https://img.shields.io/badge/MySQL-8.x-blue.svg)](https://www.mysql.com/)
[![License](https://img.shields.io/badge/License-Academic%20Capstone-lightgrey.svg)]()

A complete, full-stack web application designed for campus dining. It enables students and faculty to pre-order food ahead of class breaks, reserve pickup time slots, track preparation in real time, and pick up meals with zero queue waiting. Features dedicated operational stations for **Canteen Kitchen Staff** and comprehensive management & financial reporting for **Administrators**.

---

## 1. System Architecture & Order Lifecycle

```
[ Student / Staff Customer ] ──► Browse Menu ──► Add to Cart ──► Pick Time Slot ──► Place Pre-Order (PLACED)
                                                                                            │
[ Canteen Kitchen Staff ]    ◄── Counter Queue ◄── Real-Time Order Stream ◄────────────────┘
        │
        ├──► Mark Preparing (PREPARING) ──► Customer sees Live Cooking Timeline
        │
        ├──► Mark Ready (READY) ──────────► Customer receives Pickup Alert at Counter
        │
        └──► Confirm Handover (COLLECTED) ─► Meal Completed & Logged
```

### Order Status Lifecycle Rules:
1. `PLACED` → Created upon successful checkout with server-side price validation.
2. `PREPARING` → Kitchen cooks start preparation. Cancellations are strictly locked after this point.
3. `READY` → Counter notification with unique pickup token (e.g. `CC-261011-4821`).
4. `COLLECTED` → Handover confirmed by canteen counter staff.
5. `CANCELLED` → Permitted only when current status is `PLACED`.

---

## 2. Technology Stack

- **Frontend**:
  - React.js 18 with Vite
  - React Router DOM v6 (role-guarded routing)
  - Axios (JWT authorization bearer headers & error interceptors)
  - Context API (`AuthContext`, `CartContext`)
  - Vanilla CSS design tokens (Forest Green `#064e3b` / Amber `#d97706`, glassmorphism, responsive mobile drawer)
  - Lucide React icons
- **Backend**:
  - Java 21 LTS (`OpenJDK 21.0.10`)
  - Spring Boot 3.3.4
  - Spring Web (RESTful APIs)
  - Spring Data JPA & Hibernate
  - Spring Security with BCrypt password hashing & JJWT 0.12.5
  - Bean Validation
  - Maven 3.9.9 (Maven Wrapper included)
- **Database**:
  - MySQL 8.x (`campus_canteen_db`)
  - Normalized 8-table relational schema with foreign key constraints and audit indexes
  - In-memory H2 fallback database for lightning-fast automated test runs

---

## 3. User Roles & Seeded Credentials

| Role | Email | Password | Access & Features |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@campus.edu` | `Admin@123` | Full dashboard KPIs, net sales reports, user management, category CRUD, menu CRUD, slot scheduling, audit logs |
| **Canteen Staff** | `staff@campus.edu` | `Staff@123` | Kitchen queue board, status transitions (`Start Preparing`, `Mark Ready`, `Confirm Handover`), one-click stock availability toggle |
| **Customer** | `student@campus.edu` | `Student@123` | Menu browsing, cart, pickup slot booking, live 5s order status tracking, cancellation (if PLACED), order history, profile |

*Note*: Any student or staff member can also register a new personal account directly on the `/register` page.

---

## 4. Project Directory Structure

```
campus_canteen/
├── backend/
│   ├── mvnw.cmd & mvnw          # Cross-platform Maven 3.9.9 wrapper
│   ├── pom.xml                  # Spring Boot 3 dependencies & configuration
│   ├── .env.example             # Backend environment variable reference
│   ├── src/main/java/com/campus/canteen/
│   │   ├── config/              # SecurityConfig, CORS, DataInitializer
│   │   ├── controller/          # Auth, Menu, Slots, Orders, Staff, Admin REST APIs
│   │   ├── dto/                 # Request & Response data transfer objects
│   │   ├── entity/              # User, MenuItem, MenuCategory, Order, PickupSlot, etc.
│   │   ├── exception/           # GlobalExceptionHandler & custom exceptions
│   │   ├── repository/          # Spring Data JPA repositories with custom queries
│   │   ├── security/            # JWT TokenProvider, UserDetailsService, AuthFilter
│   │   └── service/             # Business services & order lifecycle validations
│   └── src/test/java/           # JUnit 5, SpringBootTest, and MockMvc test suite
│
├── frontend/
│   ├── package.json             # React, Vite, Axios, React Router dependencies
│   ├── vite.config.js           # Vite dev server with backend API proxy
│   ├── index.html               # Semantic HTML5 entrypoint with Google Fonts
│   └── src/
│       ├── api/client.js        # Axios instance with JWT interceptors
│       ├── components/          # Navbar, Footer, ProtectedRoute, StatusBadge, OrderTimeline, ConfirmModal
│       ├── context/             # AuthContext (RBAC) & CartContext (persistent cart)
│       ├── pages/               # Home, Menu, Login, Register, Cart, Checkout, Confirmation, Tracker, History, Staff & Admin portals
│       └── styles/index.css     # CSS design tokens & responsive utilities
│
├── database/
│   ├── schema.sql               # Complete MySQL 8.x DDL schema
│   └── sample-data.sql          # Seed data with categories, menu items, and slots
│
├── docs/
│   ├── API_DOCUMENTATION.md     # Complete REST API endpoint reference
│   ├── DATABASE_SETUP.md        # Database schema architecture & MySQL instructions
│   └── TESTING_GUIDE.md         # Automated test execution & 12 acceptance test checklist
│
└── README.md                    # Master documentation
```

---

## 5. Quick Start Guide

The backend supports two straightforward launch modes depending on whether your local MySQL 8 password has been supplied.

### Step 1: Start the Backend (Spring Boot 3.3.4)

Open a terminal in the `backend/` directory:
```powershell
cd backend
```

#### Option A: Running with Local MySQL 8 (Default)
Ensure the Windows MySQL service (`MySQL80`) is running. Supply your MySQL password using an environment variable or Maven CLI argument:

**Windows PowerShell**:
```powershell
# Method 1: Via Environment Variable (Recommended)
$env:DB_PASSWORD = "your_mysql_password"
.\mvnw.cmd spring-boot:run

# Method 2: Via Command-Line Flag
.\mvnw.cmd spring-boot:run "-Dspring-boot.run.arguments=--spring.datasource.password=your_mysql_password"
```

**Linux / macOS**:
```bash
DB_PASSWORD="your_mysql_password" ./mvnw spring-boot:run
```

> **PowerShell Note**: Always wrap `-D` arguments containing dots in quotes (e.g., `"-Dspring-boot.run.arguments=..."`) so PowerShell does not interpret the dots as member access operators.

#### Option B: Standalone Turnkey Mode (Zero-Config / No DB Password Required)
If you wish to test or run the application immediately without configuring MySQL user permissions, use the embedded file-backed standalone profile:

**Windows PowerShell**:
```powershell
.\mvnw.cmd spring-boot:run "-Dspring-boot.run.profiles=standalone"
```

**Linux / macOS**:
```bash
./mvnw spring-boot:run -Dspring-boot.run.profiles=standalone
```

*In both modes, the REST API listens on `http://localhost:8080`. The application automatically checks and seeds default administrative, staff, student accounts, categories, 13 canteen menu items, and 8 pickup time slots on first startup.*

---

### Step 2: Start the Frontend (React + Vite)

In a separate terminal window, navigate to the `frontend/` directory:
```bash
cd frontend
npm install
npm run dev
```

The application will start on **`http://localhost:5173`**.
All API requests (`/api/*`) are proxied automatically to the Spring Boot backend on port 8080.

---

### Step 3: Log In & Experience the System

Navigate to `http://localhost:5173/login`. You can click the **Demo Autofill Buttons** on the login card or enter:

- **Campus Administrator**: `admin@campus.edu` / `Admin@123`
- **Canteen Kitchen Staff**: `staff@campus.edu` / `Staff@123`
- **Student Customer**: `student@campus.edu` / `Student@123`
- Or register a new account on `/register`.


## 6. Automated Testing & Build Validation

### Running Backend Tests
```powershell
cd backend
.\mvnw.cmd test
```
**Results**:
- `CanteenApplicationTests`: PASSED
- `AuthControllerTest`: PASSED (Registration, Login, Invalid Credential rejection)
- `OrderServiceTest`: PASSED (Server-side line totals calculation, order placement, lifecycle transitions `PLACED` → `PREPARING` → `READY` → `COLLECTED`, cancellation restriction)
- `RoleSecurityTest`: PASSED (Customer blocked from `/api/admin/**` and `/api/staff/**` with 403 Forbidden)
- **Total Tests**: 9 | **Failures**: 0 | **Errors**: 0 | **BUILD SUCCESS**

### Running Frontend Production Build
```bash
cd frontend
npm run build
```
**Results**:
- Built cleanly in 2.1s with 1660 modules transformed and zero errors.

---

## 7. Key Features Implemented

1. **Authentication & RBAC**:
   - Secure BCrypt password hashing.
   - Stateless HMAC-SHA256 JWT tokens.
   - Distinct portals for Customer (`/customer`), Staff (`/staff`), and Admin (`/admin`).
2. **Menu & Dietary Filters**:
   - Dynamic search by food name or description.
   - Category filtering (Breakfast Specials, Lunch & Meals, Quick Bites, Beverages, Sandwiches).
   - Veg-only and In-stock-only toggles.
   - Live availability status badges.
3. **Cart & Server-Side Security**:
   - Quantity controls with client-side reactive totals and persistent local caching.
   - Server strictly recalculates prices from live database menu items; client prices are never trusted.
4. **Intelligent Pickup Time Slots**:
   - Time window scheduling with capacity tracking per date.
   - Automatic rejection of past time slots and overbooked slots.
5. **Real-Time Order Tracking**:
   - Visual 4-step progress bar (`Placed` → `Preparing` → `Ready` → `Collected`).
   - Auto-polling every 5 seconds.
   - Permitted cancellation only when order is in `PLACED` status.
6. **Canteen Staff Station**:
   - Interactive kitchen queue board with instant status updates.
   - One-click stock availability toggling between In Stock and Sold Out.
7. **Administrator Control & Analytics**:
   - Key KPIs: Total sales in ₹, total orders, completed meals, user statistics.
   - Date-range sales reporting excluding cancelled orders.
   - Full CRUD operations for Menu Items, Categories, and Pickup Slots.
   - User account activation/deactivation and role reassignments.
   - Administrative activity audit logs.
