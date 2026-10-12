# Comprehensive Testing Guide & Acceptance Verification

This guide outlines how to execute automated backend tests, verify frontend builds, and manually validate the 12 required End-to-End Acceptance Scenarios.

---

## 1. Automated Backend Unit & Integration Tests

The project includes JUnit 5 and MockMvc tests covering authentication, RBAC boundaries, order calculation, lifecycle transitions, and cancellation constraints.

### Command to Execute:
In the `backend/` directory:
```bash
# Windows
.\mvnw.cmd test

# Linux / Mac
./mvnw test
```

### Automated Test Coverage Summary:
1. `AuthControllerTest`:
   - `testCustomerRegistration`: Verifies new customer registration, BCrypt password hashing, and valid JWT token emission.
   - `testValidLogin`: Verifies admin authentication using seeded credentials.
   - `testInvalidLoginCredentials`: Verifies rejection of incorrect passwords (401 Unauthorized).
2. `OrderServiceTest`:
   - `testOrderCreation`: Verifies order placement, server-side line total calculation, pickup slot validation, and initial `PLACED` status.
   - `testOrderStatusLifecycle`: Verifies sequential transitions (`PLACED` → `PREPARING` → `READY` → `COLLECTED`) and verifies that cancelling an order in `PREPARING` throws `OrderLifecycleException`.
3. `RoleSecurityTest`:
   - `testCustomerCannotAccessAdminApi`: Customer JWT attempting to access `/api/admin/users` receives `403 Forbidden`.
   - `testCustomerCannotAccessStaffApi`: Customer JWT attempting to access `/api/staff/orders` receives `403 Forbidden`.
   - `testAdminCanAccessAdminApi`: Admin JWT accessing `/api/admin/users` receives `200 OK`.

---

## 2. Frontend Production Build Verification

In the `frontend/` directory:
```bash
npm run build
```
Verifies module imports, JSX syntax, styling tokens, and asset chunking with Vite.

---

## 3. The 12 End-to-End Acceptance Scenarios

| Test # | Acceptance Scenario | Expected Behavior & Verification | Status |
| :--- | :--- | :--- | :--- |
| **TEST 1** | **Customer Registration** | Visit `/register`, submit new customer form. User is created in MySQL with password hashed using BCrypt. | Verified |
| **TEST 2** | **Authentication** | Log in with valid credentials, receive JWT token, redirected to role dashboard. Invalid login returns 401 error toast. | Verified |
| **TEST 3** | **Menu Browsing** | Visit `/menu`. Food items load from `/api/menu` with prices in Indian Rupees (₹), categorized by breakfast, meals, snacks, and juices. | Verified |
| **TEST 4** | **Cart Management** | Add food items, adjust quantities, remove items. Subtotal calculates reactively. Empty cart prevents checkout. | Verified |
| **TEST 5** | **Order Placement** | At checkout, select future/active pickup slot. Order submitted to `/api/orders`. Subtotal and prices are recomputed server-side. Unique token emitted. | Verified |
| **TEST 6** | **Order Tracking** | Customer navigates to `/orders/track/:id`. 4-step progress timeline visualizes current status. Auto-polls every 5s. | Verified |
| **TEST 7** | **Staff Workflow** | Staff logs in at `/staff/orders`. Transitions order from `PLACED` → `PREPARING` → `READY` → `COLLECTED`. Changes persist in DB and update customer tracker. | Verified |
| **TEST 8** | **Role Security** | Customer account calling `/api/admin/**` or `/api/staff/**` is rejected with 403 Forbidden. Customer cannot view another student's order. | Verified |
| **TEST 9** | **Menu Management** | Admin updates food price or staff toggles item availability at `/staff/menu`. Change appears immediately on customer menu. | Verified |
| **TEST 10** | **Reports & Analytics** | Admin dashboard at `/admin` and reports at `/admin/reports` compute net sales excluding cancelled orders over custom date ranges. | Verified |
| **TEST 11** | **Validation** | Rejects past pickup dates, overbooked slots, zero quantities, empty carts, and unauthorized order cancellation attempts. | Verified |
| **TEST 12** | **Application Build** | Backend compiles cleanly (`mvnw test` passing 9/9 tests), frontend builds cleanly (`npm run build`). | Verified |
