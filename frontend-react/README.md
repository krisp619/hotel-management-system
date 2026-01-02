# Hotel Management React Frontend

Modern React-based frontend for the Hotel Management System.

## Features

- User Authentication (Login/Register)
- Room Browsing and Booking
- Booking Management (View, Edit, Delete)
- Protected Routes
- JWT Token Management
- Responsive Design

## Requirements

- Node.js 16+
- npm or yarn

## Installation

```bash
cd frontend-react
npm install
```

## Configuration

Update `.env` with your backend API URL:

```
VITE_API_BASE_URL=http://23.22.102.15:5000
```

## Running the Application

### Development Mode

```bash
npm run dev
```

Starts dev server at `http://localhost:3000`

### Production Build

```bash
npm run build
```

Builds optimized production bundle in `dist/` folder.

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
src/
├── api/              # API service with axios
├── components/       # Reusable React components
│   ├── Header.jsx    # Navigation header
│   └── ProtectedRoute.jsx
├── hooks/           # Custom React hooks
│   └── useAuth.js   # Authentication hook
├── pages/           # Page components
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── Dashboard.jsx
│   └── Bookings.jsx
├── App.jsx          # Main app component with routing
├── main.jsx         # Entry point
└── App.css          # Global styles
```

## API Integration

All API calls go through `src/api/index.js` with centralized error handling and token management.

### Available API Methods

```javascript
// Authentication
authAPI.register(data)
authAPI.login(data)

// Bookings
bookingAPI.createBooking(data)
bookingAPI.getBookings(page, limit)
bookingAPI.getBookingById(id)
bookingAPI.updateBooking(id, data)
bookingAPI.deleteBooking(id)

// Health Check
healthAPI.check()
```

## Authentication

- JWT token stored in localStorage
- Automatically attached to all requests via axios interceptor
- Protected routes redirect unauthenticated users to login
- Logout clears token and user data

## Deployment

Build the app:

```bash
npm run build
```

Deploy the `dist/` folder to any static hosting (Netlify, Vercel, AWS S3, etc.)

### Environment Variables for Deployment

Set `VITE_API_BASE_URL` as environment variable or in `.env.production`

## Technologies

- React 18
- React Router v6
- Axios
- Vite
- CSS Modules

## Notes

- Backend CORS must allow requests from frontend URL
- Backend health check: `GET /api/health`
- All authenticated endpoints require valid JWT token
