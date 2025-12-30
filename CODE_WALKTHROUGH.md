# 📖 Code Walkthrough - Detailed Explanation

Complete line-by-line explanation of key code sections.

---

## Table of Contents
1. [Backend Server.js](#backend-serverjs)
2. [Frontend script.js](#frontend-scriptjs)
3. [Frontend admin.js](#frontend-adminjs)

---

## BACKEND: server.js

### 1. Imports and Setup

```javascript
// ============================================
// Hotel Management System - Backend Server
// ============================================

const express = require('express');           // Web framework
const mongoose = require('mongoose');         // MongoDB ORM
const cors = require('cors');                 // Cross-origin requests
const bodyParser = require('body-parser');    // Parse request bodies
require('dotenv').config();                   // Load environment variables

const app = express();                        // Create Express app
```

**Explanation:**
- Import all required libraries/modules
- `express`: Framework for building REST APIs
- `mongoose`: Makes it easier to work with MongoDB
- `cors`: Allows requests from different domains (frontend)
- `bodyParser`: Converts JSON strings to JavaScript objects
- `dotenv`: Reads variables from .env file (like passwords)
- `app`: Main application object

---

### 2. Middleware Setup

```javascript
app.use(cors());                              // Enable CORS for all routes
app.use(bodyParser.json());                   // Parse JSON bodies
app.use(bodyParser.urlencoded({ extended: true }));  // Parse form data
```

**Explanation:**
- `app.use()`: Registers middleware (functions that process requests)
- `cors()`: Allows frontend to make requests to this backend
- `bodyParser.json()`: When frontend sends `Content-Type: application/json`, parse it
- `urlencoded`: Also handles form submissions

**Example Flow:**
```
Request: {"name": "John"}
          ↓
bodyParser.json()
          ↓
Request becomes: req.body = {name: "John"}
```

---

### 3. Database Connection

```javascript
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
    process.exit(1);  // Stop server if connection fails
  }
};

connectDB();  // Call function to connect
```

**Explanation:**
- `async`: Function can wait for database (which takes time)
- `try-catch`: Handles errors gracefully
- `mongoose.connect()`: Connects to MongoDB
- `process.env.MONGODB_URI`: Gets connection string from .env file
- `console.log()`: Prints status to terminal
- `process.exit(1)`: Stops server if connection fails

**How It Works:**
```
1. Read .env file: MONGODB_URI=mongodb://...
2. Call mongoose.connect() with that string
3. Wait for connection (async)
4. If successful → print "✓ Connected"
5. If failed → print "✗ Error" and stop
```

---

### 4. Booking Schema Definition

```javascript
const bookingSchema = new mongoose.Schema(
  {
    // Field 1: Guest Name
    name: {
      type: String,                     // Data type: text
      required: [true, 'Please provide guest name'],  // Must be provided
      trim: true,                       // Remove whitespace
      minlength: [2, 'Name must be at least 2 characters long'],
      maxlength: [50, 'Name cannot exceed 50 characters'],
    },
    
    // Field 2: Email Address
    email: {
      type: String,
      required: [true, 'Please provide email address'],
      trim: true,
      lowercase: true,                  // Convert to lowercase
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,   // Email regex pattern
        'Please provide a valid email address',
      ],
    },
    
    // Field 3: Room Type
    roomType: {
      type: String,
      required: [true, 'Please select a room type'],
      enum: {
        values: ['Single', 'Double', 'Deluxe'],  // Only these allowed
        message: 'Room type must be Single, Double, or Deluxe',
      },
    },
    
    // Field 4: Check-in Date
    checkInDate: {
      type: Date,
      required: [true, 'Please provide check-in date'],
      validate: {
        validator: function (value) {
          // Check if date is today or in future
          return value >= new Date(new Date().setHours(0, 0, 0, 0));
        },
        message: 'Check-in date must be today or in the future',
      },
    },
    
    // Field 5: Check-out Date
    checkOutDate: {
      type: Date,
      required: [true, 'Please provide check-out date'],
      validate: {
        validator: function (value) {
          // Check if check-out is after check-in
          return value > this.checkInDate;
        },
        message: 'Check-out date must be after check-in date',
      },
    },
    
    // Field 6: Creation Timestamp
    createdAt: {
      type: Date,
      default: Date.now,                // Automatically set to current time
    },
  },
  {
    timestamps: true,                   // Auto add createdAt and updatedAt
  }
);
```

**Explanation of Validations:**

| Validation | Purpose | Example |
|-----------|---------|---------|
| `required` | Field must be provided | Name cannot be empty |
| `type` | Data type check | Email must be string |
| `trim` | Remove whitespace | "John " → "John" |
| `lowercase` | Convert to lowercase | "JOHN@EXAMPLE.COM" → "john@example.com" |
| `minlength` | Minimum characters | Name needs 2+ chars |
| `maxlength` | Maximum characters | Name can't exceed 50 |
| `enum` | Only specific values | roomType in [Single, Double, Deluxe] |
| `match` | Pattern validation | Email must match regex |
| `validate` | Custom validation | Check-out > Check-in |

**How Validation Works:**
```javascript
// When saving to database:
await booking.save()

// If validation fails:
if (name length < 2) {
  throw Error('Name must be at least 2 characters long')
}

// If validation passes:
// Save to database
```

---

### 5. Create Booking Model

```javascript
const Booking = mongoose.model('Booking', bookingSchema);
```

**Explanation:**
- Create a MongoDB collection called "Booking"
- `schema`: Defines structure and validation rules
- `model`: Creates functions to interact with database

**What This Enables:**
```javascript
new Booking(data)        // Create new booking
await booking.save()     // Save to database
Booking.find()          // Find bookings
Booking.findById(id)    // Find by ID
Booking.updateOne()     // Update booking
Booking.deleteOne()     // Delete booking
```

---

### 6. POST /api/book-room Endpoint

```javascript
app.post('/api/book-room', async (req, res) => {
  try {
    // Extract data from request body
    const { name, email, roomType, checkInDate, checkOutDate } = req.body;

    // Validate all required fields are present
    if (!name || !email || !roomType || !checkInDate || !checkOutDate) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields',
      });
    }

    // Create new Booking document
    const booking = new Booking({
      name,
      email,
      roomType,
      checkInDate: new Date(checkInDate),  // Convert string to Date
      checkOutDate: new Date(checkOutDate),
    });

    // Save to database (Mongoose validates schema)
    await booking.save();

    // Send success response
    res.status(201).json({
      success: true,
      message: 'Booking created successfully!',
      data: booking,
    });
  } 
  catch (error) {
    // Handle validation errors from Mongoose
    if (error.name === 'ValidationError') {
      // Extract all error messages
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
```

**Step-by-Step Explanation:**

1. **Route Definition:**
   ```javascript
   app.post('/api/book-room', async (req, res) => {
   ```
   - `app.post()`: Handle POST requests to this URL
   - `async`: Can wait for database operations
   - `req`: Request object (contains data from frontend)
   - `res`: Response object (send data back to frontend)

2. **Extract Data:**
   ```javascript
   const { name, email, roomType, checkInDate, checkOutDate } = req.body;
   ```
   - Extract data sent by frontend
   - Same as:
     ```javascript
     name = req.body.name
     email = req.body.email
     // etc.
     ```

3. **Quick Validation:**
   ```javascript
   if (!name || !email || !roomType || !checkInDate || !checkOutDate) {
     return res.status(400).json({...})
   }
   ```
   - Check if any field is missing
   - `!name` means "if name is empty or null"
   - Send 400 (Bad Request) error if fields missing

4. **Create Booking:**
   ```javascript
   const booking = new Booking({...})
   ```
   - Create booking object (not saved yet)
   - `new Date()`: Convert string to Date object

5. **Save to Database:**
   ```javascript
   await booking.save();
   ```
   - `await`: Wait for database to save (might take time)
   - During save, Mongoose validates against schema
   - If validation fails, throws error

6. **Success Response:**
   ```javascript
   res.status(201).json({...})
   ```
   - `201`: HTTP status "Created" (successful creation)
   - `.json()`: Send back JSON data
   - Frontend receives: `{success: true, data: {...}}`

7. **Error Handling:**
   ```javascript
   catch (error) {
   ```
   - Catches any errors (from validation or database)
   - Returns appropriate error response

**Example Flow:**
```
Frontend sends:
POST /api/book-room
{
  "name": "John",
  "email": "john@example.com",
  "roomType": "Double",
  "checkInDate": "2025-02-15",
  "checkOutDate": "2025-02-18"
}

Server processes:
1. Extract data from req.body
2. Check all fields present ✓
3. Create Booking object
4. Mongoose validates:
   - name is 2-50 chars ✓
   - email matches regex ✓
   - roomType is valid ✓
   - dates are valid ✓
5. Save to MongoDB ✓
6. Send back:
   {
     "success": true,
     "message": "Booking created successfully!",
     "data": { _id, name, email, ... }
   }
```

---

### 7. GET /api/bookings Endpoint

```javascript
app.get('/api/bookings', async (req, res) => {
  try {
    // Extract query parameters
    const { page = 1, limit = 10, roomType, email } = req.query;

    // Build filter object based on parameters
    let filter = {};
    if (roomType) filter.roomType = roomType;           // Exact match
    if (email) filter.email = new RegExp(email, 'i');   // Case-insensitive search

    // Fetch bookings with pagination
    const bookings = await Booking.find(filter)
      .limit(limit * 1)                    // Convert string to number
      .skip((page - 1) * limit)            // Skip previous pages
      .sort({ createdAt: -1 });            // Sort by newest first

    // Get total count for pagination info
    const total = await Booking.countDocuments(filter);

    // Send response with pagination info
    res.status(200).json({
      success: true,
      totalBookings: total,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      data: bookings,
    });
  } 
  catch (error) {
    console.error('Fetch Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching bookings',
      error: error.message,
    });
  }
});
```

**Explanation:**

**Query Parameters:**
```
URL: /api/bookings?page=2&limit=10&roomType=Double&email=john

req.query = {
  page: "2",
  limit: "10",
  roomType: "Double",
  email: "john"
}
```

**Building Filters:**
```javascript
filter = {}
if (roomType) filter.roomType = "Double"     // filter = {roomType: "Double"}
if (email) filter.email = /john/i            // filter = {roomType: "Double", email: /john/i}
```

**Pagination:**
```javascript
page = 2, limit = 10

.skip((2 - 1) * 10)   // Skip first 10 documents (page 1)
.limit(10)             // Get next 10 documents (page 2)

// Returns documents 11-20
```

**Sorting:**
```javascript
.sort({ createdAt: -1 })

// -1: Descending order (newest first)
// 1: Ascending order (oldest first)
```

**Example:**
```
URL: /api/bookings?page=1&limit=5&roomType=Double

Response:
{
  "success": true,
  "totalBookings": 15,        // Total Double rooms booked
  "currentPage": 1,
  "totalPages": 3,            // 15 ÷ 5 = 3 pages
  "data": [
    { _id: 1, name: "John", roomType: "Double" },
    { _id: 2, name: "Jane", roomType: "Double" },
    { _id: 3, name: "Bob", roomType: "Double" },
    { _id: 4, name: "Alice", roomType: "Double" },
    { _id: 5, name: "Charlie", roomType: "Double" }
  ]
}
```

---

## FRONTEND: script.js

### 1. Configuration and DOM Elements

```javascript
// API Configuration
const API_BASE_URL = 'http://localhost:5000/api';

// Get form element
const bookingForm = document.getElementById('bookingForm');
const successMessage = document.getElementById('successMessage');
const errorMessage = document.getElementById('errorMessage');
const loadingSpinner = document.getElementById('loadingSpinner');

// Get form fields
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const roomTypeInput = document.getElementById('roomType');
const checkInInput = document.getElementById('checkInDate');
const checkOutInput = document.getElementById('checkOutDate');
```

**Explanation:**
- `API_BASE_URL`: Base URL for all API calls
- `document.getElementById()`: Get HTML element by ID
- Store references so we can use them later without re-fetching

---

### 2. Set Minimum Date Function

```javascript
function setMinDate() {
  const today = new Date();                    // Get today's date
  const year = today.getFullYear();            // Get year (e.g., 2025)
  const month = String(today.getMonth() + 1).padStart(2, '0');  // Get month
  const date = String(today.getDate()).padStart(2, '0');        // Get day

  // Format as YYYY-MM-DD
  const minDate = `${year}-${month}-${date}`;

  // Set minimum date on input fields
  checkInInput.setAttribute('min', minDate);
  checkOutInput.setAttribute('min', minDate);
}
```

**Explanation:**

**Why padStart(2, '0')?**
```javascript
1.toString().padStart(2, '0')    // Returns "01"
10.toString().padStart(2, '0')   // Returns "10"
```

**Example:**
```javascript
// Today = January 10, 2025
const minDate = "2025-01-10"

// HTML input becomes:
// <input type="date" min="2025-01-10">

// User can only select dates from January 10 onwards
```

---

### 3. Email Validation Function

```javascript
function validateEmail(email) {
  // Regex pattern for email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  // Test if email matches pattern
  return emailRegex.test(email);
}
```

**Regex Breakdown:**
```
/^[^\s@]+@[^\s@]+\.[^\s@]+$/

^              : Start of string
[^\s@]+        : One or more characters (not space or @)
@              : Literal @ symbol
[^\s@]+        : One or more characters (not space or @)
\.             : Literal . (dot)
[^\s@]+        : One or more characters (not space or @)
$              : End of string
```

**Examples:**
```javascript
validateEmail("john@example.com")     // true ✓
validateEmail("john@example")         // false ✗
validateEmail("john@.com")            // false ✗
validateEmail("john example@com")     // false ✗
```

---

### 4. Form Validation Function

```javascript
function validateForm() {
  let isValid = true;

  // Clear all previous error messages
  nameError.textContent = '';
  nameError.classList.remove('show');
  // ... (repeat for all error fields)

  // Validate name
  if (!nameInput.value.trim()) {
    nameError.textContent = 'Guest name is required';
    nameError.classList.add('show');
    isValid = false;
  } else if (nameInput.value.trim().length < 2) {
    nameError.textContent = 'Guest name must be at least 2 characters';
    nameError.classList.add('show');
    isValid = false;
  }

  // Validate email
  if (!emailInput.value.trim()) {
    emailError.textContent = 'Email address is required';
    emailError.classList.add('show');
    isValid = false;
  } else if (!validateEmail(emailInput.value.trim())) {
    emailError.textContent = 'Please enter a valid email address';
    emailError.classList.add('show');
    isValid = false;
  }

  // ... (similar validation for other fields)

  // Validate check-out > check-in
  if (checkInInput.value && checkOutInput.value) {
    const checkInDate = new Date(checkInInput.value);
    const checkOutDate = new Date(checkOutInput.value);
    if (checkOutDate <= checkInDate) {
      checkOutError.textContent = 'Check-out date must be after check-in date';
      checkOutError.classList.add('show');
      isValid = false;
    }
  }

  return isValid;  // Return true if all valid, false if any error
}
```

**How It Works:**

1. **Initialize:** `isValid = true` (assume all is valid)
2. **Clear previous errors:** Remove old error messages
3. **Check each field:**
   - If condition not met → Show error, set `isValid = false`
4. **Return result:** True if all valid, false if any error

**Example:**
```
User input: "John", "invalid@", "Double", dates ok

validateForm() runs:
- Name: "John" → 4 characters ✓
- Email: "invalid@" → doesn't match regex ✗
  → emailError.textContent = "Please enter a valid email..."
  → isValid = false
- Return false

Form doesn't submit, errors are shown
```

---

### 5. Show Messages Functions

```javascript
function showSuccessMessage(message) {
  // Set message text
  successText.textContent = message;
  
  // Show success message
  successMessage.style.display = 'flex';
  errorMessage.style.display = 'none';

  // Auto-hide after 5 seconds
  setTimeout(() => {
    successMessage.style.display = 'none';
  }, 5000);
}

function showErrorMessage(message) {
  // Set message text
  errorText.textContent = message;
  
  // Show error message
  errorMessage.style.display = 'flex';
  successMessage.style.display = 'none';

  // Auto-hide after 5 seconds
  setTimeout(() => {
    errorMessage.style.display = 'none';
  }, 5000);
}

function closeMessage() {
  successMessage.style.display = 'none';
  errorMessage.style.display = 'none';
}
```

**Explanation:**

**`setTimeout()` Function:**
```javascript
setTimeout(() => {
  successMessage.style.display = 'none';
}, 5000);

// Wait 5000 milliseconds (5 seconds)
// Then execute the arrow function
// Hide the success message
```

---

### 6. Submit Booking Function

```javascript
async function submitBooking(bookingData) {
  try {
    // Show loading state
    loadingSpinner.style.display = 'block';
    submitBtn.disabled = true;

    // Make API request
    const response = await fetch(`${API_BASE_URL}/book-room`, {
      method: 'POST',                    // HTTP method
      headers: {
        'Content-Type': 'application/json',  // Tell backend we're sending JSON
      },
      body: JSON.stringify(bookingData),  // Convert object to JSON string
    });

    // Parse response
    const result = await response.json();

    // Hide loading state
    loadingSpinner.style.display = 'none';
    submitBtn.disabled = false;

    // Check if successful
    if (response.ok && result.success) {
      showSuccessMessage(
        `🎉 ${result.message} Booking ID: ${result.data._id.substring(0, 8)}`
      );
      resetForm();
      console.log('Booking created successfully:', result.data);
    } else {
      showErrorMessage(result.message || 'Failed to create booking');
      console.error('Booking error:', result);
    }
  } 
  catch (error) {
    // Network error or parsing error
    loadingSpinner.style.display = 'none';
    submitBtn.disabled = false;
    showErrorMessage(
      'Error connecting to server. Please check if backend is running.'
    );
    console.error('Fetch error:', error);
  }
}
```

**Step-by-Step:**

1. **Show Loading:**
   ```javascript
   loadingSpinner.style.display = 'block'    // Show spinner
   submitBtn.disabled = true                  // Disable button
   ```

2. **Make API Call:**
   ```javascript
   const response = await fetch(url, {
     method: 'POST',                         // Send POST request
     headers: {...},                         // Tell server it's JSON
     body: JSON.stringify(bookingData)       // Send data as JSON
   });
   ```

3. **Parse Response:**
   ```javascript
   const result = await response.json()      // Convert response to object
   ```

4. **Check Status:**
   ```javascript
   if (response.ok && result.success)        // Check HTTP status and data
   ```

5. **Handle Results:**
   - Success: Show message, clear form
   - Error: Show error message
   - Network error: Caught by catch block

---

## FRONTEND: admin.js

### 1. Fetch Bookings Function

```javascript
async function fetchBookings(page = 1) {
  try {
    showLoading();    // Show spinner
    hideError();      // Clear previous errors

    // Build query parameters
    const params = new URLSearchParams();
    params.append('page', page);
    params.append('limit', itemsPerPage);

    // Add optional filters
    if (filterEmail.value) {
      params.append('email', filterEmail.value);
    }
    if (filterRoomType.value) {
      params.append('roomType', filterRoomType.value);
    }

    // Fetch from API
    const response = await fetch(`${API_BASE_URL}/bookings?${params}`);
    const result = await response.json();

    hideLoading();

    if (!response.ok || !result.success) {
      showError(result.message || 'Failed to fetch bookings');
      return;
    }

    // Render bookings in table
    renderBookings(result.data);

    // Update pagination
    currentPage = parseInt(page);
    pageInfo.textContent = `Page ${currentPage} of ${result.totalPages}`;
    
    // Show/hide pagination buttons
    paginationContainer.style.display = 'flex';
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === result.totalPages;

    console.log('✓ Bookings loaded:', result.data.length);
  } 
  catch (error) {
    hideLoading();
    showError('Error connecting to server...');
    console.error('Fetch error:', error);
  }
}
```

**URLSearchParams:**
```javascript
const params = new URLSearchParams();
params.append('page', 1);
params.append('limit', 10);
params.append('roomType', 'Double');

// params.toString() = "page=1&limit=10&roomType=Double"
// URL becomes: /api/bookings?page=1&limit=10&roomType=Double
```

---

### 2. Render Bookings Function

```javascript
function renderBookings(bookings) {
  // Clear existing rows
  bookingsTableBody.innerHTML = '';

  if (bookings.length === 0) {
    bookingsContainer.style.display = 'none';
    noBookings.style.display = 'block';
    paginationContainer.style.display = 'none';
    calculateStatistics([]);
    return;
  }

  // Show table
  bookingsContainer.style.display = 'block';
  noBookings.style.display = 'none';

  // Create table row for each booking
  bookings.forEach((booking) => {
    const row = document.createElement('tr');

    // Format dates
    const checkInDate = formatDate(booking.checkInDate);
    const checkOutDate = formatDate(booking.checkOutDate);
    const createdAt = formatDate(booking.createdAt);

    // Set row HTML
    row.innerHTML = `
      <td>${booking.name}</td>
      <td>${booking.email}</td>
      <td><span style="...>${booking.roomType}</span></td>
      <td>${checkInDate}</td>
      <td>${checkOutDate}</td>
      <td>${createdAt}</td>
      <td></td>
    `;

    // Add action buttons to last cell
    row.cells[6].appendChild(createActionButtons(booking._id));

    // Add row to table
    bookingsTableBody.appendChild(row);
  });

  // Update statistics
  calculateStatistics(bookings);
}
```

**How It Works:**

1. **Clear table:** `bookingsTableBody.innerHTML = ''`
2. **Check if empty:** Show "No bookings" message
3. **Loop through bookings:**
   ```javascript
   bookings.forEach((booking) => {
     // Create row for each booking
   })
   ```
4. **Create DOM elements:**
   ```javascript
   const row = document.createElement('tr')    // Create table row
   row.innerHTML = `<td>...</td>...`            // Set HTML content
   bookingsTableBody.appendChild(row)           // Add to table body
   ```

---

### 3. Delete Booking Function

```javascript
async function deleteBooking(bookingId) {
  try {
    showLoading();
    hideError();

    // Send DELETE request
    const response = await fetch(`${API_BASE_URL}/bookings/${bookingId}`, {
      method: 'DELETE',
    });

    const result = await response.json();

    closeModal();      // Close confirmation modal
    hideLoading();

    if (!response.ok || !result.success) {
      showError(result.message || 'Failed to delete booking');
      return;
    }

    // Show success message
    const successMsg = document.createElement('div');
    successMsg.className = 'alert alert-success';
    successMsg.textContent = '✓ Booking deleted successfully!';
    document.querySelector('.admin-section').prepend(successMsg);

    // Auto-remove success message
    setTimeout(() => successMsg.remove(), 3000);

    // Reload bookings
    fetchBookings(currentPage);

    console.log('✓ Booking deleted successfully');
  } 
  catch (error) {
    hideLoading();
    showError('Error deleting booking');
    console.error('Delete error:', error);
  }
}
```

**Delete Flow:**
```
1. User clicks "Delete" button
   → openDeleteModal(bookingId)
   
2. Confirmation modal appears
   → User clicks "Delete" in modal
   
3. confirmDeleteBtn.onclick triggered
   → deleteBooking(bookingId)
   
4. Send DELETE request to backend
   
5. Backend deletes from MongoDB
   
6. Receive success response
   
7. Reload table to show updated list
```

---

## Summary of Key Concepts

### Async/Await
```javascript
async function fetchData() {
  const response = await fetch(url);  // Wait for response
  const data = await response.json();  // Wait for parsing
  return data;
}
```

### Error Handling
```javascript
try {
  // Code that might fail
} catch (error) {
  // Handle error
}
```

### DOM Manipulation
```javascript
document.getElementById('id')         // Get element
element.style.display = 'block'       // Change style
element.classList.add('show')         // Add class
element.innerHTML = '<p>Text</p>'     // Set HTML
element.addEventListener('click', fn) // Add listener
```

### API Communication
```javascript
fetch(url, {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify(data)
})
```

---

**This code walkthrough explains every critical function in the application!**
