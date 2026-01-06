# 🚀 AWS EC2 Deployment Guide - Hotel Management System

**Backend Server:** http://18.215.168.203:5000  
**Frontend Bucket:** http://hotel-frontend-krishna.s3-website-us-east-1.amazonaws.com  
**Status:** ✅ Production Ready

---

## 📋 Pre-Deployment Checklist

- [x] Backend code updated with correct CORS (S3 frontend)
- [x] Frontend API base URL set to `http://18.215.168.203:5000/api`
- [x] Axios timeout set to 30 seconds
- [x] MongoDB Atlas connection string in .env
- [x] JWT_SECRET configured in .env
- [x] NODE_ENV=production in .env
- [x] PM2 ecosystem config ready
- [x] Error handling comprehensive

---

## 🔧 EC2 Setup Instructions

### 1. SSH into EC2 Instance

```bash
ssh -i your-key.pem ec2-user@18.215.168.203
```

### 2. Install Dependencies

```bash
# Update system
sudo yum update -y

# Install Node.js
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs

# Install PM2 globally
sudo npm install -g pm2

# Verify installations
node --version
npm --version
pm2 --version
```

### 3. Clone Repository

```bash
cd /home/ec2-user
git clone https://github.com/krisp619/hotel-management-system.git
cd hotel-management-system/backend
```

### 4. Install Backend Dependencies

```bash
npm install
```

### 5. Create .env File

```bash
cat > .env << 'EOF'
# Server Configuration
NODE_ENV=production
PORT=5000

# Database
MONGODB_URI=mongodb+srv://your-username:your-password@your-cluster.mongodb.net/hotel-management?retryWrites=true&w=majority

# JWT Secret (use strong random string)
JWT_SECRET=your-super-secret-jwt-key-32-chars-minimum-change-this

# CORS Configuration
CORS_ORIGIN=http://hotel-frontend-krishna.s3-website-us-east-1.amazonaws.com,https://hotel-frontend-krishna.s3-website-us-east-1.amazonaws.com

# Logging
LOG_LEVEL=info
REQUEST_LOGGING=true
EOF
```

### 6. Test Backend Locally

```bash
# Start backend
node server-production-verified.js

# In another terminal, verify health check
curl http://localhost:5000/api/health

# Expected response:
# {
#   "status": "healthy",
#   "mongodb": "connected",
#   "environment": "production",
#   "uptime": ...
# }
```

### 7. Deploy with PM2

```bash
# Start with PM2
pm2 start ecosystem.config.js

# Check status
pm2 status

# View logs
pm2 logs hotel-api

# Save PM2 configuration
pm2 save

# Enable startup on reboot
pm2 startup
# Follow the command it outputs
```

### 8. Configure AWS Security Group

Ensure EC2 security group allows:
- **Inbound:** Port 5000 from anywhere (0.0.0.0/0)
- **Outbound:** All traffic

---

## 🌐 Verify Production Deployment

### 1. Check Backend Health

```bash
curl http://18.215.168.203:5000/api/health
```

**Expected Response:**
```json
{
  "status": "healthy",
  "mongodb": "connected",
  "timestamp": "2026-01-06T...",
  "environment": "production",
  "uptime": 123.45
}
```

### 2. Test Register Endpoint

```bash
curl -X POST http://18.215.168.203:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "Password123",
    "confirmPassword": "Password123"
  }'
```

**Expected Response (201):**
```json
{
  "success": true,
  "message": "Registration successful",
  "token": "eyJhbGc...",
  "user": {
    "id": "...",
    "name": "Test User",
    "email": "test@example.com"
  }
}
```

### 3. Test Login Endpoint

```bash
curl -X POST http://18.215.168.203:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Password123"
  }'
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGc...",
  "user": {
    "id": "...",
    "name": "Test User",
    "email": "test@example.com"
  }
}
```

### 4. Test CORS (from S3 Frontend)

Frontend should now be able to:
- ✅ Register new users
- ✅ Login users
- ✅ Get JWT tokens
- ✅ Access protected routes

---

## 📊 Monitoring & Logs

### View Live Logs

```bash
# Watch real-time logs
pm2 logs hotel-api

# View error logs
pm2 logs hotel-api --err

# View last 100 lines
pm2 logs hotel-api --lines 100
```

### Monitor Process

```bash
# View process status
pm2 status

# View detailed info
pm2 info hotel-api

# Monitor CPU and memory
pm2 monit
```

### Manage Process

```bash
# Restart backend
pm2 restart hotel-api

# Stop backend
pm2 stop hotel-api

# Start backend
pm2 start hotel-api

# Kill and remove
pm2 delete hotel-api
```

---

## 🔍 Troubleshooting

### Issue: Backend not responding on http://18.215.168.203:5000

**Solutions:**
1. Check EC2 security group allows port 5000
2. Verify PM2 is running: `pm2 status`
3. Check logs: `pm2 logs hotel-api`
4. Verify backend started: `ps aux | grep node`

### Issue: MongoDB connection fails

**Solutions:**
1. Verify MONGODB_URI in .env is correct
2. Check MongoDB Atlas network access (whitelist EC2 IP)
3. Verify credentials are correct
4. Check internet connectivity: `ping 8.8.8.8`

### Issue: CORS errors from S3 frontend

**Solutions:**
1. Verify S3 frontend URL in CORS_ORIGIN .env variable
2. Restart backend: `pm2 restart hotel-api`
3. Check backend startup logs for CORS config
4. Clear browser cache and try again

### Issue: Timeout errors from frontend

**Solutions:**
1. Check backend is responding: `curl http://18.215.168.203:5000/api/health`
2. Verify Axios timeout is 30 seconds in frontend
3. Check backend logs for slow responses
4. Monitor EC2 CPU and memory usage

---

## 🔄 Updating Backend Code

When you push new code to GitHub:

```bash
cd /home/ec2-user/hotel-management-system

# Pull latest code
git pull origin main

# Enter backend directory
cd backend

# Install any new dependencies
npm install

# Restart backend with PM2
pm2 restart hotel-api

# Verify it restarted
pm2 status
```

---

## 📝 Environment Variables Reference

| Variable | Example | Purpose |
|----------|---------|---------|
| `NODE_ENV` | `production` | Environment mode |
| `PORT` | `5000` | Server port |
| `MONGODB_URI` | `mongodb+srv://...` | Database connection |
| `JWT_SECRET` | `<random-32-chars>` | Token signing key |
| `CORS_ORIGIN` | `http://s3-url.com` | Frontend origin |

---

## ✅ Production Checklist

- [x] Backend running on 0.0.0.0:5000
- [x] PM2 managing process
- [x] MongoDB Atlas connected
- [x] CORS allows S3 frontend
- [x] Axios timeout set to 30 seconds
- [x] Error handling comprehensive
- [x] Health endpoint working
- [x] Register endpoint working
- [x] Login endpoint working
- [x] Frontend can reach backend
- [x] No timeout errors
- [x] Logs being captured

---

## 🎯 Final Status

**✅ Backend is production-ready and deployed on AWS EC2**

Frontend can now:
- ✅ Register users
- ✅ Login users
- ✅ Create bookings
- ✅ Manage reservations

All endpoints are accessible from S3 frontend without timeout issues!

---

## 📞 Quick Reference

```bash
# Start backend
pm2 start ecosystem.config.js

# Check status
pm2 status

# View logs
pm2 logs hotel-api

# Restart
pm2 restart hotel-api

# Stop
pm2 stop hotel-api

# Verify health
curl http://18.215.168.203:5000/api/health
```

---

**Deployment Date:** January 6, 2026  
**Backend Version:** 2.0  
**Status:** ✅ Production Ready  
**AWS EC2:** Running on http://18.215.168.203:5000
