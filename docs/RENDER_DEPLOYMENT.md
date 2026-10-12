# Deploying Campus Canteen Pre-Order System on Render

This guide explains how to deploy the full-stack **Campus Canteen Pre-Order System** to [Render](https://render.com) for free with 1 click using the provided `render.yaml` Blueprint.

---

## Architecture on Render

Render provisions two connected services:
1. **`campus-canteen-backend`** (Web Service):
   - Multi-stage Docker container running **Java 21 LTS** and **Spring Boot 3.3.4**.
   - Defaults to the standalone turnkey profile with automated database seeding.
   - Listens on dynamic Render port `${PORT}`.
   - Exposes `/api/menu`, `/api/auth/**`, `/api/orders/**`, etc.
2. **`campus-canteen-frontend`** (Static Site):
   - Fast React + Vite bundle hosted globally on Render's CDN.
   - Configured with SPA rewrite rules (`/*` -> `/index.html`) so direct URL navigation works without 404 errors.
   - Automatically connected to the backend service via `VITE_API_BASE_URL`.

---

## 🚀 1-Click Blueprint Deployment (Recommended)

1. **Sign in to Render**:
   - Go to [https://dashboard.render.com](https://dashboard.render.com) and log in (e.g. with your GitHub account).

2. **Create New Blueprint**:
   - Click the **"New +"** button at the top right of the dashboard.
   - Select **"Blueprint"**.

3. **Connect Your Repository**:
   - Select your GitHub repository: **`dollibhanu2007/Campus_Canteen`**.
   - Render will detect the `render.yaml` file in the root of the repository.

4. **Review & Deploy**:
   - Render will display the two services (`campus-canteen-backend` and `campus-canteen-frontend`).
   - Click **"Apply"**.
   - Render will start building both services concurrently.

5. **Access Your Live Website**:
   - Once both builds complete (typically 2–3 minutes):
   - Your frontend URL will look like:  
     👉 `https://campus-canteen-frontend.onrender.com`
   - Open it in your mobile browser or computer!

---

## 🗄️ Optional: Connecting an External Cloud MySQL Database

By default, the backend runs in the standalone mode with automated data seeding on startup.

If you prefer connecting a dedicated cloud MySQL 8 database (such as free MySQL on [Aiven](https://aiven.io), [Clever Cloud](https://www.clever-cloud.com), or [TiDB Cloud](https://tidbcloud.com)):

1. Open your **`campus-canteen-backend`** service in the Render dashboard.
2. Go to the **Environment** tab.
3. Add or update these Environment Variables:
   - `SPRING_PROFILES_ACTIVE`: remove or set to `default`
   - `DB_URL`: `jdbc:mysql://<your_host>:<port>/<db_name>?createDatabaseIfNotExist=true&useSSL=true`
   - `DB_USERNAME`: `<your_db_username>`
   - `DB_PASSWORD`: `<your_db_password>`
4. Click **Save Changes**. Render will automatically redeploy and connect to your cloud MySQL instance!

---

## 🔑 Default Demo Logins on Render

Once deployed, you can use these accounts to log in on the live site:

| Role | Email | Password |
| :--- | :--- | :--- |
| **Student Customer** | `student@campus.edu` | `Student@123` |
| **Canteen Kitchen Staff** | `staff@campus.edu` | `Staff@123` |
| **Campus Administrator** | `admin@campus.edu` | `Admin@123` |
