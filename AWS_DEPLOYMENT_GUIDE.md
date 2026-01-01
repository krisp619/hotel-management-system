# AWS EC2 Deployment Guide - Hotel Management System

## Project Overview
**Hotel Management System** - A full-stack web application for room booking with user authentication, built with Node.js, Express, React/HTML, and MongoDB Atlas.

## Deployment Architecture

```
┌─────────────────────────────────────────────────┐
│         Frontend (React/HTML/CSS/JS)             │
│  Running on HTTP Server (Port 8000)              │
│  (Can be deployed to S3 + CloudFront)            │
└────────────────┬────────────────────────────────┘
                 │ CORS + API Calls
                 ▼
┌─────────────────────────────────────────────────┐
│     Backend (Node.js + Express)                  │
│     AWS EC2 Instance (t2.micro)                  │
│     Port: 5000                                   │
│     Running on Amazon Linux 2023                │
└────────────────┬────────────────────────────────┘
                 │ Mongoose Driver
                 ▼
┌─────────────────────────────────────────────────┐
│     MongoDB Atlas (Cloud Database)               │
│     Connection: mongodb+srv://...                │
│     Auto-scaling, Backup, Security               │
└─────────────────────────────────────────────────┘
```

## AWS EC2 Setup Completed

### Instance Details
- **Instance Type:** t2.micro (Free Tier eligible)
- **Region:** us-east-1
- **OS:** Amazon Linux 2023
- **Status:** Running and accessible
- **Public IP:** Available on AWS Console

### Security Group Configuration
```
Inbound Rules:
├── SSH (port 22) – Anywhere – 0.0.0.0/0
├── HTTP (port 80) – Anywhere – 0.0.0.0/0
└── Custom TCP (port 5000) – Anywhere – 0.0.0.0/0

Outbound Rules:
└── All traffic allowed
```

### Access Method
- **EC2 Instance Connect** (browser-based SSH)
- No need for .pem file or local terminal SSH configuration

## Backend Deployment Process

### Step 1: Connect to EC2 Instance
```bash
# Use AWS EC2 Instance Connect from Console
# Or via terminal:
ssh -i your-key.pem ec2-user@your-public-ip
```

### Step 2: Update System & Install Dependencies
```bash
# Update packages
sudo yum update -y

# Install Node.js v18
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs

# Install Git
sudo yum install -y git

# Verify installations
node --version    # v18.x.x
npm --version     # 9.x.x
git --version     # 2.x.x
```

### Step 3: Clone Repository & Install Dependencies
```bash
# Navigate to application directory
cd ~

# Clone backend repository
git clone https://github.com/krisp619/hotel-management-system.git
cd hotel-management-system/backend

# Install npm dependencies
npm install

# Verify package.json
cat package.json
```

### Step 4: Configure Environment Variables
```bash
# Create .env file
nano .env

# Add these variables:
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/hotel-management
NODE_ENV=production
JWT_SECRET=your-super-secret-key-change-this

# Save: Ctrl+X → Y → Enter
```

### Step 5: Start Backend Server
```bash
# Test if server starts
node server.js

# Expected output:
# ==================================================
# Hotel Management System - Backend Server
# ==================================================
# ✓ Server running on port 5000
# ✓ Environment: production
# ✓ API URL: http://localhost:5000
# ==================================================
```

### Step 6: Verify Backend is Running
```bash
# In another terminal, test health endpoint
curl http://your-public-ip:5000/api/health

# Expected response:
# {
#   "success": true,
#   "message": "Server is healthy",
#   "timestamp": "2026-01-02T10:30:00Z",
#   "environment": "production"
# }
```

## Production Optimization: PM2 Process Manager

### Install PM2
```bash
sudo npm install -g pm2
pm2 startup
pm2 save
```

### Start Backend with PM2
```bash
# Start application
pm2 start server.js --name "hotel-backend"

# Configure to auto-start on reboot
pm2 startup
pm2 save

# Monitor application
pm2 monitor
pm2 logs
pm2 status
```

### PM2 Commands
```bash
pm2 start server.js           # Start application
pm2 stop server.js            # Stop application
pm2 restart server.js         # Restart application
pm2 delete server.js          # Remove from PM2
pm2 logs                       # View application logs
pm2 show server.js            # View detailed info
pm2 save                       # Save process list
```

## Frontend Deployment Options

### Option 1: Update Frontend to Use AWS Backend
Update `frontend/js/auth.js` and `frontend/js/script.js`:
```javascript
// Replace localhost with EC2 public IP
const API_URL = 'http://your-ec2-public-ip:5000';
```

### Option 2: Deploy Frontend to AWS S3 + CloudFront
1. Create S3 bucket
2. Upload frontend files
3. Configure bucket for static website hosting
4. Create CloudFront distribution
5. Configure custom domain

## Monitoring & Maintenance

### View Application Logs
```bash
# Real-time logs
pm2 logs

# View specific number of lines
pm2 logs --lines 100
```

### Check System Resources
```bash
# Check CPU and memory usage
top

# Check disk usage
df -h

# Check Node.js processes
ps aux | grep node
```

### MongoDB Connection Verification
```bash
# Test connection in Node.js shell
node -e "const mongoose = require('mongoose'); mongoose.connect(process.env.MONGODB_URI).then(() => console.log('Connected')).catch(err => console.log(err))"
```

## API Testing After Deployment

### Test Register Endpoint
```bash
curl -X POST http://your-ec2-ip:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "confirm_password": "password123"
  }'
```

### Test Login Endpoint
```bash
curl -X POST http://your-ec2-ip:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Test Protected Endpoint
```bash
curl -X GET http://your-ec2-ip:5000/api/bookings \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Security Best Practices Implemented

✅ **Authentication & Authorization**
- JWT-based token authentication
- Password hashing with bcrypt
- User ownership verification

✅ **Data Security**
- Environment variables for sensitive data
- CORS protection
- Input validation

✅ **API Security**
- Helmet.js for HTTP headers
- Rate limiting ready
- HTTPS recommended for production

✅ **Database Security**
- MongoDB Atlas with authentication
- IP whitelisting available
- Encrypted connections

## Cost Optimization

### Free Tier Benefits
- EC2 t2.micro: 750 hours/month
- MongoDB Atlas: 512 MB storage free tier
- Data transfer: 1 GB/month free

### Estimated Monthly Cost (Beyond Free Tier)
- EC2 t2.micro: ~$9-15
- MongoDB Atlas (M2 cluster): ~$57
- Data transfer: $0.09/GB
- **Total: ~$70-80/month**

## Troubleshooting

### Issue: Cannot connect to MongoDB
```
Solution: Check MongoDB URI in .env
- Verify cluster is active
- Add EC2 public IP to whitelist
- Check username/password
```

### Issue: Port 5000 already in use
```
Solution: Kill existing process
sudo lsof -i :5000
kill -9 <PID>

# Or use different port
PORT=3000 node server.js
```

### Issue: CORS error in frontend
```
Solution: Update CORS config in server.js
const corsOptions = {
  origin: 'http://your-frontend-url:8000',
  credentials: true
};
```

## Next Steps

1. **Configure Custom Domain** - Use Route 53 for DNS
2. **Enable HTTPS** - AWS Certificate Manager
3. **Add Load Balancer** - AWS Application Load Balancer
4. **Set up RDS** - Migrate from MongoDB Atlas
5. **Implement CDN** - CloudFront for static assets
6. **Add Monitoring** - CloudWatch for metrics
7. **Backup Strategy** - Automated MongoDB backups

## Documentation References

- [AWS EC2 Documentation](https://docs.aws.amazon.com/ec2/)
- [MongoDB Atlas Documentation](https://docs.mongodb.com/manual/)
- [Node.js Best Practices](https://nodejs.org/en/docs/guides/)
- [Express.js Documentation](https://expressjs.com/)

## Support & Troubleshooting

For issues:
1. Check server logs: `pm2 logs`
2. Verify MongoDB connection: Check MongoDB Atlas
3. Test endpoint: Use curl or Postman
4. Check EC2 security groups: Verify ports are open
