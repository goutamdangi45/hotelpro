# 🏨 HotelPro - Enterprise Hotel Management System

[![MERN Stack](https://img.shields.io/badge/Stack-MERN-blue.svg)](https://reactjs.org/)
[![React 18](https://img.shields.io/badge/React-18.3-61dafb.svg)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-v18%2B-green.svg)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-4.19-lightgrey.svg)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-brightgreen.svg)](https://www.mongodb.com/)
[![Bootstrap 5](https://img.shields.io/badge/Bootstrap-5.3-purple.svg)](https://getbootstrap.com/)
[![JWT Auth](https://img.shields.io/badge/JWT-Secure%20RBAC-orange.svg)](https://jwt.io/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/goutamdangi45/hotelpro)

> **Your ultimate hotel management solution!** Our system streamlines hotel operations with a secure, scalable backend, ensuring efficient booking, guest management, and payment processing. With intuitive interfaces and robust authentication.
>
> In today’s fast-paced hospitality industry, managing hotel operations efficiently and securely is more crucial than ever. At **HotelPro**, we offer a reliable and intuitive hotel management system designed to meet the evolving needs of modern hospitality. Whether you're handling reservations, managing guest information, or processing payments, our platform ensures seamless operations with advanced security and scalability.

---

## 📌 Project Overview & Stats

- **Total Epics:** `6`
- **Total Tasks:** `19`
- **Total Subtasks:** `0`
- **Architecture:** Client-Server Monorepo (React 18 JSX + Vite + Express + MongoDB REST API)
- **Role-Based Access Control (RBAC):** `Guest`, `Staff`, `Admin`

---

## 📋 Comprehensive Epics & Tasks Breakdown

### 🔹 Epic 1: System Architecture, Environment & Authentication System
- **Task 1: Monorepo Project Architecture & Bootstrap Integration**
  - Configured full-stack repository structure with Express backend, React Vite client, and Bootstrap 5 responsive styling.
- **Task 2: Database Schemas & Data Layer**
  - Mongoose models with strict validation, indexes, and relations (`User`, `Room`, `Booking`, `Payment`, `Maintenance`).
- **Task 3: Secure JWT Authentication & Password Encryption**
  - Bcrypt password hashing (`salt rounds: 10`), stateless JSON Web Token issuance, and bearer verification middleware.
- **Task 4: Role-Based Access Control (RBAC) & Profile Management**
  - Tiered permissions for Guests, Front Desk Staff, and Administrators; profile update and password change APIs.

### 🔹 Epic 2: Room & Inventory Management
- **Task 5: Room Categories & Amenities Modeling**
  - Support for Deluxe, Executive Suites, Presidential Suites, and Family Cottages with custom amenity tags.
- **Task 6: Real-time Room Inventory CRUD Operations**
  - Admin/Staff capabilities to add, edit, retire rooms, adjust rates, and set inventory states (*Available, Occupied, Maintenance*).
- **Task 7: Dynamic Room Browsing & Search Engine**
  - Real-time filtering by category, price slider, guest capacity, keyword search, and sorting.

### 🔹 Epic 3: Booking & Reservation Engine
- **Task 8: Date Selection & Overlapping Availability Checker**
  - Prevents double bookings by validating date range overlaps against active reservations.
- **Task 9: End-to-End Booking Creation & Workflow Pipeline**
  - Automated calculation of nights, base pricing, 12% lodging tax, and concierge fee with instant confirmation.
- **Task 10: Reservation Cancellation & Policy Engine**
  - Self-service guest cancellation within allowable windows with automated refund logging and room release.

### 🔹 Epic 4: Guest Services & Operations Management
- **Task 11: Guest Directory & CRM**
  - Staff management of guest profiles, contact records, VIP statuses, and past stay histories.
- **Task 12: Front Desk Check-in & Check-out Operations**
  - 1-click arrival check-in, key card distribution toggle, and expedited check-out settlement.
- **Task 13: Housekeeping & Maintenance Workflow**
  - Live task boards (*Pending, In Progress, Completed*) for turn-down service, sanitization, and room repairs.

### 🔹 Epic 5: Billing, Payments & Invoicing System
- **Task 14: Payment Processing & Transaction Ledger**
  - Multi-method payment simulation (Credit Card, Debit Card, UPI / NetBanking, Cash on Arrival).
- **Task 15: Automated Digital Tax Invoice Generation**
  - Itemized printable receipts with company branding, tax breakdown, transaction ID, and booking reference.
- **Task 16: Refund Processing & Financial Auditing**
  - Secure reversal of payments upon cancellation with updated transaction records.

### 🔹 Epic 6: Analytics, Reporting & Administrative Dashboard
- **Task 17: Administrative Metrics & KPI Dashboard**
  - Real-time occupancy percentage, total gross revenue, active reservations, and today's arrivals/departures.
- **Task 18: Business Intelligence & Monthly Trend Reports**
  - 6-month revenue trajectories, room tier popularity analytics, and printable executive summaries.
- **Task 19: Comprehensive Documentation, Seeding & GitHub Readiness**
  - Automated database seeder (`npm run seed`), Postman API collection, Docker deployment, and production build readiness.

---

## 🛠 Skills & Technologies Required

| Area | Technology | Usage in HotelPro |
| :--- | :--- | :--- |
| **Language** | JavaScript (ES6+ / Modern Async) | End-to-end full-stack asynchronous logic, Promises, async/await |
| **Frontend UI** | React JSX + Vite | Dynamic SPA, Context API, stateful booking widgets |
| **Styling & CSS** | Bootstrap 5 + Custom CSS | Responsive layout, modern cards, luxury typography, print media |
| **Backend** | Node.js & Express.js | High-performance RESTful API, rate-limiting, security headers |
| **Database** | MongoDB & Mongoose | Document database, relational population, query aggregations |
| **Security** | JWT & Bcrypt.js | Cryptographic token authentication, role validation middleware |
| **Utilities** | Lucide React, Canvas-Confetti | Modern UI icons, celebratory booking confirmation animations |

---

## 💻 System & Hardware Requirements

### System Requirements
- **Operating System:** Windows 10/11, macOS, or Linux
- **Node.js:** v18.0.0 or higher
- **npm:** v8.0.0 or higher
- **MongoDB:** MongoDB Community Server (v6.0+) or MongoDB Atlas Cloud URI
- **Web Browser:** Google Chrome, Mozilla Firefox, or Microsoft Edge (latest version)

### Hardware Requirements
- **Processor:** Intel Core i5 (8th Gen+) / AMD Ryzen 5 or higher
- **RAM:** Minimum 8 GB (16 GB recommended)
- **Storage:** At least 1 GB free space
- **Display Resolution:** 1366 × 768 or higher

---

## 🚀 Quick Start Guide

### 1. Clone & Install Dependencies
```bash
# Clone the repository
git clone https://github.com/<your-username>/hotelpro.git
cd hotelpro

# Install all dependencies (Root, Server, and Client)
npm run install:all
```

### 2. Configure Environment Variables
Create a `.env` file inside the `server/` directory (or copy from `server/.env.example`):
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/hotelpro
JWT_SECRET=hotelpro_super_secret_jwt_key_2026_modern_secure_token
JWT_EXPIRE=30d
CLIENT_URL=http://localhost:3000
```
> *Note: If using MongoDB Atlas, replace `MONGO_URI` with your connection string: `mongodb+srv://<username>:<password>@cluster0.mongodb.net/hotelpro`*

### 3. Seed Sample Database
Populate rooms, test accounts, confirmed bookings, and housekeeping tasks:
```bash
npm run seed
```

### 4. Launch Development Servers
Run both backend API and React client concurrently:
```bash
npm run dev
```
- **Frontend Application:** [http://localhost:3000](http://localhost:3000)
- **Backend API Server:** [http://localhost:5000](http://localhost:5000)
- **API Health Check:** [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

## 🔑 Pre-Configured Demo Accounts (1-Click Login)

The login screen includes instant 1-click fill buttons for testing all roles:

| Role | Email Address | Password | Permissions |
| :--- | :--- | :--- | :--- |
| 👑 **Administrator** | `admin@hotelpro.com` | `password123` | Full access: Room CRUD, Reports, Operations, User directory |
| 🛎 **Front Desk Staff** | `staff@hotelpro.com` | `password123` | Front desk check-in/out, Key card issuance, Housekeeping schedule |
| 🧳 **Guest (Elena)** | `guest@hotelpro.com` | `password123` | Browse rooms, Book stays, View invoices, Cancel reservations |

---

## 📂 Project Structure

```
hotelpro/
├── package.json                 # Monorepo orchestration scripts
├── .gitignore                   # Git exclusion rules
├── LICENSE                      # MIT Open-Source License
├── README.md                    # Project documentation
├── postman_collection.json      # Postman API Collection
├── docker-compose.yml           # Multi-container Docker configuration
│
├── server/                      # Backend REST API
│   ├── package.json
│   ├── server.js                # Express app entry point
│   ├── seeder.js                # Database seeder script
│   ├── .env.example
│   ├── Dockerfile
│   ├── config/
│   │   └── db.js                # MongoDB connection handler
│   ├── data/
│   │   └── sampleData.js        # Seed dataset (Rooms, Users)
│   ├── middleware/
│   │   ├── auth.js              # JWT & RBAC middleware
│   │   └── errorHandler.js      # Global error handler
│   ├── models/
│   │   ├── User.js              # User schema with bcrypt
│   │   ├── Room.js              # Room inventory schema
│   │   ├── Booking.js           # Reservation schema
│   │   ├── Payment.js           # Billing & transaction schema
│   │   └── Maintenance.js       # Housekeeping schedule schema
│   ├── controllers/             # Business logic handlers
│   │   ├── authController.js
│   │   ├── roomController.js
│   │   ├── bookingController.js
│   │   ├── paymentController.js
│   │   ├── dashboardController.js
│   │   └── maintenanceController.js
│   └── routes/                  # Express API routes
│
└── client/                      # Frontend Application (React 18 + Vite)
    ├── package.json
    ├── vite.config.js
    ├── index.html
    └── src/
        ├── main.jsx             # React entry point
        ├── App.jsx              # App routes & provider wrapper
        ├── index.css            # Base design system & typography
        ├── App.css              # Custom styling & print CSS
        ├── api/
        │   └── axiosInstance.js # Interceptor for JWT tokens
        ├── context/
        │   └── AuthContext.jsx  # Authentication state & actions
        ├── components/
        │   ├── Navbar.jsx       # Luxury responsive navbar
        │   ├── Footer.jsx       # Hospitality footer
        │   ├── ProtectedRoute.jsx # Role-based route guard
        │   ├── RoomCard.jsx     # Room listing card
        │   ├── BookingModal.jsx # Reservation & checkout modal
        │   ├── InvoiceModal.jsx # Printable tax invoice modal
        │   └── StatCard.jsx     # Dashboard KPI widget
        └── pages/
            ├── Home.jsx         # Landing page with hero & search
            ├── Rooms.jsx        # Room inventory catalog & filters
            ├── RoomDetails.jsx  # Single room preview & booking
            ├── Login.jsx        # Authentication with 1-click accounts
            ├── Register.jsx     # Guest registration
            ├── Profile.jsx      # Guest account & ID proof
            ├── MyBookings.jsx   # Guest reservations dashboard
            ├── CheckoutSuccess.jsx # Confirmation & confetti
            └── admin/
                ├── AdminLayout.jsx    # Operations sidebar layout
                ├── AdminDashboard.jsx # Executive KPI dashboard
                ├── ManageRooms.jsx    # Room inventory CRUD
                ├── ManageBookings.jsx # Front desk check-in/out
                ├── ManageGuests.jsx   # Customer directory & CRM
                ├── Housekeeping.jsx   # Cleaning & maintenance tasks
                └── Reports.jsx        # Financial analytics & CSV export
```

---

## 📡 REST API Documentation

### Authentication & Users (`/api/auth`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register new guest account |
| `POST` | `/api/auth/login` | Public | Authenticate user & return JWT token |
| `GET` | `/api/auth/me` | Private | Retrieve current user profile |
| `PUT` | `/api/auth/profile` | Private | Update name, phone, address, ID proof |
| `PUT` | `/api/auth/change-password` | Private | Change account password |
| `GET` | `/api/auth/users` | Staff/Admin | View all registered guests and staff |

### Rooms & Inventory (`/api/rooms`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/rooms` | Public | Get all rooms with dynamic filters & availability |
| `GET` | `/api/rooms/featured` | Public | Get featured luxury rooms for landing page |
| `GET` | `/api/rooms/:id` | Public | Get single room details |
| `POST` | `/api/rooms` | Staff/Admin | Add new room to inventory |
| `PUT` | `/api/rooms/:id` | Staff/Admin | Update room details, price, or status |
| `DELETE`| `/api/rooms/:id` | Admin Only | Remove room from inventory |

### Bookings & Reservations (`/api/bookings`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/bookings` | Private | Create new reservation with payment settlement |
| `GET` | `/api/bookings/my-bookings`| Private | Retrieve logged-in guest's bookings |
| `GET` | `/api/bookings/:id` | Private | View booking & invoice details |
| `PUT` | `/api/bookings/:id/cancel` | Private | Cancel booking with automated refund |
| `GET` | `/api/bookings` | Staff/Admin | View all hotel reservations |
| `PUT` | `/api/bookings/:id/status` | Staff/Admin | Update status (Check-In, Check-Out, Key Card) |

### Dashboard & Analytics (`/api/dashboard`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/dashboard/stats` | Staff/Admin | Get occupancy rate, revenue, arrivals & departures |

### Housekeeping & Maintenance (`/api/maintenance`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/maintenance` | Staff/Admin | List housekeeping and repair tickets |
| `POST` | `/api/maintenance` | Staff/Admin | Schedule sanitation or maintenance task |
| `PUT` | `/api/maintenance/:id` | Staff/Admin | Update task status (Pending -> In Progress -> Completed) |
| `DELETE`| `/api/maintenance/:id` | Admin Only | Delete task ticket |

---

## 📤 Push Directly to GitHub

To push this codebase to your GitHub account:

```bash
# 1. Initialize git (if not already done)
git init

# 2. Add all project files
git add .

# 3. Create initial commit
git commit -m "feat: complete HotelPro hotel management system (6 Epics, 19 Tasks)"

# 4. Create repository on GitHub, then link it:
git remote add origin https://github.com/<your-username>/hotelpro.git

# 5. Push to main branch
git branch -M main
git push -u origin main
```

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.
