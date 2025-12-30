// Import required modules
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

// Initialize Express app
const app = express();

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(bodyParser.json()); // Parse JSON request bodies
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Serve static files from frontend folder
app.use(express.static('../frontend'));

// Database Connection
const connectDB = async () => {
  try {
    const mongooseOptions = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };
    
    await mongoose.connect(process.env.MONGODB_URI, mongooseOptions);
    console.log('✓ MongoDB Connected Successfully');
  } catch (error) {
    console.error('✗ MongoDB Connection Error:', error.message);
    process.exit(1); // Exit process if database connection fails
  }
};

// Connect to MongoDB
connectDB();

// Define Booking Schema
const bookingSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide guest name'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters long'],
      maxlength: [50, 'Name cannot exceed 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Please provide email address'],
      trim: true,
      lowercase: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        'Please provide a valid email address',
      ],
    },
    roomType: {
      type: String,
      required: [true, 'Please select a room type'],
      enum: {
        values: ['Single', 'Double', 'Deluxe'],
        message: 'Room type must be Single, Double, or Deluxe',
      },
    },
    checkInDate: {
      type: Date,
      required: [true, 'Please provide check-in date'],
      validate: {
        validator: function (value) {
          return value >= new Date(new Date().setHours(0, 0, 0, 0));
        },
        message: 'Check-in date must be today or in the future',
      },
    },
    checkOutDate: {
      type: Date,
      required: [true, 'Please provide check-out date'],
      validate: {
        validator: function (value) {
          return value > this.checkInDate;
        },
        message: 'Check-out date must be after check-in date',
      },
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  }
);

// Create Booking Model
const Booking = mongoose.model('Booking', bookingSchema);

// ============================================
// API ROUTES
// ============================================

// Route: POST /api/book-room
// Description: Create a new booking
// Request body: { name, email, roomType, checkInDate, checkOutDate }
app.post('/api/book-room', async (req, res) => {
  try {
    const { name, email, roomType, checkInDate, checkOutDate } = req.body;

    // Validate required fields
    if (!name || !email || !roomType || !checkInDate || !checkOutDate) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields',
      });
    }

    // Create new booking document
    const booking = new Booking({
      name,
      email,
      roomType,
      checkInDate: new Date(checkInDate),
      checkOutDate: new Date(checkOutDate),
    });

    // Save to database
    await booking.save();

    // Return success response
    res.status(201).json({
      success: true,
      message: 'Booking created successfully!',
      data: booking,
    });
  } catch (error) {
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors)
        .map((err) => err.message)
        .join(', ');
      return res.status(400).json({
        success: false,
        message: `Validation Error: ${messages}`,
      });
    }

    // Handle other errors
    console.error('Booking Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating booking. Please try again later.',
      error: error.message,
    });
  }
});

// Route: GET /api/bookings
// Description: Fetch all bookings (Admin use)
// Query parameters: page, limit, roomType, email
app.get('/api/bookings', async (req, res) => {
  try {
    const { page = 1, limit = 10, roomType, email } = req.query;

    // Build filter object
    let filter = {};
    if (roomType) filter.roomType = roomType;
    if (email) filter.email = new RegExp(email, 'i'); // Case-insensitive search

    // Fetch bookings with pagination
    const bookings = await Booking.find(filter)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 }); // Sort by newest first

    // Get total count for pagination
    const total = await Booking.countDocuments(filter);

    // Return success response with pagination info
    res.status(200).json({
      success: true,
      totalBookings: total,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      data: bookings,
    });
  } catch (error) {
    console.error('Fetch Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching bookings',
      error: error.message,
    });
  }
});

// Route: GET /api/bookings/:id
// Description: Fetch a single booking by ID
app.get('/api/bookings/:id', async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    console.error('Fetch Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching booking',
      error: error.message,
    });
  }
});

// Route: PUT /api/bookings/:id
// Description: Update a booking
app.put('/api/bookings/:id', async (req, res) => {
  try {
    const { name, email, roomType, checkInDate, checkOutDate } = req.body;

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { name, email, roomType, checkInDate, checkOutDate },
      { new: true, runValidators: true }
    );

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Booking updated successfully!',
      data: booking,
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors)
        .map((err) => err.message)
        .join(', ');
      return res.status(400).json({
        success: false,
        message: `Validation Error: ${messages}`,
      });
    }

    console.error('Update Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating booking',
      error: error.message,
    });
  }
});

// Route: DELETE /api/bookings/:id
// Description: Delete a booking
app.delete('/api/bookings/:id', async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Booking deleted successfully!',
      data: booking,
    });
  } catch (error) {
    console.error('Delete Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting booking',
      error: error.message,
    });
  }
});

// Route: GET /api/health
// Description: Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running successfully',
    timestamp: new Date(),
  });
});

// Error handling middleware for 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✓ Server is running on http://localhost:${PORT}`);
  console.log(`✓ Environment: ${process.env.NODE_ENV}`);
});

module.exports = app;
