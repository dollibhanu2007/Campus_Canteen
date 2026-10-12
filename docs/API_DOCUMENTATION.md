# Campus Canteen Pre-Order System — REST API Documentation

This document describes all RESTful API endpoints implemented in the Spring Boot backend (`http://localhost:8080/api`).

---

## 1. Authentication & Profile (`/api/auth`)

### 1.1 Customer Registration
- **Endpoint**: `POST /api/auth/register`
- **Access**: Public
- **Request Body**:
  ```json
  {
    "fullName": "Rahul Verma",
    "email": "rahul.v@campus.edu",
    "password": "Password@123",
    "phone": "+91 9876543210"
  }
  ```
- **Success Response (201 Created)**:
  ```json
  {
    "success": true,
    "message": "Account registered successfully",
    "data": {
      "token": "eyJhbGciOiJIUzI1NiIsIn...",
      "type": "Bearer",
      "id": 5,
      "fullName": "Rahul Verma",
      "email": "rahul.v@campus.edu",
      "role": "ROLE_CUSTOMER",
      "phone": "+91 9876543210"
    }
  }
  ```

### 1.2 User Login
- **Endpoint**: `POST /api/auth/login`
- **Access**: Public
- **Request Body**:
  ```json
  {
    "email": "student@campus.edu",
    "password": "Student@123"
  }
  ```
- **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Login successful",
    "data": {
      "token": "eyJhbGciOiJIUzI1NiIsIn...",
      "type": "Bearer",
      "id": 3,
      "fullName": "Aarav Sharma (Student)",
      "email": "student@campus.edu",
      "role": "ROLE_CUSTOMER",
      "phone": "+91 9876543212"
    }
  }
  ```

### 1.3 Get Current User Profile
- **Endpoint**: `GET /api/auth/me`
- **Headers**: `Authorization: Bearer <token>`
- **Access**: Authenticated

### 1.4 Update Personal Profile
- **Endpoint**: `PUT /api/auth/profile`
- **Headers**: `Authorization: Bearer <token>`
- **Access**: Authenticated
- **Request Body**:
  ```json
  {
    "fullName": "Aarav S.",
    "phone": "+91 9876543299"
  }
  ```

---

## 2. Food Menu & Categories (`/api`)

### 2.1 Get All Menu Items
- **Endpoint**: `GET /api/menu`
- **Query Parameters**:
  - `categoryId` (optional, Long): filter by category
  - `available` (optional, Boolean): filter by stock availability
  - `search` (optional, String): search by food name or description
- **Access**: Public

### 2.2 Get Menu Item Details
- **Endpoint**: `GET /api/menu/{id}`
- **Access**: Public

### 2.3 Get Menu Categories
- **Endpoint**: `GET /api/categories`
- **Access**: Public

---

## 3. Pickup Time Slots (`/api/slots`)

### 3.1 Get Available Pickup Slots
- **Endpoint**: `GET /api/slots`
- **Query Parameters**:
  - `date` (optional, ISO date e.g. `2026-10-12`): defaults to today. Computes current capacity bookings and checks whether slot time has already passed.
- **Access**: Public

---

## 4. Customer Orders (`/api/orders`)

### 4.1 Place a Pre-Order
- **Endpoint**: `POST /api/orders`
- **Headers**: `Authorization: Bearer <token>`
- **Access**: Authenticated Customer / Admin
- **Request Body**:
  ```json
  {
    "pickupDate": "2026-10-12",
    "pickupSlotId": 4,
    "paymentMethod": "CAMPUS_COUNTER_PAY",
    "specialInstructions": "Extra coconut chutney please",
    "items": [
      {
        "menuItemId": 1,
        "quantity": 2
      },
      {
        "menuItemId": 10,
        "quantity": 1
      }
    ]
  }
  ```
- **Success Response (201 Created)**:
  Returns calculated order with unique `orderNumber` (e.g. `CC-261012-7482`), item price snapshots, subtotal, and initial status `PLACED`.

### 4.2 Get My Orders
- **Endpoint**: `GET /api/orders/my`
- **Headers**: `Authorization: Bearer <token>`
- **Access**: Authenticated Customer (returns only user's own orders)

### 4.3 Track / View Order by ID
- **Endpoint**: `GET /api/orders/{id}`
- **Headers**: `Authorization: Bearer <token>`
- **Access**: Customer (only if owner), Staff, Admin

### 4.4 Track / View Order by Token Number
- **Endpoint**: `GET /api/orders/number/{orderNumber}`
- **Headers**: `Authorization: Bearer <token>`
- **Access**: Customer (only if owner), Staff, Admin

### 4.5 Cancel Order
- **Endpoint**: `POST /api/orders/{id}/cancel`
- **Headers**: `Authorization: Bearer <token>`
- **Access**: Customer (only if owner & status is `PLACED`), Staff, Admin
- **Request Body**:
  ```json
  {
    "reason": "Lecture got rescheduled"
  }
  ```

---

## 5. Canteen Kitchen Staff (`/api/staff`)

Requires `ROLE_STAFF` or `ROLE_ADMIN`.

### 5.1 View Operational Orders Queue
- **Endpoint**: `GET /api/staff/orders`
- **Query Parameters**:
  - `status` (optional): `PLACED`, `PREPARING`, `READY`

### 5.2 Transition Order Status
- **Endpoint**: `PATCH /api/staff/orders/{id}/status`
- **Request Body**:
  ```json
  {
    "status": "PREPARING",
    "notes": "Chef started cooking"
  }
  ```
- **Permitted Transitions**:
  - `PLACED` → `PREPARING`
  - `PREPARING` → `READY`
  - `READY` → `COLLECTED`
  - `PLACED` → `CANCELLED`

### 5.3 Quick Toggle Food Availability
- **Endpoint**: `PATCH /api/staff/menu/{id}/availability`
- **Request Body**:
  ```json
  {
    "available": false
  }
  ```

---

## 6. Administration (`/api/admin`)

Requires `ROLE_ADMIN`.

### 6.1 Dashboard KPI Metrics
- **Endpoint**: `GET /api/admin/dashboard`
- **Returns**: Total users, total orders, sales totals excluding cancelled orders, pending/preparing/ready/completed order counts.

### 6.2 Sales & Financial Reports
- **Endpoint**: `GET /api/admin/reports/sales?startDate=2026-09-01&endDate=2026-10-12`
- **Returns**: Total orders, total revenue, daily sales breakdown array.

### 6.3 User Management
- `GET /api/admin/users`: List all registered accounts
- `PATCH /api/admin/users/{id}/status`: Activate or deactivate account
- `PATCH /api/admin/users/{id}/role`: Reassign role (`ROLE_CUSTOMER`, `ROLE_STAFF`, `ROLE_ADMIN`)

### 6.4 Menu Items CRUD
- `GET /api/admin/menu`: List all menu items
- `POST /api/admin/menu`: Create new food item
- `PUT /api/admin/menu/{id}`: Update food item
- `DELETE /api/admin/menu/{id}`: Delete food item

### 6.5 Categories CRUD
- `POST /api/admin/categories`: Create category
- `PUT /api/admin/categories/{id}`: Update category
- `DELETE /api/admin/categories/{id}`: Delete category

### 6.6 Pickup Slots CRUD
- `GET /api/admin/slots`: List all slots
- `POST /api/admin/slots`: Create slot
- `PUT /api/admin/slots/{id}`: Update slot
- `DELETE /api/admin/slots/{id}`: Delete slot

### 6.7 All Orders Audit
- `GET /api/admin/orders`: Filterable with pagination, date range, status, and order number query.

### 6.8 Administrative Activity Audit Log
- `GET /api/admin/activity-logs`: Returns chronological audit records of management actions.
