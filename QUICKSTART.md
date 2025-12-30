# 🚀 QUICK START GUIDE

## 5-Minute Setup

### Step 1: Install MongoDB (Choose One)

**Option A: Local MongoDB**
- Download from: https://www.mongodb.com/try/download/community
- Install and start MongoDB service

**Option B: MongoDB Atlas (Cloud)**
- Go to: https://www.mongodb.com/cloud/atlas
- Create free account and cluster
- Get connection string

---

### Step 2: Setup Backend

```bash
# Open PowerShell in backend folder
cd backend

# Install dependencies
npm install

# Update .env file with MongoDB connection string

# Start server
npm run dev
```

**Expected Output:**
```
✓ MongoDB Connected Successfully
✓ Server is running on http://localhost:5000
```

---

### Step 3: Access Frontend

**Option A: Direct File Access**
- Open: `C:\Users\krishna potdar\OneDrive\Desktop\Dyanamic website\frontend\index.html`

**Option B: Using HTTP Server (Recommended)**
```bash
# Install globally
npm install -g http-server

# From any terminal, run
http-server "C:\Users\krishna potdar\OneDrive\Desktop\Dyanamic website\frontend" -p 8000

# Open: http://localhost:8000
```

---

### Step 4: Test the Application

1. **Book a Room**
   - Fill in the form on the booking page
   - Click "Book Room"
   - See success message

2. **View Admin Dashboard**
   - Click "Admin Dashboard" in navigation
   - See all bookings
   - Try filters and pagination

---

## 📁 File Locations

```
C:\Users\krishna potdar\OneDrive\Desktop\Dyanamic website\
├── frontend/
│   ├── index.html (Booking page)
│   ├── admin.html (Admin dashboard)
│   ├── css/style.css
│   └── js/script.js & admin.js
│
└── backend/
    ├── server.js
    ├── package.json
    └── .env (Configure MongoDB here)
```

---

## ⚙️ Configuration

Edit `backend/.env`:

```env
# MongoDB Local
MONGODB_URI=mongodb://localhost:27017/hotel-management

# MongoDB Atlas (replace with your credentials)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/hotel-management?retryWrites=true&w=majority

PORT=5000
NODE_ENV=development
```

---

## 🔗 Important URLs

| Page | URL |
|------|-----|
| Booking | http://localhost:8000/index.html |
| Admin | http://localhost:8000/admin.html |
| API Health | http://localhost:5000/api/health |

---

## 🛠️ Troubleshooting

| Problem | Solution |
|---------|----------|
| "Cannot connect to server" | Check if `npm run dev` is running in backend |
| "MongoDB connection error" | Check .env file and MongoDB is running |
| "CORS error" | Restart backend server |
| "Page won't load" | Clear browser cache (Ctrl+Shift+Del) |

---

## 📚 Project Files Explanation

### Backend Files

**server.js** (Main backend file)
- Starts Express server
- Connects to MongoDB
- Defines all API endpoints
- Handles booking CRUD operations

**package.json**
- Lists all dependencies
- Defines npm scripts (start, dev)

**.env**
- Stores sensitive configuration
- MongoDB connection string
- Server port

### Frontend Files

**index.html** (Booking page)
- User booking form
- Room details display
- Responsive design

**admin.html** (Admin dashboard)
- Bookings table
- Filter and search
- Edit/delete buttons

**css/style.css**
- Complete styling
- Responsive design
- Mobile-friendly layout

**js/script.js** (Booking form logic)
- Form validation
- API communication
- Error handling
- Success messages

**js/admin.js** (Admin logic)
- Fetch bookings from API
- Pagination
- Filtering
- Delete functionality

---

## 📊 Database Schema

Every booking has:
- Guest Name (required, 2-50 characters)
- Email (required, valid format)
- Room Type (Single, Double, or Deluxe)
- Check-in Date (today or future)
- Check-out Date (after check-in)
- Created Date (automatic)

---

## 💡 How It Works

1. **User fills booking form** → Frontend validates input
2. **Clicks "Book Room"** → Frontend sends API request
3. **Backend receives request** → Validates and saves to MongoDB
4. **Database stores booking** → Returns success response
5. **Frontend shows message** → User sees confirmation
6. **Admin can view all bookings** → Via admin dashboard

---

## ✅ Project Checklist

- [x] Backend with Express.js
- [x] MongoDB integration
- [x] REST API endpoints
- [x] Frontend booking form
- [x] Admin dashboard
- [x] Form validation
- [x] Error handling
- [x] CORS enabled
- [x] Environment variables
- [x] Responsive design
- [x] API documentation
- [x] Code comments

---

## 🎉 You're Ready!

Start the backend, open the frontend, and book your first room!

For detailed documentation, see README.md
