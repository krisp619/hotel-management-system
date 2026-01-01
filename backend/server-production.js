/**
 * Hotel Management System - Production Backend
 * AWS EC2 Deployment Ready
 * 
 * Features:
 * - JWT Authentication
 * - MongoDB Integration
 * - Error Handling
 * - CORS Protection
 * - Environment Configuration
 */

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const morgan = require('morgan');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// ============================================
// MIDDLEWARE
// ============================================

// Security middleware
app.use(helmet()); // Set security HTTP headers

// Logging middleware
app.use(morgan('combined')); // Log HTTP requests

// CORS configuration
const corsOptions = {
  origin: process.env.FRONTEND_URL || '*',
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ============================================
// DATABASE CONNECTION
// ============================================

const connectDB = async () => {
  try {
    const mongooseOptions = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    };
    
    await mongoose.connect(process.env.MONGODB_URI, mongooseOptions);
    console.log('✓ MongoDB Connected Successfully');
    console.log(`Database: ${mongoose.connection.name}`);
  } catch (error) {
    console.error('✗ MongoDB Connection Error:', error.message);
    // Retry connection after 5 seconds
    setTimeout(connectDB, 5000);
  }
};

// Connect to MongoDB
connectDB();

// MongoDB connection events
mongoose.connection.on('connected', () => {
  console.log('✓ MongoDB connection established');
});

mongoose.connection.on('error', (err) => {
  console.error('✗ MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.warn('⚠ MongoDB disconnected');
});

// ============================================
// SCHEMAS
// ============================================

// User Schema
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email']
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false // Don't return password by default
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

// Booking Schema
const bookingSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    guest_name: {
      type: String,
      required: [true, 'Guest name is required'],
      minlength: 2
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email']
    },
    room_type: {
      type: String,
      enum: ['Single', 'Double', 'Deluxe'],
      required: [true, 'Room type is required']
    },
    check_in: {
      type: Date,
      required: [true, 'Check-in date is required']
    },
    check_out: {
      type: Date,
      required: [true, 'Check-out date is required']
    },
    guests: {
      type: Number,
      min: [1, 'At least 1 guest required'],
      max: [10, 'Maximum 10 guests allowed'],
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled'],
      default: 'confirmed'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

// Create models
const User = mongoose.model('User', userSchema);
const Booking = mongoose.model('Booking', bookingSchema);

// ============================================
// AUTHENTICATION UTILITIES
// ============================================

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Hash password
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

// Verify password
const verifyPassword = async (password, hashedPassword) => {
  return bcrypt.compare(password, hashedPassword);
};

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET || 'your-secret-key-change-in-production',
    { expiresIn: '30d' }
  );
};

// Verify JWT token
const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key-change-in-production');
  } catch (error) {
    return null;
  }
};

// ============================================
// MIDDLEWARE - AUTHENTICATION
// ============================================

const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'No authorization token provided',
      error: 'UNAUTHORIZED'
    });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token',
      error: 'INVALID_TOKEN'
    });
  }

  req.userId = decoded.userId;
  next();
};

// ============================================
// ROUTES - AUTHENTICATION
// ============================================

// Register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, confirm_password } = req.body;

    // Validation
    if (!email || !password || !confirm_password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
        error: 'MISSING_FIELDS'
      });
    }

    if (password !== confirm_password) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match',
        error: 'PASSWORD_MISMATCH'
      });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Email already registered',
        error: 'EMAIL_EXISTS'
      });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const user = new User({
      email,
      password: hashedPassword
    });

    await user.save();

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        access_token: token,
        token_type: 'bearer',
        user: { id: user._id, email: user.email }
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Registration failed',
      error: 'SERVER_ERROR'
    });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
        error: 'MISSING_FIELDS'
      });
    }

    // Find user
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
        error: 'INVALID_CREDENTIALS'
      });
    }

    // Verify password
    const isPasswordValid = await verifyPassword(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
        error: 'INVALID_CREDENTIALS'
      });
    }

    // Generate token
    const token = generateToken(user._id);

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        access_token: token,
        token_type: 'bearer',
        user: { id: user._id, email: user.email }
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed',
      error: 'SERVER_ERROR'
    });
  }
});

// ============================================
// ROUTES - BOOKINGS
// ============================================

// Create booking
app.post('/api/bookings', authenticate, async (req, res) => {
  try {
    const { guest_name, email, room_type, check_in, check_out, guests } = req.body;

    // Validation
    if (!guest_name || !email || !room_type || !check_in || !check_out || !guests) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required',
        error: 'MISSING_FIELDS'
      });
    }

    // Validate room type
    if (!['Single', 'Double', 'Deluxe'].includes(room_type)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid room type',
        error: 'INVALID_ROOM_TYPE'
      });
    }

    // Validate dates
    const checkInDate = new Date(check_in);
    const checkOutDate = new Date(check_out);
    if (checkOutDate <= checkInDate) {
      return res.status(400).json({
        success: false,
        message: 'Check-out date must be after check-in date',
        error: 'INVALID_DATES'
      });
    }

    // Create booking
    const booking = new Booking({
      user_id: req.userId,
      guest_name,
      email,
      room_type,
      check_in: checkInDate,
      check_out: checkOutDate,
      guests
    });

    await booking.save();

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: { booking }
    });
  } catch (error) {
    console.error('Booking creation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create booking',
      error: 'SERVER_ERROR'
    });
  }
});

// Get user bookings
app.get('/api/bookings', authenticate, async (req, res) => {
  try {
    const { skip = 0, limit = 10 } = req.query;

    const bookings = await Booking.find({ user_id: req.userId })
      .sort({ createdAt: -1 })
      .skip(parseInt(skip))
      .limit(parseInt(limit));

    const total = await Booking.countDocuments({ user_id: req.userId });

    res.json({
      success: true,
      message: 'Bookings retrieved successfully',
      data: {
        bookings,
        pagination: {
          total,
          skip: parseInt(skip),
          limit: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Booking retrieval error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve bookings',
      error: 'SERVER_ERROR'
    });
  }
});

// Get booking details
app.get('/api/bookings/:id', authenticate, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
        error: 'NOT_FOUND'
      });
    }

    // Check ownership
    if (booking.user_id.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to access this booking',
        error: 'FORBIDDEN'
      });
    }

    res.json({
      success: true,
      message: 'Booking retrieved successfully',
      data: { booking }
    });
  } catch (error) {
    console.error('Booking retrieval error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve booking',
      error: 'SERVER_ERROR'
    });
  }
});

// Update booking
app.put('/api/bookings/:id', authenticate, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
        error: 'NOT_FOUND'
      });
    }

    // Check ownership
    if (booking.user_id.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to update this booking',
        error: 'FORBIDDEN'
      });
    }

    // Update fields
    const { guest_name, room_type, check_in, check_out, guests, status } = req.body;
    if (guest_name) booking.guest_name = guest_name;
    if (room_type) booking.room_type = room_type;
    if (check_in) booking.check_in = new Date(check_in);
    if (check_out) booking.check_out = new Date(check_out);
    if (guests) booking.guests = guests;
    if (status) booking.status = status;

    await booking.save();

    res.json({
      success: true,
      message: 'Booking updated successfully',
      data: { booking }
    });
  } catch (error) {
    console.error('Booking update error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update booking',
      error: 'SERVER_ERROR'
    });
  }
});

// Delete booking
app.delete('/api/bookings/:id', authenticate, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
        error: 'NOT_FOUND'
      });
    }

    // Check ownership
    if (booking.user_id.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to delete this booking',
        error: 'FORBIDDEN'
      });
    }

    await Booking.deleteOne({ _id: req.params.id });

    res.json({
      success: true,
      message: 'Booking deleted successfully'
    });
  } catch (error) {
    console.error('Booking deletion error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete booking',
      error: 'SERVER_ERROR'
    });
  }
});

// ============================================
// ROUTES - HEALTH & INFO
// ============================================

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is healthy',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API info
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Hotel Management System API',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    endpoints: {
      auth: '/api/auth',
      bookings: '/api/bookings',
      health: '/api/health'
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found',
    error: 'NOT_FOUND'
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    error: 'SERVER_ERROR'
  });
});

// ============================================
// START SERVER
// ============================================

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log('\n' + '='.repeat(50));
  console.log('Hotel Management System - Backend Server');
  console.log('='.repeat(50));
  console.log(`✓ Server running on port ${PORT}`);
  console.log(`✓ Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`✓ API URL: http://localhost:${PORT}`);
  console.log('='.repeat(50) + '\n');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(async () => {
    console.log('HTTP server closed');
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
    process.exit(0);
  });
});

module.exports = app;
