# 🎨 Visual Project Guide

A visual representation of the Hotel Management System.

---

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         USER'S BROWSER                                   │
│                                                                           │
│  ┌──────────────────────┐                    ┌──────────────────────┐  │
│  │   BOOKING PAGE       │                    │  ADMIN DASHBOARD     │  │
│  │   (index.html)       │                    │  (admin.html)        │  │
│  │                      │                    │                      │  │
│  │ • Book Room Form     │                    │ • Bookings Table     │  │
│  │ • Name Input         │                    │ • Email Filter       │  │
│  │ • Email Input        │                    │ • Room Type Filter   │  │
│  │ • Room Type Select   │                    │ • Pagination         │  │
│  │ • Date Pickers       │                    │ • Statistics         │  │
│  │ • Room Details       │                    │ • Edit/Delete        │  │
│  │ • Submit Button      │                    │                      │  │
│  └──────────┬───────────┘                    └──────────┬───────────┘  │
│             │                                           │                │
│             │  Fetch API (JSON)                        │                │
│             ├─→ POST /api/book-room                   │                │
│             │                                          │                │
│             │                          Fetch API (JSON) │                │
│             │                          ←─ GET /api/bookings            │
│             │                                          │                │
└─────────────┼──────────────────────────────────────────┼────────────────┘
              │                                          │
              │         HTTP/HTTPS Communication         │
              │                                          │
              ▼                                          ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                      EXPRESS.JS SERVER                                   │
│                    (backend/server.js)                                   │
│                                                                           │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │ CORS Middleware → Body Parser → Route Handlers                    │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐                  │
│  │ POST Route   │  │ GET Route    │  │ PUT Route    │  DELETE Route    │
│  │ /book-room   │  │ /bookings    │  │ /bookings/:id│  /bookings/:id   │
│  └───────┬──────┘  └───────┬──────┘  └───────┬──────┘  └────────┬──────┘
│          │                 │                 │                  │       │
│  ┌───────▼─────────────────▼─────────────────▼──────────────────▼────┐ │
│  │              MONGOOSE VALIDATION LAYER                            │ │
│  │  • Check required fields                                          │ │
│  │  • Validate formats (email, dates)                                │ │
│  │  • Check business logic (dates, room types)                       │ │
│  │  • Transform data                                                 │ │
│  └───────┬────────────────────────────────────────────────────────────┘ │
│          │                                                              │
│  ┌───────▼────────────────────────────────────────────────────────────┐ │
│  │          DATABASE OPERATIONS (Mongoose)                           │ │
│  │  • booking.save()    → INSERT                                      │ │
│  │  • Booking.find()    → SELECT                                      │ │
│  │  • Booking.findById()  → SELECT by ID                              │ │
│  │  • Booking.updateOne() → UPDATE                                    │ │
│  │  • Booking.deleteOne() → DELETE                                    │ │
│  └───────┬────────────────────────────────────────────────────────────┘ │
│          │                                                              │
└──────────┼──────────────────────────────────────────────────────────────┘
           │
           │ MongoDB Protocol
           │
           ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                   MONGODB DATABASE                                      │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐  │
│  │ Collection: bookings                                            │  │
│  │ ┌─────────────────────────────────────────────────────────────┐ │  │
│  │ │ Document 1                                                  │ │  │
│  │ │ {                                                           │ │  │
│  │ │   _id: ObjectId(...),                                       │ │  │
│  │ │   name: "John Doe",                                         │ │  │
│  │ │   email: "john@example.com",                                │ │  │
│  │ │   roomType: "Double",                                       │ │  │
│  │ │   checkInDate: 2025-02-15,                                  │ │  │
│  │ │   checkOutDate: 2025-02-18,                                 │ │  │
│  │ │   createdAt: 2025-01-10,                                    │ │  │
│  │ │   updatedAt: 2025-01-10                                     │ │  │
│  │ │ }                                                           │ │  │
│  │ │                                                             │ │  │
│  │ │ Document 2, 3, 4, ... (More bookings)                       │ │  │
│  │ └─────────────────────────────────────────────────────────────┘ │  │
│  └─────────────────────────────────────────────────────────────────┘  │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## User Interaction Flow

### Booking a Room

```
START
  │
  ▼
┌─────────────────────────────────┐
│ User opens index.html           │
└─────────────────────────────────┘
  │
  ▼
┌─────────────────────────────────┐
│ Form loads with:                │
│ • Minimum date set to today     │
│ • Form fields visible           │
└─────────────────────────────────┘
  │
  ▼
┌─────────────────────────────────┐
│ User fills form:                │
│ • Name: John Doe                │
│ • Email: john@example.com       │
│ • Room: Double                  │
│ • Check-in: 2025-02-15          │
│ • Check-out: 2025-02-18         │
└─────────────────────────────────┘
  │
  ▼
┌─────────────────────────────────┐
│ User clicks "Book Room"         │
└─────────────────────────────────┘
  │
  ▼
┌─────────────────────────────────┐
│ CLIENT-SIDE VALIDATION          │
│ ✓ Name 2-50 chars              │
│ ✓ Email format valid            │
│ ✓ Room type selected            │
│ ✓ Dates valid                   │
│ ✓ Check-out > Check-in          │
└─────────────────────────────────┘
  │
  ├─ Validation fails
  │  │
  │  ▼
  │  Show error messages
  │  │
  │  └─ Back to form
  │
  └─ Validation passes
     │
     ▼
  ┌──────────────────────────────┐
  │ Show loading spinner          │
  │ Disable submit button         │
  └──────────────────────────────┘
     │
     ▼
  ┌──────────────────────────────┐
  │ Send POST request            │
  │ /api/book-room               │
  │ Content: JSON form data      │
  └──────────────────────────────┘
     │
     ├─ Network error
     │  │
     │  ▼
     │  Show: "Error connecting to server"
     │  │
     │  └─ Hide spinner, enable button
     │
     └─ Request successful
        │
        ▼
     ┌──────────────────────────────┐
     │ SERVER VALIDATION            │
     │ ✓ All fields present         │
     │ ✓ Email matches regex        │
     │ ✓ Room type in enum          │
     │ ✓ Dates are valid            │
     └──────────────────────────────┘
        │
        ├─ Validation fails
        │  │
        │  ▼
        │  Return 400 error
        │  │
        │  └─ Show error message
        │
        └─ Validation passes
           │
           ▼
        ┌──────────────────────────────┐
        │ Create Booking object        │
        │ with all data                │
        └──────────────────────────────┘
           │
           ▼
        ┌──────────────────────────────┐
        │ Save to MongoDB              │
        │ Database generates _id       │
        └──────────────────────────────┘
           │
           ├─ Database error
           │  │
           │  ▼
           │  Return 500 error
           │  │
           │  └─ Show error message
           │
           └─ Save successful
              │
              ▼
           ┌──────────────────────────────┐
           │ Return 201 Created           │
           │ With booking data & ID       │
           └──────────────────────────────┘
              │
              ▼
           ┌──────────────────────────────┐
           │ Frontend receives response   │
           │ Checks success flag          │
           └──────────────────────────────┘
              │
              ├─ Success
              │  │
              │  ▼
              │  ┌──────────────────────┐
              │  │ Show success message │
              │  │ "🎉 Booking created" │
              │  │ "ID: 607f1f77..."    │
              │  └──────────────────────┘
              │  │
              │  ▼
              │  Clear form
              │  │
              │  ▼
              │  Hide spinner
              │  │
              │  ▼
              │  Auto-hide message (5s)
              │  │
              │  └─ Ready for new booking
              │
              └─ Error
                 │
                 ▼
                 Show error message
                 │
                 ▼
                 Hide spinner
                 │
                 └─ Allow retry
```

---

## Admin Dashboard Flow

```
START
  │
  ▼
┌──────────────────────────────────┐
│ User opens admin.html            │
└──────────────────────────────────┘
  │
  ▼
┌──────────────────────────────────┐
│ DOMContentLoaded event fires     │
│ Calls fetchBookings(1)           │
└──────────────────────────────────┘
  │
  ▼
┌──────────────────────────────────┐
│ Show loading spinner             │
└──────────────────────────────────┘
  │
  ▼
┌──────────────────────────────────┐
│ Send GET /api/bookings           │
│ with page=1, limit=10            │
└──────────────────────────────────┘
  │
  ├─ Network error
  │  │
  │  ▼
  │  Show error message
  │  │
  │  └─ Hide spinner
  │
  └─ Success
     │
     ▼
  ┌────────────────────────────────┐
  │ Parse JSON response            │
  │ Extract data array             │
  └────────────────────────────────┘
     │
     ▼
  ┌────────────────────────────────┐
  │ Render table with bookings     │
  │ Create row for each            │
  │ Add action buttons             │
  └────────────────────────────────┘
     │
     ▼
  ┌────────────────────────────────┐
  │ Update statistics              │
  │ Count by room type             │
  │ Display in cards               │
  └────────────────────────────────┘
     │
     ▼
  ┌────────────────────────────────┐
  │ Update pagination              │
  │ Show current page              │
  │ Enable/disable buttons         │
  └────────────────────────────────┘
     │
     ▼
  ┌────────────────────────────────┐
  │ Hide spinner                   │
  │ Show table and controls        │
  │ Ready for user interaction     │
  └────────────────────────────────┘
     │
     ▼
  User can now:
  ├─ Filter by email
  ├─ Filter by room type
  ├─ Navigate pages
  ├─ Edit booking
  └─ Delete booking
```

---

## Data Structure Visualization

### Booking Document in MongoDB

```json
{
  "_id": ObjectId("507f1f77bcf86cd799439011"),
  "name": "John Doe",
  "email": "john@example.com",
  "roomType": "Double",
  "checkInDate": ISODate("2025-02-15T00:00:00Z"),
  "checkOutDate": ISODate("2025-02-18T00:00:00Z"),
  "createdAt": ISODate("2025-01-10T10:30:00Z"),
  "updatedAt": ISODate("2025-01-10T10:30:00Z"),
  "__v": 0
}
```

---

## Component Interaction Diagram

```
┌─────────────────────────────────────────────────────────────┐
│ FRONTEND                                                    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────┐                     ┌────────────────┐   │
│  │ HTML         │  ◄─── styled by ───►│  CSS           │   │
│  │ • Structure  │                     │  • Layout      │   │
│  │ • Forms      │                     │  • Colors      │   │
│  │ • Elements   │                     │  • Animation   │   │
│  └──────────────┘                     └────────────────┘   │
│         △                                                   │
│         │                                                   │
│         │ controlled by                                     │
│         │                                                   │
│  ┌──────┴──────────────────────────────────────────────┐   │
│  │              JAVASCRIPT                            │   │
│  │  • Event listeners                                 │   │
│  │  • Form validation                                 │   │
│  │  • API communication                               │   │
│  │  • DOM manipulation                                │   │
│  │  • State management                                │   │
│  └────────────────────┬────────────────────────────────┘   │
│                       │                                     │
└───────────────────────┼─────────────────────────────────────┘
                        │
                        │ Fetch API (JSON over HTTP)
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│ BACKEND (Express.js + Node.js)                              │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ MIDDLEWARE                                           │  │
│  │ • CORS                                               │  │
│  │ • Body Parser                                        │  │
│  │ • Error Handler                                      │  │
│  └────────────────────┬─────────────────────────────────┘  │
│                       │                                     │
│  ┌────────────────────▼─────────────────────────────────┐  │
│  │ ROUTE HANDLERS (6 endpoints)                         │  │
│  │ • POST /api/book-room                                │  │
│  │ • GET /api/bookings                                  │  │
│  │ • GET /api/bookings/:id                              │  │
│  │ • PUT /api/bookings/:id                              │  │
│  │ • DELETE /api/bookings/:id                           │  │
│  │ • GET /api/health                                    │  │
│  └────────────────────┬─────────────────────────────────┘  │
│                       │                                     │
│  ┌────────────────────▼─────────────────────────────────┐  │
│  │ MONGOOSE (ODM)                                       │  │
│  │ • Schema validation                                  │  │
│  │ • Data transformation                                │  │
│  │ • Model methods                                      │  │
│  └────────────────────┬─────────────────────────────────┘  │
│                       │                                     │
└───────────────────────┼─────────────────────────────────────┘
                        │
                        │ MongoDB Protocol
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│ DATABASE (MongoDB)                                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Collection: bookings                                       │
│  • Stores all booking documents                             │
│  • Automatic indexing                                       │
│  • Timestamps on all records                                │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Request/Response Cycle

```
┌─ BOOKING A ROOM ────────────────────────────────────────────┐
│                                                              │
│ REQUEST:                                                     │
│ ────────                                                     │
│ Method: POST                                                 │
│ URL: http://localhost:5000/api/book-room                     │
│ Headers: Content-Type: application/json                      │
│ Body:                                                        │
│   {                                                          │
│     "name": "John Doe",                                      │
│     "email": "john@example.com",                             │
│     "roomType": "Double",                                    │
│     "checkInDate": "2025-02-15",                             │
│     "checkOutDate": "2025-02-18"                             │
│   }                                                          │
│                                                              │
│  ──────────────────────────────────────────────             │
│                                                              │
│ RESPONSE:                                                    │
│ ────────                                                     │
│ Status Code: 201 Created                                     │
│ Headers: Content-Type: application/json                      │
│ Body:                                                        │
│   {                                                          │
│     "success": true,                                         │
│     "message": "Booking created successfully!",              │
│     "data": {                                                │
│       "_id": "507f1f77bcf86cd799439011",                     │
│       "name": "John Doe",                                    │
│       "email": "john@example.com",                           │
│       "roomType": "Double",                                  │
│       "checkInDate": "2025-02-15T00:00:00.000Z",             │
│       "checkOutDate": "2025-02-18T00:00:00.000Z",            │
│       "createdAt": "2025-01-10T10:30:00.000Z"                │
│     }                                                        │
│   }                                                          │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## File Dependency Graph

```
index.html
    │
    ├─→ css/style.css (styles the form)
    │
    └─→ js/script.js (adds functionality)
            │
            └─→ Requires: Backend API at http://localhost:5000


admin.html
    │
    ├─→ css/style.css (styles the dashboard)
    │
    └─→ js/admin.js (adds functionality)
            │
            └─→ Requires: Backend API at http://localhost:5000


server.js
    │
    ├─→ package.json (defines dependencies)
    │   │
    │   └─→ Dependencies:
    │       ├─ express
    │       ├─ mongoose
    │       ├─ cors
    │       ├─ dotenv
    │       └─ body-parser
    │
    ├─→ .env (configuration)
    │
    └─→ MongoDB Database
        │
        └─→ Stores Booking documents
```

---

## Technology Stack Visualization

```
┌──────────────────────────────────────────────────────────────┐
│                    HOTEL MANAGEMENT SYSTEM                   │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ PRESENTATION LAYER                                  │   │
│  │ ─────────────────────────────────────────────────   │   │
│  │ HTML5  │  CSS3  │  JavaScript (ES6+)                │   │
│  │ Forms  │ Layout │  Fetch API, DOM, Validation       │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ APPLICATION LAYER                                   │   │
│  │ ─────────────────────────────────────────────────   │   │
│  │ Node.js  │  Express.js  │  Mongoose                 │   │
│  │ Runtime  │  Web Server  │  MongoDB ORM              │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ DATA LAYER                                          │   │
│  │ ─────────────────────────────────────────────────   │   │
│  │ MongoDB (NoSQL Document Database)                   │   │
│  │ Collections: bookings                               │   │
│  │ Documents: Booking records                          │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

## Process Flow (Simplified)

```
USER ACTION
     │
     ▼
BROWSER (Frontend)
  ├─ HTML: Structure
  ├─ CSS: Styling
  └─ JavaScript: Logic & Interaction
     │
     ├─ Validation
     │
     └─ API Call (Fetch)
        │
        ▼
SERVER (Backend)
  ├─ Receives Request
  ├─ Express: Routes
  ├─ Mongoose: Validation & Transform
  │
  ├─ Database Operation
  │
  └─ Sends Response
     │
     ▼
BROWSER (Frontend)
  ├─ Receives Response
  ├─ Parse JSON
  ├─ Update UI
  │
  └─ Show Result
```

---

## Complete Project Overview

```
                    HOTEL MANAGEMENT SYSTEM
                            │
                ┌───────────┴───────────┐
                │                       │
            FRONTEND              BACKEND
         (User Interface)     (Business Logic)
                │                       │
        ┌──────┬────┐           ┌──────┬────┐
        │      │    │           │      │    │
      HTML   CSS   JS        Express Mongoose
      Page  Style  Logic      Server  Model
        │      │    │           │      │
        └──────┼────┴─────┬─────┴──────┘
               │          │
          Styling    API Calls
               │          │
               └─────┬────┘
                     │
                   JSON
                   Data
                     │
                     ▼
               MONGODB DATABASE
               (Data Storage)
```

---

This visual guide provides multiple perspectives of how the Hotel Management System works together!

**Happy coding!** 🎨📊
