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
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
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
    const { name, email, password, confirmPassword } = req.body;
    
    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    if (password !== confirmPassword) {
      return res.status(400).json({ error: 'Passwords do not match' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }
    
    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }
    
    // Create user
    const user = new User({ name, email, password });
    await user.save();
    
    // Generate token
    const token = jwt.sign(
      { userId: user._id }, 
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '30d' }
    );
    
    res.status(201).json({ 
      message: 'Registration successful',
      token, 
      user: { id: user._id, name, email } 
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Login Endpoint
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validation
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }
    
    // Find user
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Verify password
    const isValid = await user.comparePassword(password);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Generate token
    const token = jwt.sign(
      { userId: user._id }, 
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '30d' }
    );
    
    res.json({ 
      message: 'Login successful',
      token, 
      user: { id: user._id, name: user.name, email } 
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: error.message });
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
  console.log('========================================');
  console.log('✓ Express Server Started Successfully');
  console.log('========================================');
  console.log(`Port: ${PORT}`);
  console.log(`Host: ${HOST}`);
  console.log(`Public URL: http://<YOUR_EC2_PUBLIC_IP>:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`MongoDB: ${mongodbConnected ? '✓ connected' : '⏳ connecting...'}`);
  console.log(`Health: http://localhost:${PORT}/api/health`);
  console.log('========================================');
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
