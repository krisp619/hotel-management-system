# Hotel Management System - API Documentation

## Base URL
```
http://localhost:5000
```

---

## Authentication
All protected endpoints require a `Bearer` token in the `Authorization` header.

**Header Format:**
```
Authorization: Bearer {access_token}
```

**Token obtained from:** `/api/auth/login` or `/api/auth/register`

---

## Endpoints

### 1. User Registration

| Field | Value |
|-------|-------|
| **Endpoint** | `/api/auth/register` |
| **Method** | `POST` |
| **Authentication** | None |
| **Description** | Create a new user account |

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "confirm_password": "password123"
}
```

**Success Response (201):**
```json
{
  "access_token": "eyJhbGc...",
  "token_type": "bearer"
}
```

**Error Responses:**
- `400` - Passwords do not match / Email already registered
- `422` - Invalid email format / Missing required fields

---

### 2. User Login

| Field | Value |
|-------|-------|
| **Endpoint** | `/api/auth/login` |
| **Method** | `POST` |
| **Authentication** | None |
| **Description** | Authenticate user and get access token |

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Success Response (200):**
```json
{
  "access_token": "eyJhbGc...",
  "token_type": "bearer"
}
```

**Error Responses:**
- `401` - Invalid credentials
- `422` - Missing required fields

---

### 3. Create Booking

| Field | Value |
|-------|-------|
| **Endpoint** | `/api/book-room` |
| **Method** | `POST` |
| **Authentication** | Required (Bearer Token) |
| **Description** | Create a new room booking |

**Request Headers:**
```
Authorization: Bearer {access_token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "guest_name": "John Doe",
  "email": "john@example.com",
  "room_type": "Double",
  "check_in": "2025-12-31",
  "check_out": "2026-01-02",
  "guests": 2
}
```

**Success Response (201):**
```json
{
  "booking_id": "booking_1",
  "status": "success",
  "message": "Booking created successfully"
}
```

**Error Responses:**
- `401` - Unauthorized / Missing authorization header
- `422` - Invalid data format / Missing required fields

---

### 4. Get User Bookings

| Field | Value |
|-------|-------|
| **Endpoint** | `/api/bookings` |
| **Method** | `GET` |
| **Authentication** | Required (Bearer Token) |
| **Description** | Retrieve all bookings for the authenticated user |

**Request Headers:**
```
Authorization: Bearer {access_token}
```

**Query Parameters:**
```
?skip=0&limit=10
```

**Success Response (200):**
```json
{
  "bookings": [
    {
      "id": "booking_1",
      "user_email": "user@example.com",
      "guest_name": "John Doe",
      "email": "john@example.com",
      "room_type": "Double",
      "check_in": "2025-12-31",
      "check_out": "2026-01-02",
      "guests": 2,
      "created_at": "2025-12-30T10:30:00.123456"
    }
  ],
  "total": 1,
  "skip": 0,
  "limit": 10
}
```

**Error Responses:**
- `401` - Unauthorized / Invalid token

---

### 5. Delete Booking

| Field | Value |
|-------|-------|
| **Endpoint** | `/api/bookings/{booking_id}` |
| **Method** | `DELETE` |
| **Authentication** | Required (Bearer Token) |
| **Description** | Cancel/delete a specific booking |

**Request Headers:**
```
Authorization: Bearer {access_token}
```

**URL Parameters:**
```
booking_id - The ID of the booking to delete
```

**Success Response (200):**
```json
{
  "status": "success",
  "message": "Booking deleted"
}
```

**Error Responses:**
- `401` - Unauthorized / Invalid token
- `403` - Forbidden / Not your booking
- `404` - Booking not found

---

### 6. Health Check

| Field | Value |
|-------|-------|
| **Endpoint** | `/api/health` |
| **Method** | `GET` |
| **Authentication** | None |
| **Description** | Check if the API is running |

**Success Response (200):**
```json
{
  "status": "OK",
  "message": "Server is running"
}
```

---

### 7. Root Endpoint

| Field | Value |
|-------|-------|
| **Endpoint** | `/` |
| **Method** | `GET` |
| **Authentication** | None |
| **Description** | Get API information |

**Success Response (200):**
```json
{
  "message": "Hotel Management System API",
  "version": "1.0.0",
  "docs": "/docs"
}
```

---

## Error Handling

All error responses follow this format:

```json
{
  "detail": "Error message describing what went wrong"
}
```

### Common HTTP Status Codes:
- `200` - OK
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `422` - Unprocessable Entity
- `500` - Internal Server Error

---

## Data Validation Rules

### Email
- Must be a valid email format (e.g., user@example.com)

### Password
- Minimum 6 characters
- Must match confirm_password on registration

### Room Type
- Valid values: `Single`, `Double`, `Deluxe`

### Dates
- Format: `YYYY-MM-DD`
- Check-out date must be after check-in date

### Guests
- Minimum: 1
- Maximum: 10

---

## Example Usage

### Register and Login Flow:
```javascript
// Step 1: Register
const registerRes = await fetch('http://localhost:5000/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'raj@example.com',
    password: 'password123',
    confirm_password: 'password123'
  })
});
const { access_token } = await registerRes.json();

// Step 2: Create Booking (using token)
const bookRes = await fetch('http://localhost:5000/api/book-room', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${access_token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    guest_name: 'Raj',
    email: 'raj@example.com',
    room_type: 'Double',
    check_in: '2025-12-31',
    check_out: '2026-01-02',
    guests: 2
  })
});
const booking = await bookRes.json();
console.log(booking);
```

---

## Rate Limiting
Currently no rate limiting implemented. Recommended for production.

## CORS
CORS is enabled for all origins (`*`).

## Security Notes
- Passwords are hashed using bcrypt
- Tokens expire after 30 days
- Use HTTPS in production
- Never expose tokens in client-side code
