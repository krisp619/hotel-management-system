# Hotel Management System - API Endpoints Reference

Base URL: `http://localhost:5000/api` (development)
Base URL: `https://your-domain.com/api` (production)

---

## Authentication Endpoints

### Register New User

**Endpoint**: `POST /auth/register`

**Description**: Create a new user account

**Request Body**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123",
  "confirmPassword": "SecurePass123"
}
```

**Response** (201 Created):
```json
{
  "message": "User registered successfully",
  "userId": "507f1f77bcf86cd799439011",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Responses**:
- 400: Missing required fields
- 400: Email already registered
- 400: Passwords do not match
- 500: Server error

---

### Login User

**Endpoint**: `POST /auth/login`

**Description**: Authenticate user and receive JWT token

**Request Body**:
```json
{
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

**Response** (200 OK):
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

**Error Responses**:
- 400: Missing email or password
- 401: Invalid email or password
- 500: Server error

---

## Booking Endpoints

### Create Booking

**Endpoint**: `POST /book-room`

**Description**: Create a new room booking

**Authentication**: Required (JWT token in Authorization header)

**Headers**:
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "roomType": "Double",
  "checkInDate": "2026-01-15",
  "checkOutDate": "2026-01-20"
}
```

**Room Types**:
- `Single` - $50/night
- `Double` - $100/night
- `Deluxe` - $200/night

**Response** (201 Created):
```json
{
  "message": "Booking created successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "userId": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "roomType": "Double",
    "checkInDate": "2026-01-15T00:00:00.000Z",
    "checkOutDate": "2026-01-20T00:00:00.000Z",
    "createdAt": "2026-01-10T15:30:00.000Z",
    "updatedAt": "2026-01-10T15:30:00.000Z"
  }
}
```

**Error Responses**:
- 400: Missing required fields
- 401: Unauthorized (invalid token)
- 500: Server error

---

### Get All User Bookings

**Endpoint**: `GET /bookings`

**Description**: Retrieve all bookings for authenticated user

**Authentication**: Required (JWT token in Authorization header)

**Headers**:
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Query Parameters**:
- `page` (optional): Page number (default: 1)
- `limit` (optional): Results per page (default: 10)

**Example Request**:
```
GET /bookings?page=1&limit=10
```

**Response** (200 OK):
```json
[
  {
    "_id": "507f1f77bcf86cd799439012",
    "userId": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "roomType": "Double",
    "checkInDate": "2026-01-15T00:00:00.000Z",
    "checkOutDate": "2026-01-20T00:00:00.000Z",
    "createdAt": "2026-01-10T15:30:00.000Z",
    "updatedAt": "2026-01-10T15:30:00.000Z"
  }
]
```

**Error Responses**:
- 401: Unauthorized (invalid token)
- 500: Server error

---

### Get Booking by ID

**Endpoint**: `GET /bookings/:id`

**Description**: Retrieve specific booking by ID

**Authentication**: Required (JWT token in Authorization header)

**Headers**:
```
Authorization: Bearer {token}
Content-Type: application/json
```

**URL Parameters**:
- `id`: Booking MongoDB ID

**Response** (200 OK):
```json
{
  "_id": "507f1f77bcf86cd799439012",
  "userId": "507f1f77bcf86cd799439011",
  "name": "John Doe",
  "email": "john@example.com",
  "roomType": "Double",
  "checkInDate": "2026-01-15T00:00:00.000Z",
  "checkOutDate": "2026-01-20T00:00:00.000Z",
  "createdAt": "2026-01-10T15:30:00.000Z",
  "updatedAt": "2026-01-10T15:30:00.000Z"
}
```

**Error Responses**:
- 401: Unauthorized (invalid token)
- 404: Booking not found
- 500: Server error

---

### Update Booking

**Endpoint**: `PUT /bookings/:id`

**Description**: Update existing booking

**Authentication**: Required (JWT token in Authorization header)

**Headers**:
```
Authorization: Bearer {token}
Content-Type: application/json
```

**URL Parameters**:
- `id`: Booking MongoDB ID

**Request Body** (update only fields needed):
```json
{
  "checkInDate": "2026-01-16",
  "checkOutDate": "2026-01-21",
  "roomType": "Deluxe"
}
```

**Response** (200 OK):
```json
{
  "message": "Booking updated successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "userId": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "roomType": "Deluxe",
    "checkInDate": "2026-01-16T00:00:00.000Z",
    "checkOutDate": "2026-01-21T00:00:00.000Z",
    "createdAt": "2026-01-10T15:30:00.000Z",
    "updatedAt": "2026-01-10T15:45:00.000Z"
  }
}
```

**Error Responses**:
- 400: Invalid update data
- 401: Unauthorized (invalid token)
- 404: Booking not found
- 500: Server error

---

### Delete Booking

**Endpoint**: `DELETE /bookings/:id`

**Description**: Delete booking by ID

**Authentication**: Required (JWT token in Authorization header)

**Headers**:
```
Authorization: Bearer {token}
```

**URL Parameters**:
- `id`: Booking MongoDB ID

**Response** (200 OK):
```json
{
  "message": "Booking deleted successfully"
}
```

**Error Responses**:
- 401: Unauthorized (invalid token)
- 404: Booking not found
- 500: Server error

---

## Authentication

### JWT Token

All protected endpoints require a valid JWT token in the Authorization header:

```
Authorization: Bearer {token}
```

**Token Details**:
- **Expiration**: 30 days
- **Algorithm**: HS256
- **Claims**: 
  - `userId`: User MongoDB ID
  - `iat`: Issued at timestamp
  - `exp`: Expiration timestamp

### Token Refresh

Tokens expire after 30 days. Users must login again to get a new token.

---

## Error Handling

All error responses follow this format:

```json
{
  "error": "Error message describing what went wrong"
}
```

**Common HTTP Status Codes**:
- `200 OK`: Request successful
- `201 Created`: Resource created successfully
- `400 Bad Request`: Invalid request data
- `401 Unauthorized`: Missing or invalid authentication
- `403 Forbidden`: Access denied
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server error

---

## Testing Endpoints

### Using cURL

**Register**:
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "Pass123",
    "confirmPassword": "Pass123"
  }'
```

**Login**:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "Pass123"
  }'
```

**Create Booking** (replace TOKEN with actual JWT):
```bash
curl -X POST http://localhost:5000/api/book-room \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "roomType": "Double",
    "checkInDate": "2026-01-15",
    "checkOutDate": "2026-01-20"
  }'
```

**Get Bookings** (replace TOKEN with actual JWT):
```bash
curl -X GET http://localhost:5000/api/bookings \
  -H "Authorization: Bearer TOKEN"
```

### Using Postman

1. Import the API collection from this repository
2. Set `base_url` variable to `http://localhost:5000/api`
3. Set `token` variable with JWT from login response
4. Run requests from collection

---

## Rate Limiting

Currently, there is no rate limiting implemented. For production deployment, consider adding:

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

---

## Pagination

List endpoints support pagination:

```
GET /bookings?page=2&limit=5
```

**Parameters**:
- `page`: Page number (starts at 1)
- `limit`: Items per page (default 10, max 100)

---

## Response Format

All successful responses include:
- Status code (200, 201, etc.)
- Data or message
- Optional metadata (timestamps, IDs)

All error responses include:
- Status code (400, 401, 404, 500, etc.)
- Error message

---

## API Version

**Current Version**: 1.0.0
**Last Updated**: January 2026
**Status**: Stable, Production Ready

---

## Support

For API issues or questions:
- Check GitHub Issues: https://github.com/krisp619/hotel-management-system/issues
- Review API_DOCUMENTATION.md for detailed specs
- Check test-e2e.ps1 for working examples
