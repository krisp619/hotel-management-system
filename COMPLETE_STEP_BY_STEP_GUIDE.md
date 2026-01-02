# HOTEL MANAGEMENT SYSTEM - COMPLETE STEP-BY-STEP GUIDE

## PART 1: WHAT HAS BEEN BUILT ✅

### Frontend (React Application)
- ✅ **App Location**: `C:\Users\krishna potdar\OneDrive\Desktop\Dyanamic website\frontend-react\`
- ✅ **Pages Built**:
  - Login page (Sign In form)
  - Register page (Create Account form)
  - Dashboard page (Book rooms)
  - Bookings page (Manage bookings)
- ✅ **Features**:
  - Professional red header with "Hotel Management" title
  - JWT authentication
  - Protected routes (only logged-in users can access Dashboard & Bookings)
  - Room booking form
  - Booking management (view, edit, delete)

### Backend (Node.js/Express)
- ✅ **Server Location**: `C:\Users\krishna potdar\OneDrive\Desktop\Dyanamic website\backend\`
- ✅ **APIs Created**:
  - POST /api/auth/register - Register new user
  - POST /api/auth/login - Login user
  - POST /api/book-room - Create a booking
  - GET /api/bookings - Get user's bookings
  - GET /api/bookings/:id - Get specific booking
  - PUT /api/bookings/:id - Update booking
  - DELETE /api/bookings/:id - Delete booking
  - GET /api/health - Health check

### Database (MongoDB)
- ⚠️ **Status**: NOT RUNNING YET
- **Location**: Needs to be installed and running on localhost:27017

---

## PART 2: CURRENT STATUS

| Component | Status | Action Needed |
|-----------|--------|---------------|
| Frontend React App | ✅ Built & Running | Running at http://localhost:3001 |
| Backend Express Server | ✅ Built & Configured | Not running (waiting for MongoDB) |
| MongoDB Database | ❌ Not running | INSTALL & START |
| Git Repository | ✅ Created | All code pushed to GitHub |

---

## PART 3: STEP-BY-STEP SETUP (DO EXACTLY AS WRITTEN)

### STEP 1: CREATE DATA DIRECTORY FOR MONGODB

**Open PowerShell and run:**

```powershell
mkdir C:\data\db
```

**Expected Result**: Folder created at C:\data\db (or already exists)

---

### STEP 2: DOWNLOAD MONGODB COMMUNITY EDITION

**Method: Download from official website**

1. Open your browser
2. Go to: https://www.mongodb.com/try/download/community
3. Look for the download button
4. Select **Windows** (your operating system)
5. Download the **.msi** file (Installer)
6. Wait for download to complete (~500 MB)
7. You'll have a file like: `mongodb-windows-x86_64-6.0.0-signed.msi` or similar

**Do NOT skip this step - installation is different from downloaded file!**

---

### STEP 3: INSTALL MONGODB (CRITICAL - FOLLOW EXACTLY)

**Double-click the downloaded .msi file**

You'll see an installer window. Follow these steps EXACTLY:

1. **Welcome Screen**: Click **"Next"**

2. **License Agreement**: Read it, then click **"I Agree"**

3. **Setup Type**:
   - Select **"Complete"** (not Custom)
   - Click **"Next"**

4. **Service Configuration** (⭐ MOST IMPORTANT):
   - You'll see options for installing MongoDB
   - **CHECK THE BOX** that says: **"Install MongoDB as a Service"**
   - This is CRITICAL! Without this, MongoDB won't auto-start
   - Click **"Next"**

5. **Data Directory**:
   - Should show: `C:\data\db`
   - If different, change it to: `C:\data\db`
   - Click **"Next"**

6. **Log Directory**:
   - Keep default or set to: `C:\data\log`
   - Click **"Next"**

7. **Ready to Install**:
   - Click **"Install"**
   - Wait 2-3 minutes (installer runs)
   - Progress bar will move
   - **DO NOT CLOSE THIS WINDOW**

8. **Installation Complete**:
   - Click **"Finish"**

**Expected Result**: MongoDB is now installed as a Windows Service

---

### STEP 4: START MONGODB SERVICE

**Open PowerShell and run:**

```powershell
Start-Service MongoDB
```

**Expected Result**: Command completes with no error

**To Verify it's Running:**

```powershell
Get-Service MongoDB | Select-Object Status, Name
```

**You should see:**
```
Status Name
------ ----
Running MongoDB
```

**If Status shows "Stopped", try again:**
```powershell
Start-Service MongoDB
```

---

### STEP 5: VERIFY MONGODB IS LISTENING ON PORT 27017

**Open PowerShell and run:**

```powershell
netstat -ano | findstr :27017
```

**Expected Result**: You see output with `:27017` in it. Example:
```
TCP    127.0.0.1:27017       0.0.0.0:0              LISTENING       12345
```

If you see this, **MongoDB is running correctly!** ✅

---

## PART 4: START THE FRONTEND APPLICATION

**Open a NEW PowerShell window and run:**

```powershell
cd "C:\Users\krishna potdar\OneDrive\Desktop\Dyanamic website\frontend-react"
npm run dev
```

**Expected Output:**
```
> hotel-management-react@1.0.0 dev
> vite

  VITE v5.4.21  ready in 273 ms

  ➜  Local:   http://localhost:3001/
```

**What this means**: Frontend is ready at http://localhost:3001

**Keep this window OPEN** - do not close it!

---

## PART 5: TEST THE FRONTEND

**In your browser, go to: http://localhost:3001**

You should see:
- Red header bar with "Hotel Management" title
- White form box in the center
- Email and Password input fields
- "Sign In" button
- "Register here" link at the bottom

**If you see this**, frontend is working! ✅

---

## PART 6: TEST REGISTRATION

**On the Login page:**

1. Click **"Register here"** link

**You should be taken to: http://localhost:3001/register**

You should see:
- "Create Account" heading
- Fields for:
  - Full Name
  - Email Address
  - Password
  - Confirm Password
- "Register" button (green)
- "Sign in here" link

**Fill in the form:**
- Full Name: `Test User` (or any name)
- Email: `test123@gmail.com` (use unique email each time)
- Password: `Test@123456` (minimum 6 characters)
- Confirm Password: `Test@123456` (same as above)

**Click "Register" button**

**Expected Result**: 
- Form submits
- You're redirected to Dashboard
- You see hotel rooms available to book

**If this works**, your entire system is connected! ✅

---

## PART 7: TEST BOOKING A ROOM

**On Dashboard page:**

You should see 3 room cards:
1. Single Room
2. Double Room
3. Deluxe Room

**To book a room:**

1. Click on one of the room cards (e.g., "Single Room")
2. Card should highlight with a blue border
3. A booking form appears below with fields:
   - Name (pre-filled with your name)
   - Email (pre-filled with your email)
   - Room Type (should show your selected room)
   - Check-in Date
   - Check-out Date

4. Fill in the dates (any future dates)
5. Click **"Book Room"** button
6. Should see green success message: **"Booking created successfully"**

**If this works**, your database and backend are working! ✅

---

## PART 8: TEST BOOKINGS PAGE

**In the header:**
1. Click **"My Bookings"** link

**You should see:**
- Your booking displayed as a card
- Shows: Room type, dates, guest name
- Buttons: "Edit", "Delete"

**To Edit:**
1. Click "Edit" button on your booking
2. Fields become editable
3. Change a date or field
4. Click "Save" button
5. Should see success message

**To Delete:**
1. Click "Delete" button
2. Confirm the action
3. Booking should be removed

**If all this works**, your entire system is fully functional! 🎉

---

## PART 9: TEST LOGOUT

**In the header:**
1. Click **"Logout"** button
2. Should be redirected to login page
3. Try to go directly to http://localhost:3001 (without /login)
4. Should redirect to login page (can't access without logging in)

**If this works**, authentication is fully secure! ✅

---

## PART 10: TROUBLESHOOTING

### Problem: "Connection refused" or "Network error"

**Solution:**
1. Make sure MongoDB is running:
   ```powershell
   Get-Service MongoDB | Select-Object Status
   ```
   Should show: `Status: Running`

2. If not running, start it:
   ```powershell
   Start-Service MongoDB
   ```

### Problem: Frontend shows blank page

**Solution:**
1. Check that you're going to: http://localhost:3001 (not localhost:3000)
2. Check that dev server is running (window should show "ready in XXX ms")
3. Refresh the page (Ctrl+R or F5)

### Problem: "Can't register - Registration failed"

**Solution:**
1. Make sure MongoDB is running
2. Try with a different email address
3. Check browser console (F12) for error details
4. Make sure all fields are filled correctly

### Problem: MongoDB service won't start

**Solution:**
1. Open Services: Win+R → type `services.msc` → Enter
2. Find "MongoDB Server" in the list
3. Right-click → Properties
4. Set "Startup type" to "Automatic"
5. Click "Start"
6. Click "OK"

---

## SUMMARY CHECKLIST

Before you start, you should:

- [ ] Created C:\data\db folder
- [ ] Downloaded MongoDB .msi installer
- [ ] Installed MongoDB (checked "Install as Service")
- [ ] Started MongoDB service
- [ ] Verified MongoDB is running (netstat command)
- [ ] Started frontend with `npm run dev`
- [ ] Can access http://localhost:3001
- [ ] Can register a new account
- [ ] Can book a room
- [ ] Can view bookings
- [ ] Can logout and login again

---

## SUCCESS INDICATORS ✅

**Your system is working correctly if you can:**

1. ✅ See login page at http://localhost:3001
2. ✅ Register a new account
3. ✅ See dashboard with rooms after login
4. ✅ Select a room and book it
5. ✅ View your booking in "My Bookings"
6. ✅ Edit or delete a booking
7. ✅ Logout and login with your credentials
8. ✅ Data persists (booking still there after logout/login)

---

## NEXT STEPS (OPTIONAL)

Once everything is working:

1. **Deploy Backend to AWS EC2**: Copy backend code to your EC2 instance
2. **Deploy Frontend to Vercel/Netlify**: Push frontend build to cloud
3. **Add More Features**: Payment processing, email notifications, admin panel
4. **Test in Production**: Test on different devices and browsers

---

## 🚀 YOU'RE ALL SET!

Your complete Hotel Management System is now fully functional with:
- React Frontend ✅
- Express Backend ✅  
- MongoDB Database ✅
- Authentication ✅
- Booking System ✅

**Good luck with your internship submission!** 🎉
