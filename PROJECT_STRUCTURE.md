# Hotel Management System - Complete Code Structure

## 📁 Root Directory
```
Dyanamic website/
├── backend/                          # Node.js/Express Backend
├── frontend-react/                   # React 18 Frontend
├── .git/                            # Git repository
├── .venv/                           # Python virtual environment
├── .env                             # Environment variables (local)
├── .gitignore                       # Git ignore file
├── README.md                        # Project documentation
└── PROJECT_STRUCTURE.md             # This file
```

## 🔧 BACKEND STRUCTURE
```
backend/
├── server.js                        # Main Express server (347 lines)
│   ├── CORS Configuration
│   ├── MongoDB Connection
│   ├── User Model & Schema
│   ├── Booking Model & Schema
│   ├── Authentication Routes
│   │   ├── POST /api/auth/register
│   │   └── POST /api/auth/login
│   ├── Booking Routes
│   │   ├── POST /api/book-room
│   │   ├── GET /api/bookings
│   │   ├── GET /api/bookings/:id
│   │   ├── PUT /api/bookings/:id
│   │   └── DELETE /api/bookings/:id
│   ├── Health Check
│   │   └── GET /api/health
│   └── Error Handling & Graceful Shutdown
├── .env                             # Environment Configuration
│   ├── PORT=5000
│   ├── NODE_ENV=production
│   ├── MONGODB_URI=mongodb+srv://...
│   ├── JWT_SECRET=...
│   ├── CORS_ORIGIN=...
│   └── LOG_LEVEL=info
├── .env.example                     # Template for environment variables
├── package.json                     # Dependencies & scripts
│   └── Dependencies:
│       ├── express@4.18.2
│       ├── mongoose@8.0.0
│       ├── cors@2.8.5
│       ├── bcryptjs@2.4.3
│       ├── jsonwebtoken@9.1.2
│       ├── dotenv@16.3.1
│       └── helmet@7.1.0 (optional)
└── README.md                        # Backend documentation
```

## ⚛️  FRONTEND STRUCTURE
```
frontend-react/
├── src/
│   ├── pages/                       # Page Components
│   │   ├── Login.jsx               # Login form & authentication (66 lines)
│   │   │   └── Login.module.css    # Login styling (157 lines)
│   │   │       ├── .pageContainer
│   │   │       ├── .header
│   │   │       ├── .formContainer
│   │   │       ├── .formGroup
│   │   │       ├── .submitBtn
│   │   │       └── .error
│   │   │
│   │   ├── Register.jsx            # Registration form (91 lines)
│   │   │   └── Register.module.css # Register styling (150 lines)
│   │   │       └── (same as Login)
│   │   │
│   │   ├── Dashboard.jsx           # Room booking interface (99 lines)
│   │   │   └── Dashboard.module.css # Dashboard styling (145 lines)
│   │   │       ├── .container
│   │   │       ├── .roomsGrid
│   │   │       ├── .roomCard
│   │   │       ├── .bookingForm
│   │   │       └── .message
│   │   │
│   │   └── Bookings.jsx            # User's bookings management (124 lines)
│   │       └── Bookings.module.css # Bookings styling (148 lines)
│   │           ├── .container
│   │           ├── .bookingCard
│   │           ├── .editForm
│   │           ├── .actionButtons
│   │           └── .message
│   │
│   ├── components/                 # Reusable Components
│   │   ├── Header.jsx              # Navigation header (38 lines)
│   │   │   └── Header.module.css   # Header styling (52 lines)
│   │   │       ├── .header (red gradient background)
│   │   │       ├── .container
│   │   │       ├── .nav
│   │   │       ├── .user
│   │   │       └── .logoutBtn
│   │   │
│   │   └── ProtectedRoute.jsx      # Route protection wrapper (13 lines)
│   │       └── Logic: Check isAuthenticated() → redirect to /login
│   │
│   ├── hooks/                      # Custom React Hooks
│   │   └── useAuth.js              # Authentication state management (31 lines)
│   │       ├── login(token, user)
│   │       ├── logout()
│   │       ├── getToken()
│   │       ├── getUser()
│   │       └── isAuthenticated()
│   │
│   ├── api/                        # API Service Layer
│   │   └── index.js                # Axios configuration (47 lines)
│   │       ├── axios.create()
│   │       ├── Request Interceptor (attach JWT token)
│   │       ├── Response Interceptor (handle 403 errors)
│   │       ├── authAPI.register()
│   │       ├── authAPI.login()
│   │       ├── bookingAPI.createBooking()
│   │       ├── bookingAPI.getBookings()
│   │       ├── bookingAPI.getBookingById()
│   │       ├── bookingAPI.updateBooking()
│   │       ├── bookingAPI.deleteBooking()
│   │       └── healthAPI.check()
│   │
│   ├── App.jsx                     # Main app component (34 lines)
│   │   └── Routes:
│   │       ├── /login (public)
│   │       ├── /register (public)
│   │       ├── / (protected → Dashboard)
│   │       └── /bookings (protected)
│   │
│   ├── App.css                     # Global styles (40 lines)
│   │   ├── Reset styles
│   │   ├── html/body height: 100%
│   │   ├── #root flex layout
│   │   └── min-height: 100vh
│   │
│   └── main.jsx                    # React entry point (17 lines)
│       └── ReactDOM.createRoot()
│
├── index.html                      # HTML container
│   ├── <!DOCTYPE html>
│   ├── <meta charset>
│   ├── <title>Hotel Management System</title>
│   ├── <div id="root"></div>
│   └── <script src="/src/main.jsx"></script>
│
├── vite.config.js                 # Vite build configuration
│   ├── Port: 3000 (auto-increment)
│   ├── Auto-open: true
│   ├── React plugin
│   └── Terser minification
│
├── package.json                    # Frontend dependencies
│   ├── react@18.2.0
│   ├── react-dom@18.2.0
│   ├── react-router-dom@6.20.0
│   ├── axios@1.6.2
│   ├── vite@5.0.0
│   ├── @vitejs/plugin-react@4.2.0
│   └── Scripts:
│       ├── npm run dev
│       ├── npm run build
│       └── npm run preview
│
├── .env                            # Frontend environment
│   └── VITE_API_BASE_URL=http://23.22.102.15:5000
│
└── README.md                       # Frontend documentation
```

## 📊 ARCHITECTURE FLOW

```
┌─────────────────────────────────────────────────────────────┐
│                    USER BROWSER                              │
│                  localhost:3001                              │
├─────────────────────────────────────────────────────────────┤
│                    React Frontend                            │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ App.jsx (Router)                                    │    │
│  │  ├── Header.jsx (Navigation)                        │    │
│  │  ├── Login.jsx (Sign In)                            │    │
│  │  ├── Register.jsx (Create Account)                  │    │
│  │  ├── Dashboard.jsx (Book Rooms) [Protected]         │    │
│  │  └── Bookings.jsx (Manage Bookings) [Protected]     │    │
│  │                                                     │    │
│  │  State Management:                                  │    │
│  │  ├── useAuth Hook (localStorage JWT)               │    │
│  │  └── React Router (Client-side routing)            │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
                           ↓
              Axios API Service (api/index.js)
              ├── Request Interceptor
              │   └── Add: Authorization: Bearer {token}
              └── Response Interceptor
                  └── Handle 403 → Clear auth + Redirect
                           ↓
┌─────────────────────────────────────────────────────────────┐
│            AWS EC2 Backend Server (Node.js)                  │
│            23.22.102.15:5000                                │
├─────────────────────────────────────────────────────────────┤
│  Express.js Server (server.js)                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ CORS Middleware (Allow frontend origins)            │   │
│  │ Body Parser (JSON)                                  │   │
│  │ Request Logger                                      │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Routes                                              │   │
│  │ ├── POST /api/auth/register                         │   │
│  │ ├── POST /api/auth/login                            │   │
│  │ ├── POST /api/book-room                             │   │
│  │ ├── GET /api/bookings                               │   │
│  │ ├── GET /api/bookings/:id                           │   │
│  │ ├── PUT /api/bookings/:id                           │   │
│  │ ├── DELETE /api/bookings/:id                        │   │
│  │ └── GET /api/health                                 │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Models                                              │   │
│  │ ├── User (email, password, name)                    │   │
│  │ └── Booking (userId, roomType, dates)               │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│          MongoDB Atlas (Cloud Database)                      │
│   mongodb+srv://...@cluster0.rtil0q4.mongodb.net            │
├─────────────────────────────────────────────────────────────┤
│  hotel-management (Database)                                │
│  ├── users (Collection)                                     │
│  │   └── Documents: {_id, email, password_hash, name}      │
│  └── bookings (Collection)                                  │
│      └── Documents: {_id, userId, roomType, dates, ...}    │
└─────────────────────────────────────────────────────────────┘
```

## 🔐 AUTHENTICATION FLOW

```
1. User Registers:
   Register Form → Frontend validation → POST /api/auth/register
   ↓
   Backend: Hash password (bcrypt) → Save to MongoDB → Generate JWT
   ↓
   Response: {token, user} → localStorage.setItem('token', token)
   ↓
   Redirect to Dashboard (Protected Route)

2. User Logs In:
   Login Form → POST /api/auth/login
   ↓
   Backend: Find user → Verify password → Generate JWT
   ↓
   Response: {token, user} → localStorage.setItem('token', token)
   ↓
   Redirect to Dashboard

3. Subsequent Requests:
   Any API call → Axios Request Interceptor
   ↓
   Attach: Authorization: Bearer {token from localStorage}
   ↓
   Backend: Verify JWT → Execute operation
   ↓
   On 403 error: Axios Response Interceptor
   → Clear localStorage → Redirect to /login
```

## 📝 KEY FILES OVERVIEW

| File | Lines | Purpose |
|------|-------|---------|
| backend/server.js | 347 | Main backend server logic |
| src/pages/Login.jsx | 66 | Login component |
| src/pages/Register.jsx | 91 | Register component |
| src/pages/Dashboard.jsx | 99 | Room booking interface |
| src/pages/Bookings.jsx | 124 | Bookings management |
| src/api/index.js | 47 | Axios configuration & API methods |
| src/hooks/useAuth.js | 31 | Authentication state hook |
| src/components/Header.jsx | 38 | Navigation header |
| src/components/ProtectedRoute.jsx | 13 | Route protection wrapper |
| src/App.jsx | 34 | Main app with routing |
| src/App.css | 40 | Global styles |

## 🚀 DEPLOYMENT SETUP

**Backend (AWS EC2):**
- Running on: `23.22.102.15:5000`
- Process Manager: PM2
- Environment: Production
- Database: MongoDB Atlas (Cloud)

**Frontend (Development):**
- Running on: `localhost:3001`
- Build Tool: Vite
- Framework: React 18
- Styling: CSS Modules

**Production Ready:**
- Frontend: Build with `npm run build` → Deploy to AWS S3 or Netlify
- Backend: Already deployed on EC2
- Database: MongoDB Atlas configured

## 🔗 IMPORTANT URLS

```
Frontend:     http://localhost:3001
Backend API:  http://23.22.102.15:5000
Health Check: http://23.22.102.15:5000/api/health
```

## 📦 TECHNOLOGIES USED

**Backend:**
- Node.js + Express.js
- MongoDB + Mongoose
- JWT Authentication
- bcryptjs Password Hashing
- CORS enabled

**Frontend:**
- React 18
- React Router v6
- Axios (HTTP Client)
- CSS Modules (Scoped Styling)
- Vite (Build Tool)

**Deployment:**
- AWS EC2 (Backend)
- MongoDB Atlas (Database)
- Git + GitHub (Version Control)
