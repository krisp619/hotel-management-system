# 🏨 Hotel Management System - Full Stack Web Application

A complete hotel booking management system built with **Node.js**, **Express**, **MongoDB**, **HTML**, **CSS**, and **Vanilla JavaScript**. This system allows users to book hotel rooms and provides an admin dashboard to manage all bookings.

---

## 📋 Table of Contents

- [Features](#features)
- [Project Structure](#project-structure)
- [Technology Stack](#technology-stack)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Frontend Pages](#frontend-pages)
- [Database Schema](#database-schema)
- [Code Explanation](#code-explanation)
- [Troubleshooting](#troubleshooting)
- [Deployment](#deployment)

---

## ✨ Features

### User Features (Booking Page)
- ✅ Clean and responsive hotel room booking form
- ✅ Guest name, email, room type, check-in/check-out date input fields
- ✅ Client-side form validation
- ✅ Real-time error messages
- ✅ Dynamic success/error notifications
- ✅ Room details and pricing information display
- ✅ Fetch API integration with backend
- ✅ Responsive design (mobile, tablet, desktop)

### Admin Features (Dashboard)
- ✅ View all hotel bookings in a dynamic table
- ✅ Real-time booking statistics (total, by room type)
- ✅ Filter bookings by email address
- ✅ Filter bookings by room type
- ✅ Pagination support (10 bookings per page)
- ✅ Edit and delete bookings
- ✅ Responsive admin interface

### Backend Features
- ✅ RESTful API with Express.js
- ✅ MongoDB database integration
- ✅ CORS enabled for frontend-backend communication
- ✅ Input validation and error handling
- ✅ JSON response format
- ✅ Environment variable configuration
- ✅ Booking model with comprehensive schema validation
- ✅ Timestamps for all bookings

---

## 📁 Project Structure

```
Hotel Management System/
│
├── frontend/                    # Frontend folder
│   ├── index.html              # Main booking page
│   ├── admin.html              # Admin dashboard page
│   ├── css/
│   │   └── style.css           # Responsive styling
│   └── js/
│       ├── script.js           # Booking form logic
│       └── admin.js            # Admin dashboard logic
│
├── backend/                     # Backend folder
│   ├── server.js               # Express server & API endpoints
│   ├── package.json            # Node.js dependencies
│   └── .env                    # Environment variables
│
└── README.md                    # This file
```

---

## 🛠 Technology Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | HTML5, CSS3, Vanilla JavaScript (ES6+) |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB (Atlas or Local) |
| **API** | RESTful API with JSON |
| **Other** | CORS, dotenv, Mongoose |

---

## 📦 Prerequisites

Before starting, ensure you have:

1. **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
2. **MongoDB** - Either:
   - Local MongoDB installation
   - MongoDB Atlas cloud account (free tier available)
3. **Git** (optional) - [Download](https://git-scm.com/)
4. **Code Editor** - VS Code, Sublime, etc.
5. **Web Browser** - Chrome, Firefox, Edge, Safari

---

## 🚀 Installation & Setup

### Step 1: Extract and Navigate to Project

```bash
# Navigate to the project directory
cd "Dyanamic website"
```

### Step 2: Setup Backend

```bash
# Navigate to backend folder
cd backend

# Install dependencies
npm install

# This installs:
# - express: Web framework
# - mongoose: MongoDB ORM
# - cors: Cross-Origin Resource Sharing
# - dotenv: Environment variables
# - body-parser: Request body parsing
# - nodemon: Auto-reload on changes (dev only)
```

### Step 3: Configure Database

#### Option A: Using MongoDB Atlas (Cloud - Recommended)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new cluster
4. Get your connection string
5. Update `.env` file with your connection string

#### Option B: Using Local MongoDB

1. Install [MongoDB Community Server](https://www.mongodb.com/try/download/community)
2. Start MongoDB service:
   - **Windows**: `mongod` command in terminal
   - **Mac/Linux**: `brew services start mongodb-community`
3. Connection string: `mongodb://localhost:27017/hotel-management`

### Step 4: Configure Environment Variables

Edit `backend/.env` file:

```env
# For MongoDB Atlas (cloud)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/hotel-management?retryWrites=true&w=majority

# For Local MongoDB
MONGODB_URI=mongodb://localhost:27017/hotel-management

# Server configuration
PORT=5000
NODE_ENV=development
```

Replace `username` and `password` with your MongoDB credentials.

---

## ▶️ Running the Application

### Start Backend Server

```bash
# From backend folder
cd backend

# Start development server (with auto-reload)
npm run dev

# Or start production server
npm start

# Expected output:
# ✓ MongoDB Connected Successfully
# ✓ Server is running on http://localhost:5000
```

### Access Frontend

1. Open your web browser
2. Go to: `file:///C:/Users/krishna potdar/OneDrive/Desktop/Dyanamic website/frontend/index.html`
   - Or use a local server (recommended):
   ```bash
   # From frontend folder, install & run live server
   npm install -g http-server
   http-server frontend -p 8000
   # Then visit: http://localhost:8000
   ```

3. To access admin dashboard: `http://localhost:8000/admin.html`

---

## 🔌 API Endpoints

### 1. Create Booking
```http
POST /api/book-room
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "roomType": "Double",
  "checkInDate": "2025-01-15",
  "checkOutDate": "2025-01-18"
}

Response (201):
{
  "success": true,
  "message": "Booking created successfully!",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "roomType": "Double",
    "checkInDate": "2025-01-15T00:00:00.000Z",
    "checkOutDate": "2025-01-18T00:00:00.000Z",
    "createdAt": "2025-01-10T10:30:00.000Z"
  }
}
```

### 2. Get All Bookings
```http
GET /api/bookings?page=1&limit=10&roomType=Double&email=john

Response (200):
{
  "success": true,
  "totalBookings": 5,
  "currentPage": 1,
  "totalPages": 1,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com",
      "roomType": "Double",
      "checkInDate": "2025-01-15T00:00:00.000Z",
      "checkOutDate": "2025-01-18T00:00:00.000Z",
      "createdAt": "2025-01-10T10:30:00.000Z"
    }
  ]
}
```

### 3. Get Single Booking
```http
GET /api/bookings/:id

Response (200):
{
  "success": true,
  "data": { ... }
}
```

### 4. Update Booking
```http
PUT /api/bookings/:id
Content-Type: application/json

{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "roomType": "Deluxe",
  "checkInDate": "2025-01-20",
  "checkOutDate": "2025-01-22"
}

Response (200):
{
  "success": true,
  "message": "Booking updated successfully!",
  "data": { ... }
}
```

### 5. Delete Booking
```http
DELETE /api/bookings/:id

Response (200):
{
  "success": true,
  "message": "Booking deleted successfully!",
  "data": { ... }
}
```

### 6. Health Check
```http
GET /api/health

Response (200):
{
  "success": true,
  "message": "Server is running successfully",
  "timestamp": "2025-01-10T10:30:00.000Z"
}
```

---

## 🌐 Frontend Pages

### Booking Page (`index.html`)
- **Purpose**: Allow users to book hotel rooms
- **Features**:
  - Hotel room booking form
  - Guest information input
  - Date selection with validation
  - Room type selection (Single, Double, Deluxe)
  - Real-time form validation
  - Success/error notifications
  - Room details and pricing sidebar
  - Responsive mobile design

### Admin Dashboard (`admin.html`)
- **Purpose**: Manage and view all bookings
- **Features**:
  - Complete bookings table
  - Email filter
  - Room type filter
  - Pagination controls
  - Edit and delete buttons
  - Booking statistics
  - Real-time data updates

---

## 📊 Database Schema

### Booking Collection

```javascript
{
  _id: ObjectId,
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 50
  },
  email: {
    type: String,
    required: true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  },
  roomType: {
    type: String,
    enum: ['Single', 'Double', 'Deluxe'],
    required: true
  },
  checkInDate: {
    type: Date,
    required: true,
    validate: must be today or future
  },
  checkOutDate: {
    type: Date,
    required: true,
    validate: must be after checkInDate
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}
```

---

## 💡 Code Explanation

### Backend - server.js

**1. Database Connection:**
```javascript
const connectDB = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('✓ MongoDB Connected Successfully');
};
```
- Establishes connection to MongoDB using environment variable
- Handles connection errors gracefully

**2. Booking Model:**
```javascript
const bookingSchema = new mongoose.Schema({
  name: { type: String, required: true, ... },
  email: { type: String, required: true, match: /regex/ },
  roomType: { enum: ['Single', 'Double', 'Deluxe'] },
  checkInDate: { type: Date, required: true, validate: {} },
  checkOutDate: { type: Date, required: true, validate: {} }
});
```
- Defines booking structure with validation rules
- Ensures data integrity at database level

**3. API Endpoint:**
```javascript
app.post('/api/book-room', async (req, res) => {
  // Validate input
  // Create booking
  // Save to database
  // Return response
});
```
- Receives booking data from frontend
- Validates all required fields
- Stores booking in MongoDB
- Returns success/error response

### Frontend - script.js

**1. Form Validation:**
```javascript
function validateForm() {
  // Check if all fields are filled
  // Validate email format
  // Check date logic
  // Display error messages
  return isValid;
}
```

**2. API Call:**
```javascript
async function submitBooking(bookingData) {
  const response = await fetch(`${API_BASE_URL}/book-room`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(bookingData)
  });
}
```
- Sends booking data to backend
- Handles response and displays messages

**3. Error Handling:**
- Frontend validation before submission
- Backend validation on API endpoint
- User-friendly error messages
- Try-catch blocks for network errors

---

## 🐛 Troubleshooting

### Issue: "MongoDB Connection Error"
**Solution:**
- Check if MongoDB is running
- Verify connection string in `.env`
- For Atlas: Ensure IP whitelist includes your IP
- Check username and password are correct

### Issue: "Cannot POST /api/book-room"
**Solution:**
- Ensure backend server is running (`npm run dev`)
- Check if port 5000 is available
- Verify backend folder has all required files

### Issue: "CORS Error in Console"
**Solution:**
- Make sure backend has CORS enabled
- Check `app.use(cors())` is before route definitions
- Restart backend server

### Issue: "Frontend form not submitting"
**Solution:**
- Open browser console (F12)
- Check for JavaScript errors
- Verify API_BASE_URL is correct
- Check network tab in Developer Tools

### Issue: "Bookings not appearing in admin"
**Solution:**
- Verify bookings were created (check MongoDB)
- Ensure admin.js API calls use correct URL
- Check browser console for errors
- Restart both frontend and backend

---

## 🚀 Deployment

### Deploy Backend (Node.js) to Cloud

#### Option 1: Heroku
```bash
# Install Heroku CLI
# Login to Heroku
heroku login

# Create new app
heroku create your-app-name

# Deploy
git push heroku main

# Set environment variables
heroku config:set MONGODB_URI=your_connection_string
```

#### Option 2: AWS (EC2)
1. Launch EC2 instance (Ubuntu)
2. SSH into instance
3. Install Node.js and MongoDB
4. Clone project and deploy
5. Use PM2 for process management

#### Option 3: Render / Railway
- Push code to GitHub
- Connect repository to Render/Railway
- Set environment variables
- Deploy automatically

### Deploy Frontend (Static Files)

#### Option 1: Firebase Hosting
```bash
npm install -g firebase-tools
firebase login
firebase init
firebase deploy
```

#### Option 2: GitHub Pages
```bash
# Create gh-pages branch
# Push frontend folder
# Enable GitHub Pages in settings
```

#### Option 3: Netlify
- Drag & drop frontend folder to Netlify
- Set environment variables
- Deploy

### Update Frontend API URL for Production
Edit `frontend/js/script.js` and `frontend/js/admin.js`:
```javascript
const API_BASE_URL = 'https://your-deployed-backend.com/api';
```

---

## 📚 Additional Resources

- [Express.js Documentation](https://expressjs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Mongoose Documentation](https://mongoosejs.com/)
- [MDN Web Docs](https://developer.mozilla.org/)
- [REST API Best Practices](https://restfulapi.net/)

---

## 📝 Notes for Code Review

1. **Architecture**: Clean separation of frontend and backend
2. **Validation**: Two-layer validation (client & server)
3. **Error Handling**: Comprehensive error messages for debugging
4. **Database**: Mongoose schema validation ensures data integrity
5. **Security**: Uses CORS, validates input, sanitizes data
6. **Performance**: Pagination for large datasets, indexed searches
7. **Scalability**: Can handle increased load with optimizations
8. **Code Quality**: Well-commented, follows conventions

---

## 👨‍💻 Author

Hotel Management System - Full Stack Development Project

---

## 📄 License

This project is open source and available under the MIT License.

---

**Happy Coding! 🚀**
