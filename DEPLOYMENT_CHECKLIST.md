# 🎯 AWS EC2 PRODUCTION DEPLOYMENT CHECKLIST

**Backend Server IP:** 18.215.168.203:5000  
**Frontend S3:** hotel-frontend-krishna.s3-website-us-east-1.amazonaws.com  
**Status:** ✅ Ready to Deploy

---

## ⚡ QUICK START (5 minutes)

### Step 1: SSH into EC2
```bash
ssh -i your-key.pem ec2-user@18.215.168.203
```

### Step 2: Setup Backend
```bash
cd /home/ec2-user
git clone https://github.com/krisp619/hotel-management-system.git
cd hotel-management-system/backend

# Create .env file
cat > .env << 'EOF'
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://your-user:your-pass@cluster.mongodb.net/hotel-management
JWT_SECRET=your-32-char-secret-key
CORS_ORIGIN=http://hotel-frontend-krishna.s3-website-us-east-1.amazonaws.com,https://hotel-frontend-krishna.s3-website-us-east-1.amazonaws.com
EOF

# Install & start
npm install
sudo npm install -g pm2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### Step 3: Verify Backend
```bash
curl http://18.215.168.203:5000/api/health
```

### Step 4: Deploy Frontend
```bash
# Locally
cd frontend-react
npm run build
aws s3 sync dist/ s3://hotel-frontend-krishna --delete
```

### Step 5: Test from S3
Open: http://hotel-frontend-krishna.s3-website-us-east-1.amazonaws.com
- ✅ Register works
- ✅ Login works
- ✅ No timeout errors

---

## 📋 Pre-Deployment Checklist

### Local Development
- [ ] Clone latest code: `git pull origin main`
- [ ] Check .env has MongoDB URI and JWT_SECRET
- [ ] Backend starts locally: `npm start`
- [ ] Frontend builds: `npm run build`
- [ ] No TypeScript errors
- [ ] No console errors

### AWS EC2 Setup
- [ ] EC2 instance running (18.215.168.203)
- [ ] Security group allows port 5000
- [ ] SSH key available
- [ ] Can SSH into instance

### AWS S3 Setup
- [ ] S3 bucket created
- [ ] Static website hosting enabled
- [ ] Bucket policy allows public access
- [ ] CloudFront (optional) configured

### MongoDB Atlas
- [ ] Database created
- [ ] User created with password
- [ ] Connection string ready (mongodb+srv://...)
- [ ] Network access whitelist EC2 IP (18.215.168.203)
- [ ] Test connection works

---

## 🚀 Deployment Commands

### Backend Deployment
```bash
# SSH into EC2
ssh -i your-key.pem ec2-user@18.215.168.203

# Clone repository
git clone https://github.com/krisp619/hotel-management-system.git
cd hotel-management-system/backend

# Create environment file
nano .env
# Copy your values:
# NODE_ENV=production
# PORT=5000
# MONGODB_URI=mongodb+srv://...
# JWT_SECRET=<long-random-string>
# CORS_ORIGIN=...

# Install dependencies
npm install

# Install PM2
sudo npm install -g pm2

# Start with PM2
pm2 start ecosystem.config.js

# Save and enable startup
pm2 save
pm2 startup
```

### Frontend Deployment
```bash
# Locally
cd frontend-react

# Ensure .env.production has correct API URL
cat .env.production
# Should have: VITE_API_BASE_URL=http://18.215.168.203:5000/api

# Build production bundle
npm run build

# Deploy to S3
aws s3 sync dist/ s3://hotel-frontend-krishna --delete --region us-east-1
```

---

## ✅ Verification Steps

### 1. Check Backend is Running
```bash
# From EC2
pm2 status
# Should show: hotel-api running

# From anywhere
curl http://18.215.168.203:5000/api/health
# Expected: {"status":"healthy","mongodb":"connected",...}
```

### 2. Check Frontend is Deployed
```bash
# Visit S3 bucket
http://hotel-frontend-krishna.s3-website-us-east-1.amazonaws.com
# Should load React app
```

### 3. Test Register
```bash
# From S3 frontend, fill Register form:
Name: Test User
Email: test@example.com
Password: Test123456
Confirm: Test123456

# Click Register
# Expected: Success message + redirect to dashboard
```

### 4. Test Login
```bash
# From S3 frontend, fill Login form:
Email: test@example.com
Password: Test123456

# Click Login
# Expected: Success message + JWT token + redirect to dashboard
```

### 5. Check EC2 Logs
```bash
# SSH to EC2, then:
pm2 logs hotel-api

# Should show:
# ✓ User registered: test@example.com
# ✓ User logged in: test@example.com
```

---

## 🔍 Troubleshooting

### Backend won't start
```bash
# Check PM2 status
pm2 status

# View error logs
pm2 logs hotel-api --err

# Check port is not in use
sudo lsof -i :5000

# Check .env file exists and has values
cat .env
```

### CORS error from S3
```bash
# Verify CORS_ORIGIN in .env
grep CORS_ORIGIN /home/ec2-user/hotel-management-system/backend/.env

# Restart backend
pm2 restart hotel-api

# Check it restarted
pm2 status
```

### MongoDB connection failed
```bash
# Verify connection string
grep MONGODB_URI /home/ec2-user/hotel-management-system/backend/.env

# Test connection
# Login to MongoDB Atlas, check:
# 1. Connection string is correct
# 2. Username/password correct
# 3. EC2 IP whitelisted in network access
# 4. Database exists
```

### Timeout error from frontend
```bash
# Check backend is responding
curl http://18.215.168.203:5000/api/health

# Check EC2 performance
free -h  # Memory
df -h    # Disk
top      # CPU

# Check backend logs
pm2 logs hotel-api
```

---

## 📊 Production Monitoring

### Daily
```bash
# Check process is running
pm2 status

# Check logs for errors
pm2 logs hotel-api | grep -i error

# Check disk space
df -h

# Check memory usage
free -h
```

### Weekly
```bash
# Check database size
# (In MongoDB Atlas dashboard)

# Review application logs
pm2 logs hotel-api --lines 1000

# Check for any warnings
pm2 logs hotel-api | grep -i warn
```

### Monthly
```bash
# Review performance metrics
# (In CloudWatch or MongoDB Atlas)

# Update dependencies
npm outdated

# Check for security vulnerabilities
npm audit

# Backup database
# (MongoDB Atlas automatic backups)
```

---

## 🔐 Security Checklist

- [ ] JWT_SECRET is strong (32+ characters, random)
- [ ] .env file is in .gitignore
- [ ] MongoDB password is strong
- [ ] EC2 security group restricts port 5000 (or whitelist IPs)
- [ ] No hardcoded secrets in code
- [ ] HTTPS configured (when domain available)
- [ ] CORS only allows S3 frontend
- [ ] Database backups enabled

---

## 📚 Documentation Reference

| Document | Purpose |
|----------|---------|
| [AWS_EC2_DEPLOYMENT_GUIDE.md](AWS_EC2_DEPLOYMENT_GUIDE.md) | Detailed EC2 setup |
| [FRONTEND_ENV_SETUP.md](FRONTEND_ENV_SETUP.md) | Frontend configuration |
| [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md) | All changes made |
| [README_FIXES.md](backend/README_FIXES.md) | Backend overview |

---

## 📞 Support

### Quick Fixes
- Backend not responding: Restart with `pm2 restart hotel-api`
- CORS blocked: Check CORS_ORIGIN in .env, restart backend
- Timeout errors: Check backend logs with `pm2 logs hotel-api`
- Database connection: Verify MongoDB URI and whitelist EC2 IP

### Debugging
```bash
# Full error log
pm2 logs hotel-api --err | tail -100

# Watch logs in real-time
pm2 logs hotel-api

# Check specific endpoint
curl -v http://18.215.168.203:5000/api/health
```

---

## ✨ Success Indicators

You'll know deployment is successful when:

✅ Backend responds to health check  
✅ Frontend loads from S3  
✅ Register form creates users in MongoDB  
✅ Login form returns JWT tokens  
✅ No timeout errors in browser console  
✅ EC2 logs show successful requests  
✅ MongoDB Atlas shows new user documents  
✅ Users can access dashboard after login  

---

## 🎯 Final Checklist

```bash
# Pre-deployment
[ ] All code pushed to GitHub
[ ] .env values ready
[ ] EC2 instance running
[ ] MongoDB Atlas configured
[ ] S3 bucket ready

# Deployment
[ ] Backend cloned to EC2
[ ] Backend .env configured
[ ] Backend started with PM2
[ ] Frontend built locally
[ ] Frontend deployed to S3

# Verification
[ ] Health check returns 200
[ ] Frontend loads from S3
[ ] Register works
[ ] Login works
[ ] No timeout errors
[ ] MongoDB shows new users

# Post-deployment
[ ] PM2 save executed
[ ] PM2 startup configured
[ ] Logs reviewed for errors
[ ] Monitoring enabled
[ ] Team notified
```

---

**Deployment Status:** ✅ Ready  
**Backend:** http://18.215.168.203:5000  
**Frontend:** http://hotel-frontend-krishna.s3-website-us-east-1.amazonaws.com  
**Estimated Deployment Time:** 15-20 minutes
