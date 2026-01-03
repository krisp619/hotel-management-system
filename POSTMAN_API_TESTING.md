# =====================================================
# POSTMAN API TESTING GUIDE
# =====================================================
# Complete API endpoint reference for Hotel Management System
# =====================================================

## BASE URL
```
http://23.22.102.15:5000
```

## AVAILABLE ENDPOINTS

### ========== 1. HEALTH CHECK ==========
## Endpoint: GET /api/health
## Purpose: Verify backend is running and check MongoDB connection

**URL**: `http://23.22.102.15:5000/api/health`
**Method**: `GET`
**Authentication**: None required
**Headers**: (none)
**Body**: (none)

**Example Response (200 OK)**:
```json
{
  "status": "healthy",
  "mongodb": "connected",
  "timestamp": "2026-01-03T12:00:00.000Z",
  "environment": "production",
  "uptime": 3600.5
}
```

**Testing in Postman**:
1. Create new request
2. Set method to GET
3. Set URL to: http://23.22.102.15:5000/api/health
4. Click Send
5. Expect: Status 200, JSON response with "status": "healthy"

---

### ========== 2. USER REGISTRATION ==========
## Endpoint: POST /api/auth/register
## Purpose: Create new user account

**URL**: `http://23.22.102.15:5000/api/auth/register`
**Method**: `POST`
**Authentication**: None required
**Headers**: 
```
Content-Type: application/json
```

**Request Body**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Password123!",
  "confirmPassword": "Password123!"
}
```

**Required Fields**:
- `name` (string, 1+ characters)
- `email` (string, valid email format)
- `password` (string, 6+ characters)
- `confirmPassword` (string, must match password)

**Example Response (201 Created)**:
```json
{
  "message": "Registration successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

**Error Response (400 Bad Request)**:
```json
{
  "error": "Email already registered"
}
```

**Testing in Postman**:
1. Create new request
2. Set method to POST
3. Set URL to: http://23.22.102.15:5000/api/auth/register
4. Go to Body tab -> Select "raw" -> Select "JSON"
5. Paste request body with unique email
6. Click Send
7. Expect: Status 201, token in response
8. Save token for next requests

---

### ========== 3. USER LOGIN ==========
## Endpoint: POST /api/auth/login
## Purpose: Authenticate user and get JWT token

**URL**: `http://23.22.102.15:5000/api/auth/login`
**Method**: `POST`
**Authentication**: None required
**Headers**:
```
Content-Type: application/json
```

**Request Body**:
```json
{
  "email": "john@example.com",
  "password": "Password123!"
}
```

**Required Fields**:
- `email` (string, must exist in database)
- `password` (string, must match registered password)

**Example Response (200 OK)**:
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "userId": "507f1f77bcf86cd799439011",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

**Error Response (401 Unauthorized)**:
```json
{
  "error": "Invalid credentials"
}
```

**Testing in Postman**:
1. Create new request
2. Set method to POST
3. Set URL to: http://23.22.102.15:5000/api/auth/login
4. Go to Body tab -> raw -> JSON
5. Paste request body with registered email/password
6. Click Send
7. Expect: Status 200, token in response
8. **IMPORTANT**: Copy token value for authenticated requests

**JWT Token Format**:
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1MDdmMWY3N2JjZjg2Y2Q3OTk0MzkwMTEiLCJpYXQiOjE2NzMwMjAwMDAsImV4cCI6MTY3NTYxMjAwMH0.signature
```

---

### ========== 4. CREATE BOOKING ==========
## Endpoint: POST /api/book-room
## Purpose: Create new room booking

**URL**: `http://23.22.102.15:5000/api/book-room`
**Method**: `POST`
**Authentication**: Required (JWT token)
**Headers**:
```
Content-Type: application/json
Authorization: Bearer <your_jwt_token>
```

**Request Body**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "roomType": "Double",
  "checkInDate": "2026-01-15T00:00:00.000Z",
  "checkOutDate": "2026-01-18T00:00:00.000Z"
}
```

**Required Fields**:
- `name` (string)
- `email` (string)
- `roomType` (string: "Single", "Double", or "Deluxe")
- `checkInDate` (ISO date string, YYYY-MM-DDTHH:mm:ss.fffZ)
- `checkOutDate` (ISO date string, must be after checkInDate)

**Example Response (201 Created)**:
```json
{
  "message": "Booking created successfully",
  "_id": "507f1f77bcf86cd799439011",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "userId": "507f1f77bcf86cd799439012",
    "name": "John Doe",
    "email": "john@example.com",
    "roomType": "Double",
    "checkInDate": "2026-01-15T00:00:00.000Z",
    "checkOutDate": "2026-01-18T00:00:00.000Z",
    "createdAt": "2026-01-03T12:00:00.000Z",
    "updatedAt": "2026-01-03T12:00:00.000Z"
  }
}
```

**Error Response (401 Unauthorized)**:
```json
{
  "error": "Access token required"
}
```

**Testing in Postman**:
1. Create new request
2. Set method to POST
3. Set URL to: http://23.22.102.15:5000/api/book-room
4. Go to Headers tab
5. Add header:
   - Key: `Authorization`
   - Value: `Bearer <paste_token_from_login>`
6. Go to Body tab -> raw -> JSON
7. Paste request body
8. Click Send
9. Expect: Status 201, booking created with _id
10. **IMPORTANT**: Save booking _id for update/delete operations

---

### ========== 5. GET ALL BOOKINGS ==========
## Endpoint: GET /api/bookings
## Purpose: Retrieve all bookings for logged-in user

**URL**: `http://23.22.102.15:5000/api/bookings`
**Method**: `GET`
**Authentication**: Required (JWT token)
**Headers**:
```
Authorization: Bearer <your_jwt_token>
```

**Query Parameters** (optional):
```
page=1          (default: 1)
limit=10        (default: 10)
```

**Example URL with parameters**:
```
http://23.22.102.15:5000/api/bookings?page=1&limit=10
```

**Example Response (200 OK)**:
```json
{
  "totalBookings": 3,
  "currentPage": 1,
  "totalPages": 1,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "userId": "507f1f77bcf86cd799439012",
      "name": "John Doe",
      "email": "john@example.com",
      "roomType": "Double",
      "checkInDate": "2026-01-15T00:00:00.000Z",
      "checkOutDate": "2026-01-18T00:00:00.000Z",
      "createdAt": "2026-01-03T12:00:00.000Z",
      "updatedAt": "2026-01-03T12:00:00.000Z"
    }
  ]
}
```

**Testing in Postman**:
1. Create new request
2. Set method to GET
3. Set URL to: http://23.22.102.15:5000/api/bookings
4. Go to Headers tab
5. Add header:
   - Key: `Authorization`
   - Value: `Bearer <paste_token>`
6. Click Send
7. Expect: Status 200, array of bookings

---

### ========== 6. GET SINGLE BOOKING ==========
## Endpoint: GET /api/bookings/:id
## Purpose: Retrieve specific booking by ID

**URL**: `http://23.22.102.15:5000/api/bookings/<booking_id>`
**Method**: `GET`
**Authentication**: Required (JWT token)
**Headers**:
```
Authorization: Bearer <your_jwt_token>
```

**Path Parameters**:
- `id` (MongoDB ObjectId from create booking response)

**Example URL**:
```
http://23.22.102.15:5000/api/bookings/507f1f77bcf86cd799439011
```

**Example Response (200 OK)**:
```json
{
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "userId": "507f1f77bcf86cd799439012",
    "name": "John Doe",
    "email": "john@example.com",
    "roomType": "Double",
    "checkInDate": "2026-01-15T00:00:00.000Z",
    "checkOutDate": "2026-01-18T00:00:00.000Z",
    "createdAt": "2026-01-03T12:00:00.000Z"
  }
}
```

**Error Response (404 Not Found)**:
```json
{
  "error": "Booking not found"
}
```

**Testing in Postman**:
1. Create new request
2. Set method to GET
3. Set URL to: http://23.22.102.15:5000/api/bookings/507f1f77bcf86cd799439011
4. Replace 507f1f77bcf86cd799439011 with actual booking _id from create
5. Go to Headers -> Add Authorization header
6. Click Send
7. Expect: Status 200, single booking object

---

### ========== 7. UPDATE BOOKING ==========
## Endpoint: PUT /api/bookings/:id
## Purpose: Update existing booking

**URL**: `http://23.22.102.15:5000/api/bookings/<booking_id>`
**Method**: `PUT`
**Authentication**: Required (JWT token)
**Headers**:
```
Content-Type: application/json
Authorization: Bearer <your_jwt_token>
```

**Request Body** (all optional, only include fields to update):
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "roomType": "Deluxe",
  "checkInDate": "2026-02-01T00:00:00.000Z",
  "checkOutDate": "2026-02-05T00:00:00.000Z"
}
```

**Example Response (200 OK)**:
```json
{
  "message": "Booking updated successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "userId": "507f1f77bcf86cd799439012",
    "name": "Jane Doe",
    "email": "jane@example.com",
    "roomType": "Deluxe",
    "checkInDate": "2026-02-01T00:00:00.000Z",
    "checkOutDate": "2026-02-05T00:00:00.000Z",
    "updatedAt": "2026-01-03T12:30:00.000Z"
  }
}
```

**Testing in Postman**:
1. Create new request
2. Set method to PUT
3. Set URL to: http://23.22.102.15:5000/api/bookings/<booking_id>
4. Go to Headers -> Add Authorization header
5. Go to Body -> raw -> JSON
6. Paste request body with updated fields
7. Click Send
8. Expect: Status 200, updated booking

---

### ========== 8. DELETE BOOKING ==========
## Endpoint: DELETE /api/bookings/:id
## Purpose: Delete booking

**URL**: `http://23.22.102.15:5000/api/bookings/<booking_id>`
**Method**: `DELETE`
**Authentication**: Required (JWT token)
**Headers**:
```
Authorization: Bearer <your_jwt_token>
```

**Body**: None

**Example Response (200 OK)**:
```json
{
  "message": "Booking deleted successfully"
}
```

**Error Response (404 Not Found)**:
```json
{
  "error": "Booking not found"
}
```

**Testing in Postman**:
1. Create new request
2. Set method to DELETE
3. Set URL to: http://23.22.102.15:5000/api/bookings/<booking_id>
4. Go to Headers -> Add Authorization header
5. Click Send
6. Expect: Status 200, success message

---

## =====================================================
## POSTMAN SETUP GUIDE
## =====================================================

### Create Environment Variable (for reusable token):
1. Click "Environments" in left sidebar
2. Click "+" to create new
3. Name it: "Hotel Management API"
4. Add variable:
   - Variable: `base_url`
   - Type: string
   - Initial value: `http://23.22.102.15:5000`
   - Current value: `http://23.22.102.15:5000`
5. Add variable:
   - Variable: `token`
   - Type: string
   - Initial value: (leave empty)
   - Current value: (leave empty)
6. Click Save

### Save JWT Token After Login:
After login request, add test script:
```javascript
if (pm.response.code === 200) {
  var jsonData = pm.response.json();
  pm.environment.set("token", jsonData.token);
  pm.environment.set("userId", jsonData.userId);
  pm.environment.set("bookingId", jsonData.data._id);
}
```

### Use Token in All Authenticated Requests:
In Headers tab, set:
- Key: `Authorization`
- Value: `Bearer {{token}}`

### Complete Test Flow:
1. Register (creates account)
2. Login (gets token, saves to environment)
3. Create Booking (saves booking_id)
4. Get All Bookings (verify it appears)
5. Get Single Booking (test with booking_id)
6. Update Booking (modify details)
7. Delete Booking (remove booking)

---

## =====================================================
## API KEY SUMMARY
## =====================================================

**Authentication Method**: JWT Bearer Token
**Token Obtained From**: POST /api/auth/login
**Token Format**: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
**Token Expiry**: 30 days
**Header Format**: Authorization: Bearer <token>
**Renewal**: Re-login to get new token

**No other API keys required** (MongoDB connection is server-side only)

---

## =====================================================
## TESTING CHECKLIST
## =====================================================

- [ ] Health endpoint returns 200
- [ ] Register endpoint creates user and returns token
- [ ] Login endpoint authenticates user
- [ ] Create booking requires valid JWT token
- [ ] Create booking returns booking with _id
- [ ] Get all bookings returns user's bookings
- [ ] Get single booking returns specific booking
- [ ] Update booking modifies fields
- [ ] Delete booking removes booking
- [ ] Invalid token returns 403 Forbidden
- [ ] Missing token returns 401 Unauthorized
- [ ] Invalid email returns 400 Bad Request
- [ ] Duplicate email returns 400 Bad Request

---
