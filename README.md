# 🏪 Store Rating Platform

A production-quality **Store Rating Platform** web application built with React.js, Node.js, Express.js, and MySQL.

## 📖 Project Description

The Store Rating Platform is a full-stack web application that allows users to discover commercial stores and submit star ratings (1–5), while giving businesses and administrators dedicated tools to manage the platform.

The system supports **three distinct roles**, each with a purpose-built dashboard:

- **Normal Users** can browse all registered stores, search by name/address, view each store's community average rating, and submit or update their own personal rating for any store.
- **Store Owners** get a dedicated portal showing their store's overall rating and a full list of customers who have rated them, so they can track feedback in one place.
- **System Administrators** manage the platform end-to-end — viewing system-wide statistics (total users, stores, ratings), creating new users/admins, adding new stores, and browsing/searching/sorting all platform data.

The project was built to demonstrate a complete, real-world CRUD application with role-based access control (RBAC), secure authentication (JWT + bcrypt password hashing), input validation, and a modern responsive UI — covering the full stack from database design to a polished frontend.

> **What sets this apart:** most student CRUD projects stop at "it works." This one adds the details real production apps need — a `UNIQUE(user_id, store_id)` constraint so rating logic is enforced at the database level (not just in app code), rate-limiting + Helmet security headers on every API route, and a Postman collection that keeps real credentials out of version control by design.

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19, Vite, Tailwind CSS v4, React Router v7, Lucide Icons |
| **Backend** | Node.js, Express.js (ES Modules), REST APIs |
| **Database** | MySQL 8.0+ (via `mysql2/promise`) |
| **Authentication** | JWT (JSON Web Tokens) |
| **Security** | bcryptjs password hashing, Helmet security headers, CORS protection, express-rate-limit |
| **API Testing** | Postman (collection included in `/postman`) |

## 📁 Project Directory Structure

```
roxiler-system-task/
├── frontend/                     # React + Vite Frontend Application
│   ├── src/
│   │   ├── components/           # Reusable UI components (DataTable, StarRating, StatCard, Modals)
│   │   ├── context/               # AuthContext for authentication state
│   │   ├── layouts/               # AppLayout & AuthLayout
│   │   ├── pages/                  # Admin, Store Owner, User, and Auth pages
│   │   ├── services/               # Centralized API service layer (apiClient, authService, etc.)
│   │   └── validations/            # Form validation rules
│   ├── package.json
│   └── .env                       # Points to http://localhost:5000/api
├── backend/                      # Node.js + Express REST API Server
│   ├── database/
│   │   └── schema.sql             # MySQL DDL schema and seed dataset
│   ├── src/
│   │   ├── config/                 # MySQL pool & database connection tester
│   │   ├── controllers/            # Auth, Admin, Store, Rating, and Owner business logic
│   │   ├── middleware/              # JWT Auth, Input Validation, and Global Error Handler
│   │   ├── routes/                  # Express REST API endpoint definitions
│   │   └── scripts/                 # Automated database initializer script (initDb.js)
│   ├── package.json
│   ├── .env                       # Local MySQL database credentials
│   └── README.md
├── postman/                      # Postman collection + environment for API testing
│   ├── StoreRate-API.postman_collection.json
│   └── StoreRate-Environment.postman_environment.example.json
├── package.json                  # Root npm scripts for running both servers easily
└── README.md                     # Evaluator Guide & Setup Documentation
```

## 🗄️ Database Schema (MySQL)

The database (`storeLY`) has **3 core relational tables**, defined in `backend/database/schema.sql`:

### `users`
Stores all accounts — Normal Users, Store Owners, and Admins share this table, differentiated by a `role` column.

| Column | Type | Notes |
|---|---|---|
| `id` | INT, PK, AUTO_INCREMENT | |
| `name` | VARCHAR(60) | 20–60 characters |
| `email` | VARCHAR(255), UNIQUE | |
| `password` | VARCHAR(255) | bcrypt hash, never stored in plain text |
| `address` | VARCHAR(400) | |
| `role` | ENUM('ADMIN', 'STORE_OWNER', 'USER') | |
| `created_at` | TIMESTAMP | |

### `stores`
Each commercial store, optionally linked to a `STORE_OWNER` user.

| Column | Type | Notes |
|---|---|---|
| `id` | INT, PK, AUTO_INCREMENT | |
| `name` | VARCHAR(255) | |
| `email` | VARCHAR(255) | |
| `address` | VARCHAR(400) | |
| `owner_id` | INT, FK → `users.id` | Nullable |
| `created_at` | TIMESTAMP | |

### `ratings`
Every rating a user submits for a store.

| Column | Type | Notes |
|---|---|---|
| `id` | INT, PK, AUTO_INCREMENT | |
| `user_id` | INT, FK → `users.id` | |
| `store_id` | INT, FK → `stores.id` | |
| `rating` | TINYINT | 1 to 5 |
| `created_at` / `updated_at` | TIMESTAMP | |

**Key constraint:** a `UNIQUE KEY (user_id, store_id)` ensures **one rating per user per store** — submitting again updates the existing row instead of creating a duplicate.

Run `npm run db:init` (from `backend/`) to auto-create the database, tables, and seed data — no manual SQL needed.

## 🔑 Pre-Configured Test Login Credentials

Use any of these pre-seeded accounts to evaluate the role-based features:

| Role | Email | Password | Features Accessible |
|---|---|---|---|
| ADMIN | admin@system.com | Admin@12345 | System Stats, User Table (Search/Filter/Sort/Paginate), Add User/Admin, Store Table |
| STORE_OWNER | owner.tech@store.com | Owner@12345 | Tech Zone Store Overview, Average Rating, Customer Reviews Table |
| STORE_OWNER | owner.cafe@store.com | Owner@12345 | Artisan Coffee Store Overview, Customer Reviews Table |
| USER | john.doe@example.com | User@12345 | Commercial Stores Grid, Submit & Modify Ratings (1 to 5 Stars) |
| USER | jane.smith@example.com | User@12345 | Commercial Stores Grid, Submit & Modify Ratings (1 to 5 Stars) |
| USER | moresharayu345@gmail.com | Sharayu@345 | Commercial Stores Grid, Submit & Modify Ratings (1 to 5 Stars) |
| ADMIN | admin@storerate.com | Admin@1234 | System Stats, User Table, Add User/Admin, Store Table |
| STORE_OWNER | owner@storerate.com | Owner@1234 | Store Overview, Average Rating, Customer Reviews Table |

## 🛢️ How to Connect to Your Local MySQL Database

### Step 1: Configure MySQL Credentials

Open `backend/.env` and update the MySQL credentials to match your local setup:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration (MySQL)
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_local_mysql_password
DB_NAME=storeLY

# Security & JWT
JWT_SECRET=super_secret_jwt_key_roxiler_2026_change_in_production
JWT_EXPIRES_IN=24h

# CORS Configuration
CORS_ORIGIN=http://localhost:5173
```

> **Note for XAMPP / WAMP users:** if your local MySQL setup has no password, leave `DB_PASSWORD=` empty.

### Step 2: Initialize Database & Seed Data (1 command)

```bash
cd backend
npm run db:init
```

This script:
- Connects to your local MySQL server at `DB_HOST:DB_PORT`
- Creates the `storeLY` database if it doesn't exist
- Creates all 3 relational tables (`users`, `stores`, `ratings`) with foreign keys and constraints
- Seeds 10 commercial stores, 8 test accounts with valid bcrypt password hashes, and 10 sample ratings

## 🚀 How to Run the Application

### Option A: Using 2 Terminals (Recommended)

**Terminal 1 — Backend Express API:**
```bash
cd backend
npm run dev
```
Runs at `http://localhost:5000/api`

**Terminal 2 — React Frontend:**
```bash
cd frontend
npm run dev
```
Runs at `http://localhost:5173` (or `http://localhost:5176`)

### Option B: Using Root Convenience Commands

```bash
# Terminal 1: Backend
npm run dev:backend

# Terminal 2: Frontend
npm run dev:frontend

# Initialize Database
npm run db:init
```

## 📮 Postman Collection (API Testing)

A ready-to-use Postman collection is included in the `/postman` folder, covering every endpoint listed below (Auth, Admin, Stores & Ratings, Owner).

### Setup
1. Open Postman → **Import** → select `postman/StoreRate-API.postman_collection.json`
2. Import `postman/StoreRate-Environment.postman_environment.example.json` as well
3. Select the imported environment from the top-right dropdown
4. Run any **Login** request first (Admin / Store Owner / User) — the JWT token auto-saves to the `token` variable and is reused by every other request automatically

### What's included
- **Auth** — Login (Admin / Owner / User), Signup
- **Admin** — Dashboard stats, list/add users, list/add stores
- **Stores & Ratings** — List stores, submit/update rating
- **Owner** — Owner dashboard

> The collection uses environment variables (`{{baseUrl}}`, `{{token}}`, `{{adminEmail}}`, etc.) instead of hardcoded values, so credentials stay out of the collection file itself — only the environment file holds real values.

## ✨ Key Features & Business Rules

### 1. 👥 Role-Based System
- **ADMIN**: Access to system performance stats, user management (search, filter by role, sort, paginate, create Normal User or Admin accounts), and store management.
- **STORE_OWNER**: Access to a dedicated portal displaying metrics and customer reviews strictly for their assigned store.
- **USER**: Access to explore all commercial stores, view community rating vs personal rating, submit ratings (1 to 5 stars), and modify previously submitted ratings.

### 2. 🔒 Database Constraints & Rules
- **1 Rating Per User Per Store**: Enforced by a MySQL `UNIQUE KEY (user_id, store_id)` constraint. Submitting a new rating updates the existing rating record seamlessly.
- **Input Validation Rules:**
  - Name: 20 to 60 characters
  - Address: Maximum 400 characters
  - Password: 8 to 16 characters, containing at least 1 uppercase letter and 1 special character (`!@#$%^&*`)
  - Email: Valid email format

### 3. 🎨 Modern Responsive UI
- Glassmorphism headers, vibrant gradients, and dynamic card hover lift animations (`hover:-translate-y-2 hover:shadow-2xl`)
- Category-specific store icons (Laptop, Coffee, ShoppingBag, BookOpen, Dumbbell, Utensils)
- Fully responsive across Desktop, Laptop, Tablet, and Mobile screens

## 🌐 Complete REST API Endpoint Specification

### Authentication
- `POST /api/auth/login` — Authenticates user credentials & returns JWT token
- `POST /api/auth/register` — Registers a new normal user account
- `GET /api/auth/me` — Fetches current authenticated user profile (Bearer `<token>`)
- `PUT /api/auth/password` — Updates user password

### Admin (ADMIN Role Required)
- `GET /api/admin/dashboard/stats` — Total count metrics (Users, Stores, Ratings)
- `GET /api/admin/users` — Paginated user listing (search, role, page, limit, sortBy, sortOrder)
- `POST /api/admin/users` — Admin creates a Normal User or Admin account
- `GET /api/admin/stores` — Paginated stores listing with overall ratings and owner details
- `POST /api/admin/stores` — Admin creates a commercial store and optionally assigns a Store Owner

### Commercial Stores & Ratings (USER Role Required for rating)
- `GET /api/stores` — Returns all commercial stores with community rating & current user rating
- `GET /api/stores/:id` — Returns single store details
- `POST /api/stores/:storeId/ratings` — Submits a rating score (1 to 5)
- `PUT /api/stores/:storeId/ratings` — Updates an existing rating score (1 to 5)

### Store Owner (STORE_OWNER Role Required)
- `GET /api/owner/dashboard` — Returns store overview metrics and customer reviews list
