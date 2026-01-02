# Hotel Management System - Setup & Troubleshooting Guide

## ✅ WHAT'S WORKING

### Frontend
- **React 18 App**: Running at http://localhost:3001 ✅
- **Pages**: Login, Register, Dashboard, Bookings (all built)
- **Design**: Professional red header, clean forms
- **Routing**: Protected routes configured
- **State Management**: Authentication hooks ready

### Backend
- **Express Server**: Configured for port 5000
- **API Routes**: All defined (auth, bookings, health)
- **JWT Security**: Implemented
- **CORS**: Configured for localhost:3001

---

## ❌ WHAT'S NOT WORKING

### MongoDB Database
- **Status**: NOT properly installed/running
- **Issue**: mongod.exe not found in expected locations
- **Result**: Backend can't store data

---

## 🔧 QUICK FIX - COMPLETE MONGODB INSTALLATION

### Step 1: Download MongoDB Community Edition
1. Go to: https://www.mongodb.com/try/download/community
2. Select **Windows** → **x86_64** → **MSI**
3. Download the installer

### Step 2: Run Installer (IMPORTANT - Follow Exactly)
1. Double-click the `.msi` file you downloaded
2. Click **"Next"**
3. Click **"I Agree"** (license)
4. Click **"Next"**
5. Select **"Complete"** installation
6. **⭐ VERY IMPORTANT**: Check the box that says **"Install MongoDB as a Service"**
7. Click **"Next"** → **"Install"**
8. Wait 2-3 minutes for installation to complete
9. Click **"Finish"**

### Step 3: Create Data Directory
Open PowerShell and run:
```powershell
mkdir C:\data\db
```

### Step 4: Start MongoDB Service
```powershell
Start-Service MongoDB
```

### Step 5: Verify it's Running
```powershell
Get-Service MongoDB | Select-Object Status, Name
```

You should see: **Status: Running**

---

## 🧪 TEST THE FULL SYSTEM

Once MongoDB is running:

### Test 1: Frontend
- Open: http://localhost:3001
- Should see: Login page with red header ✅

### Test 2: Backend Health Check
```powershell
(Invoke-WebRequest http://localhost:5000/api/health).Content | ConvertFrom-Json
```

Should return: `{"status":"healthy"}`

### Test 3: Register Account
1. Go to http://localhost:3001
2. Click "Register here" link
3. Fill in: Name, Email, Password
4. Click "Register"
5. Should redirect to Dashboard
6. Should show rooms to book

### Test 4: Book a Room
1. On Dashboard, click on a room card (Single, Double, or Deluxe)
2. Fill in check-in/out dates
3. Click "Book Room"
4. Should see success message

### Test 5: Manage Bookings
1. Click "My Bookings" in header
2. Should show your booking
3. Can edit or delete

---

## 📋 TROUBLESHOOTING

### MongoDB Service Won't Start
1. Open Services (Win+R → `services.msc`)
2. Find **"MongoDB Server"**
3. Right-click → **"Properties"**
4. Make sure "Startup type" is set to **"Automatic"**
5. Click "Start"

### Still Getting Connection Error
1. Check if port 27017 is in use:
   ```powershell
   netstat -ano | findstr :27017
   ```
2. If nothing shows, MongoDB isn't running
3. Try starting manually:
   ```powershell
   & "C:\Program Files\MongoDB\Server\7.0\bin\mongod.exe"
   ```

### Frontend Won't Load
1. Make sure dev server is running:
   ```powershell
   cd "C:\Users\krishna potdar\OneDrive\Desktop\Dyanamic website\frontend-react"
   npm run dev
   ```
2. Go to http://localhost:3001

### Backend Won't Start
1. MongoDB must be running first
2. Then start backend (if using Node.js):
   ```powershell
   cd backend
   node server.js
   ```

---

## 🎯 FINAL CHECKLIST

- [ ] MongoDB installer downloaded
- [ ] MongoDB installed with "Install as Service" checked
- [ ] C:\data\db directory created
- [ ] MongoDB service started (Status: Running)
- [ ] Frontend running at http://localhost:3001
- [ ] Backend health check returning data
- [ ] Can register a new account
- [ ] Can book a room
- [ ] Can view bookings

---

## 📞 IF STILL STUCK

If MongoDB installation is still problematic, you can:

1. **Uninstall completely:**
   - Control Panel → Add/Remove Programs
   - Find "MongoDB" → Uninstall
   - Restart computer

2. **Reinstall fresh:**
   - Download latest version from official site
   - Follow steps above carefully

3. **Alternative: Use Docker** (if you have Docker Desktop installed)
   ```powershell
   docker run -d -p 27017:27017 --name mongodb mongo
   ```

---

## 📞 CONTACT SUPPORT

If you're still having issues after following all steps:
1. Take a screenshot of the error
2. Run this for diagnostics:
   ```powershell
   Get-Service MongoDB
   netstat -ano | findstr :27017
   Get-ChildItem C:\data\db
   ```
3. Share the output

---

**Once MongoDB is properly running, your entire Hotel Management System will be fully functional!** 🎉
