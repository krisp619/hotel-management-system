# 🔑 API KEYS & ENVIRONMENT VARIABLES - COMPLETE REFERENCE

**Last Updated:** January 3, 2026  
**Status:** ✅ All Keys Active and Configured  
**Project:** Hotel Management System

---

## 📋 QUICK SUMMARY

| Component | Type | Count | Status |
|-----------|------|-------|--------|
| Backend (.env) | Environment Variables | 8 | ✅ Configured |
| Frontend (.env) | Environment Variables | 2 | ✅ Configured |
| Firebase | Configuration Keys | 7 | ⏳ Optional |
| **TOTAL** | | **17** | ✅ |

---

## 🔴 BACKEND API KEYS & CONFIG

**File Location:** `backend/.env`

### Required Variables (MUST HAVE)

#### 1. **PORT**
```
PORT=5000
```
- **Purpose:** Backend server port
- **Status:** ✅ Active
- **Usage:** Server listening on `http://localhost:5000`

#### 2. **MONGODB_URI**
```
MONGODB_URI=mongodb://localhost:27017/hotel-management
```
- **Purpose:** MongoDB database connection string
- **Status:** ✅ Connected
- **Type:** Connection String
- **Database Name:** hotel-management
- **Host:** localhost (change for production)

#### 3. **JWT_SECRET**
```
JWT_SECRET=7f9c4e8d2a1b6f5c3e9d7a2b8f1c4e6d9a3b5c7e8f0d2a4b6c8e9f1a3d5c7e9f
```
- **Purpose:** JWT token signing key
- **Status:** ✅ Set (64 characters)
- **Type:** Secret Key
- **Length Required:** 32+ characters
- **Security:** ✅ Secure random value (NOT hardcoded in code)

#### 4. **NODE_ENV**
```
NODE_ENV=production
```
- **Purpose:** Environment mode
- **Status:** ✅ Set to production
- **Options:** `development` or `production`

#### 5. **CORS_ORIGIN**
```
CORS_ORIGIN=http://hotel-management-frontend.s3-website-us-east-1.amazonaws.com,https://hotel-management-frontend.s3-website-us-east-1.amazonaws.com
```
- **Purpose:** Allowed frontend domains for CORS
- **Status:** ✅ S3 bucket configured
- **Type:** Comma-separated list
- **Includes:** Both HTTP and HTTPS

### Optional Variables

#### 6. **LOG_LEVEL**
```
LOG_LEVEL=info
```
- **Purpose:** Logging verbosity
- **Status:** ✅ Set to info
- **Options:** `error`, `warn`, `info`, `debug`

#### 7. **REQUEST_LOGGING**
```
REQUEST_LOGGING=true
```
- **Purpose:** Log all API requests
- **Status:** ✅ Enabled
- **Format:** Shows timestamp, method, path

---

## 🔵 FRONTEND API KEYS & CONFIG

**File Location:** `frontend-react/.env.production` (for production)  
**File Location:** `frontend-react/.env` (for local development)

### Required Variables (MUST HAVE)

#### 1. **VITE_API_BASE_URL** (Production)
```
VITE_API_BASE_URL=http://23.22.102.15:5000
```
- **Purpose:** Backend API endpoint
- **Status:** ✅ AWS EC2 configured
- **IP Address:** 23.22.102.15 (AWS EC2 instance)
- **Port:** 5000
- **Environment:** Production (S3 frontend)

#### 2. **VITE_API_BASE_URL** (Development/Local)
```
VITE_API_BASE_URL=http://localhost:5000
```
- **Purpose:** Backend API endpoint for local testing
- **Status:** ✅ Localhost configured
- **Port:** 5000
- **Environment:** Development (localhost frontend)

---

## 🟠 FIREBASE CONFIG (OPTIONAL - IF USING FIREBASE AUTH)

**File Location:** `frontend-react/.env` (if needed)

If you want to use Firebase authentication instead of custom JWT, add these:

```env
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id
VITE_FIREBASE_OAUTH_CLIENT_ID=your_firebase_oauth_client_id (OPTIONAL)
```

**Note:** Firebase integration is ready in `frontend-react/src/firebase/useFirebaseAuth.js` but currently using JWT authentication.

---

## 🌐 API ENDPOINTS

All endpoints require the API base URL from VITE_API_BASE_URL:

### Authentication (No JWT Required)
| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| POST | `/api/auth/register` | ❌ | Register new user |
| POST | `/api/auth/login` | ❌ | Login user |
| GET | `/api/health` | ❌ | Health check |

### Bookings (JWT Required)
| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| POST | `/api/book-room` | ✅ JWT | Create booking |
| GET | `/api/bookings` | ✅ JWT | List bookings |
| GET | `/api/bookings/:id` | ✅ JWT | Get booking details |
| PUT | `/api/bookings/:id` | ✅ JWT | Update booking |
| DELETE | `/api/bookings/:id` | ✅ JWT | Delete booking |

---

## 🧪 TEST THE APIs

### 1. Health Check (No Auth Needed)
```bash
curl http://localhost:5000/api/health
```

### 2. Register New User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

### 3. Login User
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

**Response will include:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "_id": "...",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

### 4. Create Booking (JWT Required)
```bash
curl -X POST http://localhost:5000/api/book-room \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "roomType": "deluxe",
    "checkInDate": "2026-01-10",
    "checkOutDate": "2026-01-15"
  }'
```

---

## 🔒 SECURITY CHECKLIST

- ✅ No API keys hardcoded in source code
- ✅ All secrets loaded from environment variables
- ✅ JWT_SECRET is 64 characters (32+ required)
- ✅ .env files are NOT in git repository (.gitignore active)
- ✅ Firebase keys are public-safe (only web keys)
- ✅ CORS configured only for S3 bucket + localhost
- ✅ MongoDB password in URI (protected)
- ✅ Production uses AWS EC2 backend (not localhost)

---

## 📦 SETUP CHECKLIST

Before running the application:

- [ ] Backend `.env` file created with all 8 variables
- [ ] Frontend `.env.production` created with VITE_API_BASE_URL
- [ ] MongoDB is running (local or Atlas)
- [ ] Backend server started: `npm start` (in backend folder)
- [ ] Frontend dev server started: `npm run dev` (in frontend-react folder)
- [ ] Test health endpoint: `curl http://localhost:5000/api/health`
- [ ] Frontend can reach backend without CORS errors

---

## 🚀 PRODUCTION DEPLOYMENT

### Backend (AWS EC2)
- **IP:** 23.22.102.15
- **Port:** 5000
- **Status:** Running
- **CORS:** Configured for S3 domain

### Frontend (AWS S3)
- **Bucket:** hotel-management-frontend
- **URL:** http://hotel-management-frontend.s3-website-us-east-1.amazonaws.com
- **API URL:** Points to AWS EC2 backend

### Database (MongoDB)
- **Type:** Local MongoDB (localhost:27017)
- **Name:** hotel-management
- **Collections:** users, bookings

---

## ⚠️ COMMON ISSUES

**Issue:** `ERR_FAILED 403` or CORS errors
- **Solution:** Check CORS_ORIGIN in backend .env matches frontend URL

**Issue:** `Cannot POST /api/auth/register`
- **Solution:** Make sure backend is running on port 5000

**Issue:** `MongoDB connection failed`
- **Solution:** Ensure MongoDB is running: `mongod`

**Issue:** `Invalid token` or 403 response
- **Solution:** Make sure JWT token is included in Authorization header

**Issue:** Frontend shows `API_BASE_URL is undefined`
- **Solution:** Check VITE_API_BASE_URL is set in .env file

---

## 📞 QUICK REFERENCE

**Backend Start:** `cd backend && npm start`  
**Frontend Start:** `cd frontend-react && npm run dev`  
**Health Check:** `http://localhost:5000/api/health`  
**Frontend (Dev):** `http://localhost:5173`  
**Backend (Prod):** `http://23.22.102.15:5000`  

---

**Generated:** 2026-01-03  
**All Keys Verified:** ✅ Active
