# 🧪 Testing Guide

Complete guide for testing the Hotel Management System application.

---

## Prerequisites

- Backend running: `npm run dev` in backend folder
- MongoDB connected and running
- Frontend accessible (http://localhost:8000 or file path)
- Browser console open (F12)

---

## 1. Backend API Testing

### Test with cURL Commands

Open PowerShell and run these commands:

#### 1.1 Health Check
```powershell
curl -X GET http://localhost:5000/api/health
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Server is running successfully",
  "timestamp": "2025-01-10T10:30:00.000Z"
}
```

---

#### 1.2 Create a Booking (POST)

```powershell
$body = @{
    name = "John Doe"
    email = "john@example.com"
    roomType = "Double"
    checkInDate = "2025-02-15"
    checkOutDate = "2025-02-18"
} | ConvertTo-Json

curl -X POST http://localhost:5000/api/book-room `
  -H "Content-Type: application/json" `
  -Body $body
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Booking created successfully!",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "roomType": "Double",
    "checkInDate": "2025-02-15T00:00:00.000Z",
    "checkOutDate": "2025-02-18T00:00:00.000Z",
    "createdAt": "2025-01-10T10:30:00.000Z"
  }
}
```

---

#### 1.3 Get All Bookings (GET)

```powershell
curl -X GET http://localhost:5000/api/bookings
```

**Expected Response:**
```json
{
  "success": true,
  "totalBookings": 5,
  "currentPage": 1,
  "totalPages": 1,
  "data": [
    { /* booking objects */ }
  ]
}
```

---

#### 1.4 Get Bookings with Filters

```powershell
# Filter by room type
curl -X GET "http://localhost:5000/api/bookings?roomType=Double"

# Filter by email
curl -X GET "http://localhost:5000/api/bookings?email=john"

# Pagination
curl -X GET "http://localhost:5000/api/bookings?page=1&limit=5"

# Combined
curl -X GET "http://localhost:5000/api/bookings?page=1&limit=10&roomType=Double&email=john"
```

---

#### 1.5 Update a Booking (PUT)

```powershell
$bookingId = "507f1f77bcf86cd799439011"  # Replace with real ID

$body = @{
    name = "Jane Doe"
    email = "jane@example.com"
    roomType = "Deluxe"
    checkInDate = "2025-02-20"
    checkOutDate = "2025-02-22"
} | ConvertTo-Json

curl -X PUT http://localhost:5000/api/bookings/$bookingId `
  -H "Content-Type: application/json" `
  -Body $body
```

---

#### 1.6 Delete a Booking (DELETE)

```powershell
$bookingId = "507f1f77bcf86cd799439011"  # Replace with real ID

curl -X DELETE http://localhost:5000/api/bookings/$bookingId
```

---

### Test Invalid Data

#### Test 1: Missing Required Field
```powershell
$body = @{
    name = "John Doe"
    # missing email
    roomType = "Double"
    checkInDate = "2025-02-15"
    checkOutDate = "2025-02-18"
} | ConvertTo-Json

curl -X POST http://localhost:5000/api/book-room `
  -H "Content-Type: application/json" `
  -Body $body
```

**Expected:** 400 Bad Request with error message

#### Test 2: Invalid Email
```powershell
$body = @{
    name = "John Doe"
    email = "invalid-email"  # Not a valid email
    roomType = "Double"
    checkInDate = "2025-02-15"
    checkOutDate = "2025-02-18"
} | ConvertTo-Json

curl -X POST http://localhost:5000/api/book-room `
  -H "Content-Type: application/json" `
  -Body $body
```

**Expected:** 400 Bad Request with validation error

#### Test 3: Invalid Room Type
```powershell
$body = @{
    name = "John Doe"
    email = "john@example.com"
    roomType = "Premium"  # Invalid: must be Single/Double/Deluxe
    checkInDate = "2025-02-15"
    checkOutDate = "2025-02-18"
} | ConvertTo-Json

curl -X POST http://localhost:5000/api/book-room `
  -H "Content-Type: application/json" `
  -Body $body
```

**Expected:** 400 Bad Request

#### Test 4: Check-out Before Check-in
```powershell
$body = @{
    name = "John Doe"
    email = "john@example.com"
    roomType = "Double"
    checkInDate = "2025-02-18"
    checkOutDate = "2025-02-15"  # Before check-in!
} | ConvertTo-Json

curl -X POST http://localhost:5000/api/book-room `
  -H "Content-Type: application/json" `
  -Body $body
```

**Expected:** 400 Bad Request with date validation error

---

## 2. Frontend Testing

### Test Booking Form

#### Test Case 1: Valid Booking
1. Open `index.html`
2. Fill form:
   - Name: John Doe
   - Email: john@example.com
   - Room: Double
   - Check-in: (Today + 2 days)
   - Check-out: (Today + 5 days)
3. Click "Book Room"
4. **Expected:** Success message with booking ID

#### Test Case 2: Missing Name
1. Leave Name empty
2. Fill other fields
3. Click "Book Room"
4. **Expected:** Red error "Guest name is required"

#### Test Case 3: Invalid Email
1. Enter: "invalidemail"
2. Click "Book Room"
3. **Expected:** Error "Please enter a valid email address"

#### Test Case 4: Past Date
1. Check-in: Yesterday's date
2. **Expected:** Input rejects it (min attribute)

#### Test Case 5: Check-out Before Check-in
1. Check-in: 2025-02-15
2. Check-out: 2025-02-14
3. **Expected:** Error message

---

### Test Admin Dashboard

#### Test Case 1: Load Bookings
1. Open `admin.html`
2. **Expected:** 
   - Table loads with all bookings
   - Statistics update
   - Pagination shows if > 10 bookings

#### Test Case 2: Filter by Room Type
1. Select "Double" in filter dropdown
2. **Expected:** Table shows only Double room bookings

#### Test Case 3: Filter by Email
1. Type email in filter box
2. **Expected:** Table updates in real-time

#### Test Case 4: Pagination
1. Click "Next →"
2. **Expected:** 
   - Load next 10 bookings
   - Page number updates
   - Previous button enabled

#### Test Case 5: Delete Booking
1. Click "Delete" on any booking
2. Click "Delete" in confirmation modal
3. **Expected:**
   - Success message appears
   - Booking disappears from table
   - Statistics update

#### Test Case 6: Edit Booking
1. Click "Edit" on any booking
2. **Expected:** 
   - Modal opens (future implementation)
   - Or form loads for editing

---

## 3. Database Testing

### Connect to MongoDB

```bash
# Open MongoDB Shell
mongosh

# Show all databases
show dbs

# Use hotel database
use hotel-management

# Show collections
show collections

# View all bookings
db.bookings.find()

# Count bookings
db.bookings.countDocuments()

# View specific booking
db.bookings.findOne({ email: "john@example.com" })

# Find bookings by room type
db.bookings.find({ roomType: "Double" })

# View document structure
db.bookings.findOne({}, { pretty: true })
```

---

## 4. Error Scenarios

### Test Network Error
1. Stop backend server (Ctrl+C)
2. Try to book a room
3. **Expected:** "Error connecting to server" message

### Test MongoDB Disconnection
1. Stop MongoDB service
2. Restart backend
3. Try to create booking
4. **Expected:** Error message from backend

### Test Invalid API Endpoint
1. In browser console:
```javascript
fetch('http://localhost:5000/api/invalid-endpoint')
  .then(r => r.json())
  .then(d => console.log(d))
```
2. **Expected:** 404 Not Found error

---

## 5. Performance Testing

### Test Pagination Performance
1. Create 100+ bookings
2. Load admin page
3. **Expected:** Loads quickly (only 10 per page)

### Test Filter Performance
1. Filter by room type with many bookings
2. **Expected:** Results update within 1 second

### Test Form Validation Performance
1. Rapidly click "Book Room" button
2. **Expected:** No duplicate submissions

---

## 6. Browser Compatibility Testing

Test on different browsers:
- ✓ Chrome
- ✓ Firefox
- ✓ Edge
- ✓ Safari

**Test each:**
- Form submission
- Table display
- Responsive design on mobile

---

## 7. Responsive Design Testing

### Test on Different Sizes:

#### Desktop (1920x1080)
- Form displays 2 columns (form + room details)
- Table fully visible
- No scrolling needed

#### Tablet (768x1024)
- Form displays 1 column
- Room details below form
- Table responsive

#### Mobile (375x667)
- Single column layout
- Buttons full width
- Table scrollable horizontally

---

## 8. Automated Test Examples

### JavaScript Console Tests

```javascript
// Test 1: Create booking
async function testBooking() {
  const response = await fetch('http://localhost:5000/api/book-room', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Test User',
      email: 'test@example.com',
      roomType: 'Single',
      checkInDate: '2025-02-15',
      checkOutDate: '2025-02-18'
    })
  });
  
  const result = await response.json();
  console.log('Booking Test:', result.success ? '✓ PASS' : '✗ FAIL');
  return result;
}

testBooking();

// Test 2: Fetch bookings
async function testFetch() {
  const response = await fetch('http://localhost:5000/api/bookings');
  const result = await response.json();
  console.log('Fetch Test:', result.success ? '✓ PASS' : '✗ FAIL');
  console.log('Total bookings:', result.totalBookings);
}

testFetch();

// Test 3: Validate email
function testEmailValidation() {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const validEmail = emailRegex.test('john@example.com');
  const invalidEmail = emailRegex.test('invalidemail');
  
  console.log('Email Validation:', 
    validEmail && !invalidEmail ? '✓ PASS' : '✗ FAIL');
}

testEmailValidation();
```

---

## 9. Test Checklist

### Backend Tests
- [ ] Health check endpoint
- [ ] Create booking with valid data
- [ ] Create booking with missing fields
- [ ] Create booking with invalid email
- [ ] Create booking with invalid room type
- [ ] Create booking with invalid dates
- [ ] Get all bookings
- [ ] Get bookings with filters
- [ ] Get bookings with pagination
- [ ] Update booking
- [ ] Delete booking
- [ ] 404 error handling

### Frontend Tests
- [ ] Form validation (empty fields)
- [ ] Form validation (email format)
- [ ] Form validation (date logic)
- [ ] Successful booking submission
- [ ] Error message display
- [ ] Success message display
- [ ] Load admin dashboard
- [ ] Filter by room type
- [ ] Filter by email
- [ ] Pagination navigation
- [ ] Delete booking from admin
- [ ] Statistics update

### Database Tests
- [ ] MongoDB connection successful
- [ ] Booking data saved correctly
- [ ] Validation rules enforced
- [ ] Timestamps created
- [ ] Data retrieval works
- [ ] Filtering works
- [ ] Sorting works

### UI/UX Tests
- [ ] Responsive on desktop
- [ ] Responsive on tablet
- [ ] Responsive on mobile
- [ ] Forms are user-friendly
- [ ] Error messages are clear
- [ ] Success messages are clear
- [ ] Navigation works
- [ ] Page loads quickly

---

## 10. Bug Report Template

If you find a bug, use this template:

```
Title: Brief description of the issue
Severity: Critical / High / Medium / Low
Type: Bug / Feature Request / Enhancement

Steps to Reproduce:
1. ...
2. ...
3. ...

Expected Result:
...

Actual Result:
...

Screenshots/Console Errors:
...

Environment:
- OS: Windows/Mac/Linux
- Browser: Chrome/Firefox/Safari
- Node Version: 
- MongoDB Version:
```

---

## Success Criteria

Your Hotel Management System is working correctly when:

✅ Users can book rooms and see confirmation
✅ Admin can view all bookings
✅ Admin can filter and search bookings
✅ Admin can delete bookings
✅ Form validates all inputs
✅ Database stores all data correctly
✅ No console errors appear
✅ Mobile responsive design works
✅ Fast load times
✅ Proper error handling

---

**Testing is crucial for quality assurance!**
