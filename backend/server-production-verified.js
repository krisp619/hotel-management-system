const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
let mongodbConnected = false;

// ============================================
// MIDDLEWARE
// ============================================

// CORS Configuration - Production Safe
const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) {
      return callback(null, true);
    }

    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:5173',
      'http://127.0.0.1:3000',
      'http://127.0.0.1:5173',
      'http://hotel-frontend-krishna.s3-website-us-east-1.amazonaws.com',
      'https://hotel-frontend-krishna.s3-website-us-east-1.amazonaws.com',
    ];

    // Parse CORS_ORIGIN from .env if provided
    if (process.env.CORS_ORIGIN) {
      const envOrigins = process.env.CORS_ORIGIN.split(',').map(o => o.trim());
      allowedOrigins.push(...envOrigins);
    }

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`CORS blocked origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(cors(corsOptions));

// Handle preflight requests
app.options('*', cors(corsOptions));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware
app.use((req, res, next) => {
  const startTime = Date.now();
  
  // Set response timeout (prevent hanging requests)
  const responseTimeout = setTimeout(() => {
    if (!res.headersSent) {
      console.error(`TIMEOUT: ${req.method} ${req.path} - No response after 25 seconds`);
      res.status(504).json({ 
        success: false,
        error: 'Request timeout',
        code: 'TIMEOUT'
      });
    }
  }, 25000); // 25 second timeout
  
  // Track response completion
  const originalSend = res.send;
  res.send = function(data) {
    clearTimeout(responseTimeout);
    const duration = Date.now() - startTime;
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path} [${res.statusCode}] (${duration}ms)`);
    return originalSend.call(this, data);
  };
  
  next();
});

// ============================================
// MONGODB CONNECTION
// ============================================

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      console.error('✗ MONGODB_URI not set in .env');
      mongodbConnected = false;
      setTimeout(connectDB, 5000);
      return;
    }

    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      retryWrites: true,
      w: 'majority',
    });
    
    mongodbConnected = true;
    console.log('✓ MongoDB Connected Successfully');
  } catch (error) {
    mongodbConnected = false;
    console.error('✗ MongoDB Connection Error:', error.message);
    // Retry connection after 5 seconds
    setTimeout(connectDB, 5000);
  }
};

// Monitor MongoDB connection events
mongoose.connection.on('connected', () => {
  mongodbConnected = true;
  console.log('✓ Mongoose connected to MongoDB');
});

mongoose.connection.on('disconnected', () => {
  mongodbConnected = false;
  console.warn('✗ Mongoose disconnected from MongoDB');
});

mongoose.connection.on('error', (error) => {
  mongodbConnected = false;
  console.error('✗ MongoDB connection error:', error.message);
});

// Initialize MongoDB connection
connectDB();

// ============================================
// USER SCHEMA
// ============================================

const userSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true, 
    trim: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    lowercase: true,
    index: true,
  },
  password: { 
    type: String, 
    required: true, 
    select: false 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
});

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const User = mongoose.model('User', userSchema);

// ============================================
// AUTHENTICATION MIDDLEWARE
// ============================================

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    req.userId = decoded.userId;
    next();
  } catch (error) {
    console.error('Token verification failed:', error.message);
    res.status(403).json({ error: 'Invalid or expired token' });
  }
};

// ============================================
// BOOKING SCHEMA
// ============================================

const bookingSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true,
    index: true,
  },
  name: { 
    type: String, 
    required: true, 
    trim: true 
  },
  email: { 
    type: String, 
    required: true, 
    lowercase: true 
  },
  roomType: { 
    type: String, 
    enum: ['Single', 'Double', 'Deluxe'], 
    required: true 
  },
  checkInDate: { 
    type: Date, 
    required: true 
  },
  checkOutDate: { 
    type: Date, 
    required: true 
  },
  createdAt: { 
    type: Date, 
    default: Date.now,
    index: true,
  },
}, { timestamps: true });

const Booking = mongoose.model('Booking', bookingSchema);

// ============================================
// API ROUTES
// ============================================

// Health Check Endpoint - Production Ready
app.get('/api/health', (req, res) => {
  try {
    res.status(200).json({
      status: 'healthy',
      mongodb: mongodbConnected ? 'connected' : 'disconnected',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      uptime: process.uptime(),
    });
  } catch (error) {
    console.error('Health check error:', error);
    res.status(500).json({
      status: 'unhealthy',
      error: error.message,
    });
  }
});

// Register Endpoint
app.post('/api/auth/register', async (req, res) => {
  try {
    // Verify MongoDB is connected
    if (!mongodbConnected) {
      console.warn('Register: MongoDB not connected');
      return res.status(503).json({ 
        success: false,
        error: 'Database service temporarily unavailable',
        code: 'DB_UNAVAILABLE'
      });
    }

    const { name, email, password, confirmPassword } = req.body;
    
    // ========== VALIDATION ==========
    // Check required fields
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return res.status(400).json({ 
        success: false,
        error: 'Name is required and must be a non-empty string' 
      });
    }
    
    if (!email || typeof email !== 'string' || email.trim().length === 0) {
      return res.status(400).json({ 
        success: false,
        error: 'Email is required and must be a non-empty string' 
      });
    }
    
    if (!password || typeof password !== 'string' || password.length === 0) {
      return res.status(400).json({ 
        success: false,
        error: 'Password is required' 
      });
    }
    
    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        success: false,
        error: 'Invalid email format' 
      });
    }
    
    // Password validation
    if (password.length < 6) {
      return res.status(400).json({ 
        success: false,
        error: 'Password must be at least 6 characters' 
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ 
        success: false,
        error: 'Passwords do not match' 
      });
    }
    
    // ========== CHECK EXISTING USER ==========
    const normalizedEmail = email.toLowerCase().trim();
    const existingUser = await User.findOne({ email: normalizedEmail });
    
    if (existingUser) {
      return res.status(409).json({ 
        success: false,
        error: 'Email already registered',
        code: 'USER_EXISTS'
      });
    }
    
    // ========== CREATE USER ==========
    const user = new User({ 
      name: name.trim(), 
      email: normalizedEmail, 
      password 
    });
    
    const savedUser = await user.save();
    
    // ========== GENERATE TOKEN ==========
    const token = jwt.sign(
      { userId: savedUser._id }, 
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '30d' }
    );
    
    // ========== RETURN SUCCESS ==========
    console.log(`✓ User registered: ${normalizedEmail}`);
    return res.status(201).json({ 
      success: true,
      message: 'Registration successful',
      token, 
      user: { 
        id: savedUser._id, 
        name: savedUser.name, 
        email: savedUser.email 
      } 
    });
    
  } catch (error) {
    console.error('Registration error:', error.message, error.code);
    
    // Handle duplicate key error
    if (error.code === 11000) {
      return res.status(409).json({ 
        success: false,
        error: 'Email already registered',
        code: 'DUPLICATE_EMAIL'
      });
    }
    
    // Validation error
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({ 
        success: false,
        error: messages.join(', '),
        code: 'VALIDATION_ERROR'
      });
    }
    
    // Generic server error
    return res.status(500).json({ 
      success: false,
      error: 'Registration failed due to server error',
      code: 'INTERNAL_ERROR'
    });
  }
});

// Login Endpoint
app.post('/api/auth/login', async (req, res) => {
  try {
    // Verify MongoDB is connected
    if (!mongodbConnected) {
      console.warn('Login: MongoDB not connected');
      return res.status(503).json({ 
        success: false,
        error: 'Database service temporarily unavailable',
        code: 'DB_UNAVAILABLE'
      });
    }

    const { email, password } = req.body;
    
    // ========== VALIDATION ==========
    if (!email || typeof email !== 'string' || email.trim().length === 0) {
      return res.status(400).json({ 
        success: false,
        error: 'Email is required' 
      });
    }
    
    if (!password || typeof password !== 'string' || password.length === 0) {
      return res.status(400).json({ 
        success: false,
        error: 'Password is required' 
      });
    }
    
    // ========== FIND USER ==========
    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail }).select('+password');
    
    if (!user) {
      // Don't reveal whether email exists
      return res.status(401).json({ 
        success: false,
        error: 'Invalid email or password',
        code: 'INVALID_CREDENTIALS'
      });
    }
    
    // ========== VERIFY PASSWORD ==========
    let isPasswordValid = false;
    try {
      isPasswordValid = await user.comparePassword(password);
    } catch (hashError) {
      console.error('Password comparison error:', hashError.message);
      return res.status(500).json({ 
        success: false,
        error: 'Authentication failed',
        code: 'AUTH_ERROR'
      });
    }
    
    if (!isPasswordValid) {
      // Don't reveal whether password is wrong
      return res.status(401).json({ 
        success: false,
        error: 'Invalid email or password',
        code: 'INVALID_CREDENTIALS'
      });
    }
    
    // ========== GENERATE TOKEN ==========
    const token = jwt.sign(
      { userId: user._id }, 
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '30d' }
    );
    
    // ========== RETURN SUCCESS ==========
    console.log(`✓ User logged in: ${normalizedEmail}`);
    return res.status(200).json({ 
      success: true,
      message: 'Login successful',
      token, 
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email 
      } 
    });
    
  } catch (error) {
    console.error('Login error:', error.message);
    
    // Generic server error
    return res.status(500).json({ 
      success: false,
      error: 'Login failed due to server error',
      code: 'INTERNAL_ERROR'
    });
  }
});

// Create Booking
app.post('/api/book-room', authenticateToken, async (req, res) => {
  try {
    const { name, email, roomType, checkInDate, checkOutDate } = req.body;
    
    // Validation
    if (!name || !email || !roomType || !checkInDate || !checkOutDate) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    
    // Create booking
    const booking = new Booking({
      userId: req.userId,
      name,
      email,
      roomType,
      checkInDate: new Date(checkInDate),
      checkOutDate: new Date(checkOutDate),
    });
    
    await booking.save();
    res.status(201).json({ 
      message: 'Booking created successfully',
      data: booking 
    });
  } catch (error) {
    console.error('Booking creation error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get User's Bookings
app.get('/api/bookings', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    
    const bookings = await Booking.find({ userId: req.userId })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });
    
    const total = await Booking.countDocuments({ userId: req.userId });
    
    res.json({
      totalBookings: total,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit),
      data: bookings,
    });
  } catch (error) {
    console.error('Fetch bookings error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get Single Booking
app.get('/api/bookings/:id', async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    
    res.json({ data: booking });
  } catch (error) {
    console.error('Fetch booking error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update Booking
app.put('/api/bookings/:id', async (req, res) => {
  try {
    const { name, email, roomType, checkInDate, checkOutDate } = req.body;
    
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { name, email, roomType, checkInDate, checkOutDate },
      { new: true, runValidators: true }
    );
    
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    
    res.json({ 
      message: 'Booking updated successfully',
      data: booking 
    });
  } catch (error) {
    console.error('Update booking error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Delete Booking
app.delete('/api/bookings/:id', authenticateToken, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    
    // Verify ownership
    if (booking.userId.toString() !== req.userId) {
      return res.status(403).json({ error: 'You can only delete your own bookings' });
    }
    
    await Booking.findByIdAndDelete(req.params.id);
    
    res.json({ 
      message: 'Booking deleted successfully',
      data: booking 
    });
  } catch (error) {
    console.error('Delete booking error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// ERROR HANDLING
// ============================================

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    path: req.path,
    method: req.method,
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
  });
});

// ============================================
// SERVER STARTUP
// ============================================

const PORT = process.env.PORT || 5000;
const HOST = '0.0.0.0';

const server = app.listen(PORT, HOST, () => {
  console.log('');
  console.log('╔════════════════════════════════════════════════════════════╗');
  console.log('║   🏨 HOTEL MANAGEMENT BACKEND - PRODUCTION SERVER 🏨      ║');
  console.log('╚════════════════════════════════════════════════════════════╝');
  console.log('');
  console.log(`  ✓ Server Status:     RUNNING`);
  console.log(`  ✓ Port:              ${PORT}`);
  console.log(`  ✓ Host:              ${HOST} (all interfaces)`);
  console.log(`  ✓ Environment:       ${process.env.NODE_ENV || 'development'}`);
  console.log(`  ✓ MongoDB:           ${mongodbConnected ? 'CONNECTED' : 'CONNECTING...'}`);
  console.log('');
  console.log('  📡 API ENDPOINTS:');
  console.log(`     - Health:        http://18.215.168.203:${PORT}/api/health`);
  console.log(`     - Register:      http://18.215.168.203:${PORT}/api/auth/register`);
  console.log(`     - Login:         http://18.215.168.203:${PORT}/api/auth/login`);
  console.log('');
  console.log('  🌐 FRONTEND:');
  console.log(`     - S3 Bucket:     http://hotel-frontend-krishna.s3-website-us-east-1.amazonaws.com`);
  console.log(`     - API Base URL:  http://18.215.168.203:${PORT}/api`);
  console.log('');
  console.log('  ✓ Ready to accept connections from S3 frontend!');
  console.log('════════════════════════════════════════════════════════════');
  console.log('');
});

// ============================================
// GRACEFUL SHUTDOWN
// ============================================

process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('HTTP server closed');
    mongoose.connection.close(false, () => {
      console.log('MongoDB connection closed');
      process.exit(0);
    });
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received. Shutting down gracefully...');
  server.close(() => {
    console.log('HTTP server closed');
    mongoose.connection.close(false, () => {
      console.log('MongoDB connection closed');
      process.exit(0);
    });
  });
});

module.exports = app;
