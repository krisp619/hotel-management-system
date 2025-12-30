# 🗄️ Database Setup Guide

Complete guide for setting up MongoDB for the Hotel Management System.

---

## Option 1: MongoDB Atlas (Cloud) - RECOMMENDED ☁️

### Advantages:
- ✓ No local installation needed
- ✓ Free tier with 512MB storage
- ✓ Automatic backups
- ✓ Scalable
- ✓ Easy to deploy to cloud

### Setup Steps:

#### 1. Create MongoDB Atlas Account
- Go to: https://www.mongodb.com/cloud/atlas
- Click "Sign Up Free"
- Enter your email and create password
- Verify your email

#### 2. Create a Project
- Click "Create" next to Project
- Enter project name: "Hotel Management"
- Click "Create Project"

#### 3. Create a Cluster
- Click "Create" a Cluster
- Choose Cluster Type: "Serverless" or "Shared Cluster" (Free)
- Select Cloud Provider: AWS, Google Cloud, or Azure
- Select Region: Closest to your location
- Click "Create Cluster" (may take 3-5 minutes)

#### 4. Create Database User
- Go to "Database Access" tab
- Click "Add New Database User"
- Choose "Password" for authentication
- Username: `admin` (or any name)
- Password: Create a strong password (save it!)
- User Privileges: "Read and write to any database"
- Click "Create User"

#### 5. Whitelist IP Address
- Go to "Network Access" tab
- Click "Add IP Address"
- Click "Allow Access from Anywhere" (for development)
- Or enter your specific IP address (for production)
- Click "Confirm"

#### 6. Get Connection String
- Go to "Clusters" tab
- Click "Connect" button
- Choose "Connect your application"
- Copy the connection string

#### 7. Update .env File
```env
MONGODB_URI=mongodb+srv://admin:YOUR_PASSWORD@cluster.mongodb.net/hotel-management?retryWrites=true&w=majority
PORT=5000
NODE_ENV=development
```

**Replace:**
- `admin` with your username
- `YOUR_PASSWORD` with your database password

---

## Option 2: Local MongoDB Installation

### For Windows:

#### 1. Download MongoDB Community Server
- Go to: https://www.mongodb.com/try/download/community
- Select Windows, MSI installer
- Download the installer

#### 2. Run Installer
- Run the downloaded `.msi` file
- Choose "Complete" installation
- Accept License Agreement
- Click "Install"

#### 3. Start MongoDB Service
Open PowerShell as Administrator and run:
```powershell
mongod
```

Or use MongoDB Compass (GUI):
```powershell
# Download from: https://www.mongodb.com/products/compass
# Install and open MongoDB Compass
# It will connect to your local MongoDB automatically
```

#### 4. Update .env File
```env
MONGODB_URI=mongodb://localhost:27017/hotel-management
PORT=5000
NODE_ENV=development
```

#### 5. Verify Connection
```bash
# Open another PowerShell window
mongo

# You should see MongoDB shell
# Type: exit to quit
```

---

### For Mac:

#### 1. Install Using Homebrew
```bash
# Install Homebrew first if not installed
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install MongoDB
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB
brew services start mongodb-community

# Stop MongoDB
brew services stop mongodb-community
```

#### 2. Update .env File
```env
MONGODB_URI=mongodb://localhost:27017/hotel-management
PORT=5000
NODE_ENV=development
```

---

### For Linux (Ubuntu):

```bash
# Import MongoDB GPG key
wget -qO - https://www.mongodb.org/static/pgp/server-5.0.asc | sudo apt-key add -

# Add MongoDB repository
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/5.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-5.0.list

# Update package lists
sudo apt-get update

# Install MongoDB
sudo apt-get install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod

# Check status
sudo systemctl status mongod
```

---

## Option 3: MongoDB Community Server with Docker

### Prerequisites:
- Docker installed: https://www.docker.com/products/docker-desktop

### Setup:

```bash
# Pull MongoDB image
docker pull mongo

# Run MongoDB container
docker run -d -p 27017:27017 --name mongodb mongo:latest

# Verify it's running
docker ps

# View logs
docker logs mongodb
```

### Update .env File:
```env
MONGODB_URI=mongodb://localhost:27017/hotel-management
PORT=5000
NODE_ENV=development
```

---

## Verify Database Connection

### Test Connection in Backend:

1. Start MongoDB (whichever option you chose)
2. Start backend server:
```bash
cd backend
npm run dev
```

3. Check console output:
```
✓ MongoDB Connected Successfully
✓ Server is running on http://localhost:5000
```

### Test with API:

```bash
# Open browser or use curl
curl http://localhost:5000/api/health

# Should return:
# {
#   "success": true,
#   "message": "Server is running successfully",
#   "timestamp": "2025-01-10T10:30:00.000Z"
# }
```

---

## Database Management

### Using MongoDB Compass (GUI):

1. Download: https://www.mongodb.com/products/compass
2. Install and open
3. For Local MongoDB:
   - It auto-connects to `mongodb://localhost:27017`
4. For Atlas:
   - Go to Atlas > Clusters > Connect
   - Choose "Connect with Compass"
   - Copy connection string
   - Paste in Compass

### Using MongoDB Shell:

```bash
# Connect to database
mongosh

# Show all databases
show dbs

# Use hotel database
use hotel-management

# Show all collections
show collections

# View all bookings
db.bookings.find()

# View one booking
db.bookings.findOne()

# Count bookings
db.bookings.countDocuments()

# Clear all bookings
db.bookings.deleteMany({})
```

---

## Backup and Export Data

### Export Bookings (JSON):

```bash
# Windows
mongodump --uri="mongodb://localhost:27017/hotel-management" --out=backup

# Export to JSON
mongoexport --uri="mongodb://localhost:27017" --db=hotel-management --collection=bookings --out=bookings.json
```

### Import Bookings (JSON):

```bash
# From JSON file
mongoimport --uri="mongodb://localhost:27017" --db=hotel-management --collection=bookings --file=bookings.json
```

---

## Production Deployment

### For AWS RDS:
- Not applicable (use Atlas instead)

### For MongoDB Atlas in Production:
1. Create a new cluster for production
2. Use strong password (30+ characters)
3. Restrict IP whitelist to your server IPs only
4. Enable automatic backups
5. Use SSL/TLS connection
6. Update `.env` with production connection string

### Security Best Practices:
- ✓ Use strong passwords (mix of letters, numbers, symbols)
- ✓ Never commit `.env` to Git
- ✓ Restrict database user permissions
- ✓ Use IP whitelist
- ✓ Enable encryption in transit
- ✓ Regular backups
- ✓ Use HTTPS for connections

---

## Troubleshooting

### Error: "MongoDB Connection Refused"
**Solution:**
- Ensure MongoDB service is running
- Check port 27017 is not blocked
- Verify connection string is correct

### Error: "Authentication Failed"
**Solution:**
- Check username and password in connection string
- Ensure database user has proper permissions
- Verify special characters are URL-encoded

### Error: "Network Error"
**Solution:**
- Check internet connection
- For Atlas: Verify IP whitelist includes your IP
- Check firewall settings

### Database is Empty
**Solution:**
- Check if you're connecting to correct database
- Use MongoDB Compass to verify
- Check application is actually saving data

---

## Performance Tips

1. **Indexing**: Create indexes for frequently queried fields
   ```javascript
   bookingSchema.index({ email: 1 });
   bookingSchema.index({ roomType: 1 });
   ```

2. **Connection Pooling**: Mongoose handles this automatically

3. **Query Optimization**: Use pagination (already implemented)

4. **Caching**: For frequently accessed data

---

## Support Resources

- MongoDB Atlas: https://www.mongodb.com/docs/atlas/
- MongoDB Community: https://www.mongodb.com/docs/manual/
- Mongoose: https://mongoosejs.com/
- MongoDB Compass: https://www.mongodb.com/products/compass

---

**Choose Atlas for cloud, or Local for development!**
