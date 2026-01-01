# Production Backend Structure

This is the production-ready Node.js/Express backend for the Hotel Management System, deployed on AWS EC2.

## Directory Structure
```
backend/
├── config/
│   ├── database.js        # MongoDB connection configuration
│   └── environment.js     # Environment variables validation
├── models/
│   ├── User.js           # User schema and model
│   └── Booking.js        # Booking schema and model
├── routes/
│   ├── auth.js           # Authentication endpoints
│   └── bookings.js       # Booking management endpoints
├── middleware/
│   ├── auth.js           # JWT authentication middleware
│   ├── errorHandler.js   # Global error handling
│   └── validation.js     # Request validation
├── controllers/
│   ├── authController.js      # Auth logic
│   └── bookingController.js   # Booking logic
├── utils/
│   ├── logger.js         # Logging utility
│   └── responseHandler.js # Standardized response format
├── .env                  # Environment variables (DO NOT COMMIT)
├── .env.example          # Example environment file
├── .gitignore            # Git ignore rules
├── server.js             # Main application file
├── package.json          # Dependencies
└── README.md             # Deployment instructions
```

## Files Overview

### Core Files
- **server.js** - Express app initialization, middleware setup, route mounting
- **config/database.js** - MongoDB connection with retry logic
- **config/environment.js** - Environment validation and defaults
- **.env.example** - Template for required environment variables

### Models (MongoDB Schemas)
- **models/User.js** - User authentication data with bcrypt hashing
- **models/Booking.js** - Room booking data with date validation

### Routes & Controllers
- **routes/auth.js** - Register, Login endpoints
- **routes/bookings.js** - Create, Read, Update, Delete bookings
- **controllers/authController.js** - Business logic for authentication
- **controllers/bookingController.js** - Business logic for bookings

### Middleware
- **middleware/auth.js** - JWT verification and user extraction
- **middleware/errorHandler.js** - Centralized error handling
- **middleware/validation.js** - Request data validation

### Utilities
- **utils/logger.js** - Structured logging for debugging
- **utils/responseHandler.js** - Consistent API response format

## Features Implemented

✅ **Security**
- JWT-based authentication
- Password hashing with bcrypt
- CORS protection
- Input validation and sanitization
- Environment variable protection

✅ **Performance**
- MongoDB connection pooling
- Error handling and graceful degradation
- Request validation middleware
- Proper HTTP status codes

✅ **Scalability**
- Modular code structure
- Separated concerns (models, controllers, routes)
- Environment-based configuration
- PM2 process management ready

✅ **Maintainability**
- Comprehensive error messages
- Structured logging
- Standard response format
- Well-documented code

## Deployment

### AWS EC2 Setup
1. Launch t2.micro instance (Free Tier)
2. Open ports: 22 (SSH), 80 (HTTP), 5000 (Node.js)
3. Install Node.js v18+
4. Clone repository and install dependencies
5. Configure .env file with MongoDB URI
6. Start with: `node server.js`
7. Use PM2 for persistence: `pm2 start server.js`

### Environment Variables Required
```
PORT=5000
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/hotel-management
NODE_ENV=production
JWT_SECRET=your-secret-key
FRONTEND_URL=http://localhost:3000
```

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/auth/register | No | User registration |
| POST | /api/auth/login | No | User login |
| POST | /api/bookings | Yes | Create booking |
| GET | /api/bookings | Yes | Get user bookings |
| GET | /api/bookings/:id | Yes | Get booking details |
| PUT | /api/bookings/:id | Yes | Update booking |
| DELETE | /api/bookings/:id | Yes | Delete booking |
| GET | /api/health | No | Health check |

## Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { /* response data */ }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "error": "error_code"
}
```

## Testing

Start server locally:
```bash
node server.js
```

Test endpoints:
```bash
curl http://localhost:5000/api/health
```

## Monitoring

With PM2:
```bash
pm2 start server.js
pm2 monitor
pm2 logs
```

## Next Steps

1. Add request rate limiting
2. Implement Redis caching
3. Add email notifications
4. Implement payment processing
5. Add image upload for rooms
6. Implement advanced booking calendar
