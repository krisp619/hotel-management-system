# MongoDB Installation Guide

## Step-by-Step Installation

### 1. Download MongoDB Community Edition
- Go to: https://www.mongodb.com/try/download/community
- Select Windows (your OS)
- Click "Download"
- You'll get a `.msi` installer file

### 2. Run the Installer
- Double-click the downloaded `.msi` file
- Click "Next" → "I Agree" → "Next"
- Choose "Complete" installation
- **IMPORTANT**: Check the box "Install MongoDB as a Service"
- Click "Install"
- Wait for it to complete (takes 2-3 minutes)
- Click "Finish"

### 3. Verify Installation
Open PowerShell and run:
```powershell
mongosh
```

You should see:
```
mongosh 2.x.x
...
test>
```

If you see the `test>` prompt, MongoDB is running! Type `exit` to close.

### 4. Create Data Directory (if needed)
If you get a data directory error, create:
```powershell
mkdir C:\data\db
```

### 5. Restart the Backend
Once MongoDB is installed and running, your backend will automatically connect!

The backend is configured to use:
```
mongodb://localhost:27017/hotel-management
```

## Troubleshooting

### MongoDB Service Won't Start
1. Open Services (Windows + R → `services.msc`)
2. Look for "MongoDB Server"
3. Right-click → "Start"

### Still Having Issues?
1. Make sure C:\data\db directory exists and is writable
2. Check Windows Firewall allows port 27017
3. Restart Windows (if all else fails)

## Once MongoDB is Running

Your app will automatically work:
1. Frontend: http://localhost:3001
2. Backend: http://localhost:5000 (now working)
3. Database: localhost:27017

Then you can:
- Register a new account
- Login
- Book rooms
- Manage bookings

All data will be stored in MongoDB locally!
