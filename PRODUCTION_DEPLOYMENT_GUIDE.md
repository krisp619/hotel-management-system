# 🚀 Production Deployment Guide - Hotel Management Backend

**Date:** January 6, 2026  
**Status:** ✅ Production Ready  
**Backend:** Node.js + Express + MongoDB Atlas  
**Frontend:** React (Vite) on AWS S3  

---

## 📋 What's Fixed

### 1. **Login & Register API Timeout Issue** ✅
**Problem:** Frontend requests were timing out (axios 10s timeout exceeded)  
**Root Cause:** Some code paths were not returning HTTP responses  
**Solution:** Refactored controllers with guaranteed response on all paths

### 2. **CORS Configuration** ✅
**Improved:**
- Proper CORS whitelist for S3 frontend URLs
- Dynamic origin validation
- Support for development and production URLs
- Preflight request handling

### 3. **Error Handling** ✅
**Enhanced:**
- Every code path returns a JSON response
- Proper HTTP status codes (400, 401, 403, 409, 500, 503)
- Standardized error format with `success` flag
- Meaningful error codes for frontend handling

### 4. **Request Protection** ✅
**Added:**
- 25-second request timeout to prevent hanging
- MongoDB connection verification before queries
- Proper async/await error handling
- Request duration logging

---

## 🔐 Security Improvements

### Password Security
- **bcryptjs** for password hashing (10 salt rounds)
- Safe password comparison with timing-attack protection
- Never expose password in API responses

### Input Validation
- Email format validation with regex
- Minimum password length enforcement (6 characters)
- Type checking for all inputs
- Trimming and normalization of strings

### JWT Tokens
- 30-day expiration
- Secure signing with environment secret
- Token verification on protected routes

### Error Messages
- Don't reveal if email exists (prevents user enumeration)
- Generic "invalid credentials" message for login failures

---

## 📊 API Endpoints - Complete Reference

### Authentication (No JWT Required)

#### POST `/api/auth/register`
```json
Request:
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123",
  "confirmPassword": "SecurePass123"
}

Success Response (201):
{
  "success": true,
  "message": "Registration successful",
  "token": "eyJhbGc...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com"
  }
}

Error Responses:
400: Missing/invalid fields
409: Email already registered
503: Database unavailable
500: Server error
```

#### POST `/api/auth/login`
```json
Request:
{
  "email": "john@example.com",
  "password": "SecurePass123"
}

Success Response (200):
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGc...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com"
  }
}

Error Responses:
400: Missing fields
401: Invalid credentials
503: Database unavailable
500: Server error
```

#### GET `/api/health`
```json
Success Response (200):
{
  "status": "healthy",
  "mongodb": "connected",
  "timestamp": "2026-01-06T10:30:00.000Z",
  "environment": "production",
  "uptime": 3600
}
```

### Bookings (JWT Required - Add Authorization header)
```
Authorization: Bearer <your_jwt_token>
```

#### POST `/api/book-room`
#### GET `/api/bookings`
#### GET `/api/bookings/:id`
#### PUT `/api/bookings/:id`
#### DELETE `/api/bookings/:id`

---

## 🌍 CORS Configuration

### Allowed Origins (Production)
```javascript
http://localhost:3000                    // Local development (React)
http://localhost:5173                    // Local development (Vite)
http://127.0.0.1:3000                   // Local development (alt)
http://127.0.0.1:5173                   // Local development (alt)
http://hotel-frontend-krishna.s3-website-us-east-1.amazonaws.com    // S3 Frontend
https://hotel-frontend-krishna.s3-website-us-east-1.amazonaws.com   // S3 Frontend (HTTPS)
```

### How to Add More Origins
Edit `.env` file:
```env
CORS_ORIGIN=http://localhost:3000,http://your-domain.com,https://your-domain.com
```

Allowed Methods:
- GET, POST, PUT, DELETE, OPTIONS

Allowed Headers:
- Content-Type, Authorization

---

## 🔧 Environment Setup

### Required .env Variables
```env
# Server
NODE_ENV=production
PORT=5000

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/hotel-management?retryWrites=true&w=majority

# Security
JWT_SECRET=<long-random-string-32-chars-minimum>

# Frontend CORS
CORS_ORIGIN=http://hotel-frontend-krishna.s3-website-us-east-1.amazonaws.com,https://hotel-frontend-krishna.s3-website-us-east-1.amazonaws.com

# Logging
LOG_LEVEL=info
REQUEST_LOGGING=true
```

### Generate JWT Secret
```bash
# On Mac/Linux
openssl rand -base64 32

# On Windows (PowerShell)
[Convert]::ToBase64String((1..32 | ForEach-Object { [byte](Get-Random -Max 256) }))
```

---

## 🚀 Deployment Steps (AWS EC2)

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Create .env File
```bash
cp .env.example .env
# Edit .env with your actual values
nano .env  # or use your editor
```

### 3. Test Connection
```bash
npm test  # If you have tests
node server-production-verified.js
```

### 4. Verify Health Endpoint
```bash
curl http://localhost:5000/api/health
```

### 5. Run in Production (Using PM2)
```bash
npm install -g pm2
pm2 start server-production-verified.js --name "hotel-api"
pm2 save
pm2 startup
```

### 6. Monitor Logs
```bash
pm2 logs hotel-api
```

---

## ✅ Testing Checklist

### Register Endpoint
- [ ] Valid registration creates user and returns token
- [ ] Duplicate email returns 409
- [ ] Missing fields return 400
- [ ] Invalid email format returns 400
- [ ] Password < 6 chars returns 400
- [ ] Passwords don't match returns 400

### Login Endpoint
- [ ] Valid credentials return token
- [ ] Invalid email returns 401
- [ ] Invalid password returns 401
- [ ] Missing fields return 400
- [ ] Token is valid JWT

### CORS
- [ ] S3 frontend can call /api/auth/register
- [ ] S3 frontend can call /api/auth/login
- [ ] S3 frontend receives correct headers
- [ ] Non-whitelisted origins are blocked

### Error Handling
- [ ] All endpoints return JSON responses
- [ ] No requests hang or timeout
- [ ] MongoDB down returns 503
- [ ] Server errors return 500 with proper message

---

## 🔍 Troubleshooting

### Issue: "Request timeout" from frontend
**Causes:**
- MongoDB not connected
- Network issues between EC2 and MongoDB Atlas
- Slow database queries

**Solutions:**
1. Check MongoDB connection: `curl http://your-ip:5000/api/health`
2. Verify MONGODB_URI in .env
3. Check security groups in AWS

### Issue: CORS error in browser console
**Causes:**
- Frontend origin not in CORS whitelist
- CORS headers not being sent

**Solutions:**
1. Check CORS_ORIGIN in .env
2. Restart server after changing .env
3. Check browser console for exact origin being blocked

### Issue: "Email already registered" on new email
**Causes:**
- Email actually exists in database
- Case-sensitivity issue (already normalized)

**Solutions:**
1. Use different email
2. Check MongoDB directly for duplicate entries

### Issue: Login returns 401 for correct password
**Causes:**
- User doesn't exist (created with different case/spacing)
- Password hashing issue

**Solutions:**
1. Verify user exists in MongoDB
2. Re-register user
3. Check bcryptjs is installed: `npm list bcryptjs`

---

## 📈 Performance Considerations

### Request Timeouts
- 25-second server timeout (prevents hanging)
- 10-second axios timeout on frontend (client-side)

### Database Optimization
- Email indexed (faster lookups)
- UserId indexed (faster user queries)
- CreatedAt indexed (faster sorting)

### Connection Pooling
- MongoDB connection pooling enabled
- Retry logic for connection failures

---

## 🔐 Production Security Checklist

- [ ] JWT_SECRET is long and random (32+ characters)
- [ ] NODE_ENV=production
- [ ] CORS_ORIGIN whitelists only your frontend
- [ ] MongoDB Atlas is in production mode
- [ ] EC2 security group allows ports 80, 443, 5000
- [ ] .env file is NOT committed to git
- [ ] Firewall blocks direct database access
- [ ] SSL/TLS configured on your domain
- [ ] Passwords are properly hashed with bcrypt
- [ ] Error messages don't leak sensitive info

---

## 📞 Support & Monitoring

### Log Files
- PM2 logs: `pm2 logs hotel-api`
- System logs: Check /var/log on EC2

### Key Metrics to Monitor
- Request response times
- Error rates
- MongoDB connection status
- Memory usage on EC2

### Backend URL
```
Production: http://23.22.102.15:5000
Health: http://23.22.102.15:5000/api/health
```

---

**Last Updated:** January 6, 2026  
**Version:** 2.0 - Production Ready  
**Backend Framework:** Express.js  
**Database:** MongoDB Atlas  
**Deployment:** AWS EC2 + PM2
