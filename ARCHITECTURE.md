# 🏗️ Architecture & Data Flow Guide

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    USER'S WEB BROWSER                        │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────┐          ┌──────────────────┐         │
│  │  index.html      │          │   admin.html     │         │
│  │  (Booking Page)  │          │  (Dashboard)     │         │
│  └────────┬─────────┘          └────────┬─────────┘         │
│           │                             │                    │
│  ┌────────▼──────────┐         ┌────────▼──────────┐        │
│  │ style.css         │         │ style.css         │        │
│  │ (Styling)         │         │ (Styling)         │        │
│  └────────┬──────────┘         └────────┬──────────┘        │
│           │                             │                    │
│  ┌────────▼──────────┐         ┌────────▼──────────┐        │
│  │ script.js         │         │ admin.js          │        │
│  │ • Form validation │         │ • Fetch bookings  │        │
│  │ • Fetch API calls │         │ • Display table   │        │
│  │ • Error handling  │         │ • Edit/Delete     │        │
│  └────────┬──────────┘         └────────┬──────────┘        │
│           │                             │                    │
└───────────┼─────────────────────────────┼───────────────────┘
            │                             │
            │   HTTP/HTTPS                │
            │   ┌──────────────────────┐  │
            │   │ REST API Calls       │  │
            │   │ (JSON)               │  │
            │   └──────┬───────────────┘  │
            │          │                   │
            └──────────┼───────────────────┘
                       │
        ┌──────────────▼──────────────┐
        │  EXPRESS.JS SERVER          │
        │  (Backend - Node.js)        │
        ├──────────────────────────────┤
        │                              │
        │  ┌──────────────────────┐   │
        │  │  CORS Middleware     │   │
        │  │  (Allow requests)    │   │
        │  └──────────────────────┘   │
        │                              │
        │  ┌──────────────────────┐   │
        │  │  Route Handlers      │   │
        │  │  • POST /book-room   │   │
        │  │  • GET /bookings     │   │
        │  │  • PUT /bookings/:id │   │
        │  │  • DELETE /bookings  │   │
        │  └─────────────┬────────┘   │
        │                │             │
        │  ┌─────────────▼────────┐   │
        │  │  Mongoose Models     │   │
        │  │  • Validate data     │   │
        │  │  • Transform data    │   │
        │  └─────────────┬────────┘   │
        │                │             │
        └────────────────┼─────────────┘
                         │
                HTTP Driver
                (MongoDB Protocol)
                         │
        ┌────────────────▼──────────────┐
        │  MONGODB DATABASE             │
        │  (Data Storage)               │
        ├───────────────────────────────┤
        │                               │
        │  Collection: bookings         │
        │  ├── _id                      │
        │  ├── name                     │
        │  ├── email                    │
        │  ├── roomType                 │
        │  ├── checkInDate              │
        │  ├── checkOutDate             │
        │  ├── createdAt                │
        │  └── updatedAt                │
        │                               │
        └───────────────────────────────┘
```

---

## Complete Data Flow

### 1. User Books a Room

```
USER ACTION
    │
    ▼
┌─────────────────────────────────────┐
│ User fills booking form:             │
│ - Name: John Doe                    │
│ - Email: john@example.com           │
│ - Room: Double                      │
│ - Check-in: 2025-01-15              │
│ - Check-out: 2025-01-18             │
│ - Clicks "Book Room"                │
└──────────────┬──────────────────────┘
               │
               ▼
┌──────────────────────────────────────┐
│ FRONTEND VALIDATION (script.js)       │
│ ✓ Check name (2-50 chars)            │
│ ✓ Validate email format              │
│ ✓ Room type selected                 │
│ ✓ Dates valid & in future            │
│ ✓ Check-out > Check-in               │
│ ✓ All fields filled                  │
└──────────────┬──────────────────────┘
               │
        If validation fails:
               │────► Show error message
               │
        If validation passes:
               │
               ▼
┌──────────────────────────────────────┐
│ SEND API REQUEST                      │
│ POST /api/book-room                  │
│ Headers: Content-Type: application/json│
│ Body: {                              │
│   "name": "John Doe",                │
│   "email": "john@example.com",       │
│   "roomType": "Double",              │
│   "checkInDate": "2025-01-15",       │
│   "checkOutDate": "2025-01-18"       │
│ }                                    │
└──────────────┬──────────────────────┘
               │
            Network
               │
               ▼
┌──────────────────────────────────────┐
│ BACKEND PROCESSING (server.js)        │
│ POST /api/book-room handler          │
│                                      │
│ 1. Extract request body              │
│ 2. Validate all fields               │
│ 3. Check date validity               │
│ 4. Validate email format             │
└──────────────┬──────────────────────┘
               │
        If validation fails:
               │────► Send 400 error response
               │
        If validation passes:
               │
               ▼
┌──────────────────────────────────────┐
│ CREATE MONGOOSE DOCUMENT              │
│ const booking = new Booking({         │
│   name: "John Doe",                  │
│   email: "john@example.com",         │
│   roomType: "Double",                │
│   checkInDate: Date(2025-01-15),     │
│   checkOutDate: Date(2025-01-18),    │
│   createdAt: Date.now()              │
│ })                                   │
└──────────────┬──────────────────────┘
               │
               ▼
┌──────────────────────────────────────┐
│ SAVE TO DATABASE                      │
│ booking.save()                       │
│ await booking.save()                 │
└──────────────┬──────────────────────┘
               │
            MongoDB
            Protocol
               │
               ▼
┌──────────────────────────────────────┐
│ DATABASE OPERATION                    │
│                                      │
│ INSERT document into bookings        │
│ collection with:                     │
│ - Generated _id (ObjectId)           │
│ - All provided fields                │
│ - Timestamps                         │
└──────────────┬──────────────────────┘
               │
      Success / Error
               │
               ▼
┌──────────────────────────────────────┐
│ SEND RESPONSE TO FRONTEND             │
│ Status: 201 Created                  │
│ {                                    │
│   "success": true,                   │
│   "message": "Booking created!",     │
│   "data": {                          │
│     "_id": "607f1f77bcf86cd799439011",
│     "name": "John Doe",              │
│     "email": "john@example.com",     │
│     ...                              │
│   }                                  │
│ }                                    │
└──────────────┬──────────────────────┘
               │
            Network
               │
               ▼
┌──────────────────────────────────────┐
│ FRONTEND RECEIVES RESPONSE            │
│ (script.js - submitBooking function) │
│                                      │
│ Check response.ok === true           │
│ Check result.success === true        │
└──────────────┬──────────────────────┘
               │
        If success:
               │
               ▼
┌──────────────────────────────────────┐
│ SHOW SUCCESS MESSAGE                  │
│ "🎉 Booking created successfully!   │
│ Booking ID: 607f1f77"                │
│                                      │
│ Clear form fields                    │
│ Hide loading spinner                 │
│ Auto-hide message after 5 seconds    │
└──────────────────────────────────────┘
```

---

### 2. Admin Views All Bookings

```
ADMIN VISITS DASHBOARD
    │
    ▼
┌────────────────────────────┐
│ admin.html loads           │
│ admin.js executes          │
│ DOMContentLoaded event     │
│ → fetchBookings(1)         │
└────────────┬───────────────┘
             │
             ▼
┌────────────────────────────┐
│ SEND API REQUEST           │
│ GET /api/bookings          │
│ Query params:              │
│ - page=1                   │
│ - limit=10                 │
│ - email= (optional)        │
│ - roomType= (optional)     │
└────────────┬───────────────┘
             │
          Network
             │
             ▼
┌────────────────────────────┐
│ BACKEND HANDLER            │
│ GET /api/bookings          │
│                            │
│ 1. Build filter object     │
│ 2. Count total documents   │
│ 3. Fetch with pagination   │
│ 4. Sort by newest first    │
└────────────┬───────────────┘
             │
             ▼
┌────────────────────────────┐
│ MONGODB QUERY              │
│                            │
│ db.bookings.find(filter)   │
│   .limit(10)               │
│   .skip(0)                 │
│   .sort({createdAt: -1})   │
└────────────┬───────────────┘
             │
          Database
             │
             ▼
┌────────────────────────────┐
│ RETURN RESULTS             │
│ Array of 10 bookings       │
│ Total count: 25            │
│ Pages: 3                   │
└────────────┬───────────────┘
             │
             ▼
┌────────────────────────────┐
│ SEND RESPONSE              │
│ Status: 200 OK             │
│ {                          │
│   "success": true,         │
│   "totalBookings": 25,     │
│   "currentPage": 1,        │
│   "totalPages": 3,         │
│   "data": [                │
│     { booking1 },          │
│     { booking2 },          │
│     ...                    │
│   ]                        │
│ }                          │
└────────────┬───────────────┘
             │
          Network
             │
             ▼
┌────────────────────────────┐
│ FRONTEND RECEIVES DATA     │
│ (admin.js)                 │
│                            │
│ Parse JSON response        │
│ Extract bookings array     │
│ Update statistics          │
└────────────┬───────────────┘
             │
             ▼
┌────────────────────────────┐
│ RENDER DATA IN TABLE       │
│                            │
│ Clear existing rows        │
│ Loop through bookings      │
│ Create table row for each  │
│ Add action buttons         │
│ Set pagination buttons     │
└────────────┬───────────────┘
             │
             ▼
┌────────────────────────────┐
│ DISPLAY IN BROWSER         │
│ Show bookings table        │
│ Show pagination controls   │
│ Show statistics cards      │
│ Enable filters             │
└────────────────────────────┘
```

---

## Code Components

### Frontend Components

1. **script.js (Booking Form)**
   - `validateForm()` - Client-side validation
   - `submitBooking()` - API call to backend
   - `showSuccessMessage()` - Display success
   - `showErrorMessage()` - Display errors
   - `resetForm()` - Clear form after submission

2. **admin.js (Dashboard)**
   - `fetchBookings()` - GET all bookings
   - `renderBookings()` - Populate table
   - `deleteBooking()` - Delete API call
   - `calculateStatistics()` - Update stats
   - Filter and pagination logic

### Backend Components

1. **server.js (Express API)**
   - `connectDB()` - MongoDB connection
   - `bookingSchema` - Data structure
   - `Booking` model - Database model
   - Route handlers (POST, GET, PUT, DELETE)
   - Error handling middleware

### Database Components

1. **MongoDB Collections**
   - `bookings` - Stores all booking records
   - Indexes on email and roomType
   - Timestamps for each record

---

## Error Handling Flow

```
ERROR OCCURS
    │
    ├─── Network Error
    │    └─► Catch in try-catch
    │        └─► "Error connecting to server"
    │
    ├─── Validation Error
    │    ├─► Frontend: Show field errors
    │    └─► Backend: Return 400 status
    │
    ├─── Database Error
    │    └─► Backend: Log error
    │        └─► Return 500 status
    │
    └─── 404 Error
         └─► Route not found
             └─► Return 404 status
```

---

## Security Features

1. **Input Validation**
   - Frontend: Regex validation
   - Backend: Mongoose schema validation
   - Email format verification
   - Date range validation

2. **Error Messages**
   - User-friendly messages
   - No sensitive information exposed
   - Secure error logging

3. **CORS Security**
   - Limited to allowed origins
   - Controls cross-origin requests

4. **Database Security**
   - Connection string in .env
   - No credentials in code
   - Parameterized queries (via Mongoose)

---

## Performance Optimization

1. **Pagination**
   - Load 10 bookings per page
   - Reduces memory usage
   - Faster response times

2. **Indexing**
   - Email index for quick searches
   - Room type index for filtering

3. **Lazy Loading**
   - Load data on demand
   - Filter reduces dataset size

---

## State Management

### Frontend State:
- Form input values
- Validation errors
- Loading status
- Message visibility
- Current page number

### Backend State:
- Active database connection
- Request validation state
- Response status

### Database State:
- All booking documents
- Metadata (timestamps)
- Indexes for queries

---

This architecture ensures:
- ✅ Clean separation of concerns
- ✅ Scalability
- ✅ Maintainability
- ✅ Security
- ✅ Performance
