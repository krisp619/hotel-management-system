# Hotel Management System - Deployment Guide

## Overview

This guide covers deploying the Hotel Management System to a production environment. The system consists of:
- **Frontend**: React 18 SPA (Vite)
- **Backend**: Node.js/Express REST API
- **Database**: MongoDB

---

## Table of Contents

1. [Local Development Setup](#local-development-setup)
2. [Deployment Options](#deployment-options)
3. [AWS EC2 Deployment](#aws-ec2-deployment)
4. [Heroku Deployment](#heroku-deployment)
5. [Environment Configuration](#environment-configuration)
6. [Database Setup](#database-setup)
7. [Monitoring & Maintenance](#monitoring--maintenance)

---

## Local Development Setup

### Prerequisites
- Node.js 18+ and npm
- MongoDB 5.0+
- Git

### Installation Steps

1. **Clone the repository**
```bash
git clone https://github.com/krisp619/hotel-management-system.git
cd "Dynamic website"
```

2. **Backend Setup**
```bash
cd backend
npm install
```

3. **Configure Backend Environment**
Create `backend/.env`:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/hotel-management
NODE_ENV=development
JWT_SECRET=your-secret-key-here
CORS_ORIGIN=http://localhost:3001
```

4. **Start MongoDB**
```bash
# Windows
start-mongodb.bat

# macOS/Linux
mongod
```

5. **Start Backend Server**
```bash
npm start
```
Backend runs at `http://localhost:5000`

6. **Frontend Setup**
```bash
cd ../frontend-react
npm install
```

7. **Configure Frontend Environment**
Create `frontend-react/.env`:
```
VITE_API_BASE_URL=http://localhost:5000
```

8. **Start Frontend Development Server**
```bash
npm run dev
```
Frontend runs at `http://localhost:3001`

9. **Run Tests**
```bash
cd ..
powershell -ExecutionPolicy Bypass -File test-e2e.ps1
```

---

## Deployment Options

### Option 1: AWS EC2 (Recommended)
**Pros:**
- Free tier available (1 year)
- Full control over server
- Good for learning and production
- Scalable

**Cons:**
- Requires server management
- More complex setup

### Option 2: Heroku
**Pros:**
- Easy deployment (git push)
- Automatic SSL/TLS
- Built-in logging
- Free tier available

**Cons:**
- Less control
- Sleep mode on free tier
- Monthly costs after free credits

### Option 3: Vercel + Backend
**Pros:**
- Frontend hosting is very easy
- Automatic deployments from GitHub
- Great performance for React

**Cons:**
- Backend requires separate hosting
- Limited backend functionality

---

## AWS EC2 Deployment

### 1. Launch EC2 Instance

```bash
# Instance Configuration
- AMI: Amazon Linux 2023
- Type: t2.micro (Free Tier)
- Storage: 30GB SSD
- Security Group Rules:
  - Port 22: SSH (your IP)
  - Port 80: HTTP (0.0.0.0)
  - Port 443: HTTPS (0.0.0.0)
  - Port 5000: Custom TCP (0.0.0.0 - only if needed)
```

### 2. Connect to Instance

```bash
# On Windows, use PuTTY or:
ssh -i "your-key.pem" ec2-user@YOUR_PUBLIC_IP

# On macOS/Linux:
chmod 400 your-key.pem
ssh -i "your-key.pem" ec2-user@YOUR_PUBLIC_IP
```

### 3. Install Dependencies

```bash
# Update system
sudo yum update -y

# Install Node.js
curl -sL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs npm

# Install MongoDB
echo "[mongodb-org-5.0]
name=MongoDB Repository
baseurl=https://repo.mongodb.org/yum/amazon/2/mongodb-org/5.0/x86_64/
gpgcheck=1
enabled=1
gpgkey=https://www.mongodb.org/static/pgp/server-5.0.asc" | sudo tee /etc/yum.repos.d/mongodb-org-5.0.repo

sudo yum install -y mongodb-org

# Install PM2 (process manager)
sudo npm install -g pm2

# Install Nginx (reverse proxy)
sudo yum install -y nginx
```

### 4. Start MongoDB

```bash
# Start MongoDB service
sudo systemctl start mongod
sudo systemctl enable mongod

# Verify it's running
sudo systemctl status mongod
```

### 5. Deploy Application

```bash
# Clone repository
git clone https://github.com/krisp619/hotel-management-system.git
cd "Dynamic website"

# Backend setup
cd backend
npm install

# Create .env file
cat > .env << EOF
PORT=5000
MONGODB_URI=mongodb://localhost:27017/hotel-management
NODE_ENV=production
JWT_SECRET=$(openssl rand -base64 32)
CORS_ORIGIN=https://YOUR_DOMAIN_OR_IP
EOF

# Start backend with PM2
pm2 start npm --name "hotel-api" -- start

# Save PM2 configuration
pm2 save
sudo pm2 startup
```

### 6. Build and Deploy Frontend

```bash
cd ../frontend-react

# Update .env
cat > .env << EOF
VITE_API_BASE_URL=https://YOUR_DOMAIN_OR_IP:5000
EOF

# Build for production
npm run build

# The dist folder contains production-ready files
```

### 7. Configure Nginx

```bash
# Configure Nginx as reverse proxy
sudo cat > /etc/nginx/conf.d/hotel-management.conf << 'EOF'
upstream backend {
    server localhost:5000;
}

server {
    listen 80;
    server_name YOUR_DOMAIN_OR_IP;

    root /home/ec2-user/Dynamic\ website/frontend-react/dist;
    index index.html index.htm;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
EOF

# Test Nginx configuration
sudo nginx -t

# Start Nginx
sudo systemctl start nginx
sudo systemctl enable nginx
```

### 8. Set Up SSL Certificate (Optional but Recommended)

```bash
# Install Certbot
sudo yum install -y certbot python3-certbot-nginx

# Get free SSL certificate
sudo certbot --nginx -d YOUR_DOMAIN

# Auto-renewal is configured automatically
sudo systemctl status certbot.timer
```

### 9. Enable Firewall

```bash
# Start firewall
sudo systemctl start firewalld
sudo systemctl enable firewalld

# Allow HTTP/HTTPS
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --permanent --add-port=22/tcp
sudo firewall-cmd --reload
```

### 10. Verify Deployment

```bash
# Check application status
pm2 list
pm2 logs hotel-api

# Check MongoDB
mongo
  > use hotel-management
  > db.users.find()

# Check Nginx
sudo systemctl status nginx

# Test API
curl http://YOUR_PUBLIC_IP/api/health
```

---

## Heroku Deployment

### 1. Prepare Application

```bash
# Install Heroku CLI
# Download from https://devcenter.heroku.com/articles/heroku-cli

# Login to Heroku
heroku login

# Create Heroku app
heroku create hotel-management-system
```

### 2. Configure Buildpacks

```bash
# Add buildpacks for Node.js and static files
heroku buildpacks:add heroku/nodejs
heroku buildpacks:add https://github.com/heroku/heroku-buildpack-static.git
```

### 3. Set Environment Variables

```bash
heroku config:set MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/hotel-management
heroku config:set JWT_SECRET=$(openssl rand -base64 32)
heroku config:set NODE_ENV=production
```

### 4. Create Procfile

```bash
# In project root, create Procfile:
echo "web: npm start --prefix backend" > Procfile
```

### 5. Deploy

```bash
git add .
git commit -m "Prepare for Heroku deployment"
git push heroku main
```

### 6. Verify Deployment

```bash
# View logs
heroku logs --tail

# Open application
heroku open
```

---

## Environment Configuration

### Backend (.env)

```env
# Server
PORT=5000
NODE_ENV=production

# Database
MONGODB_URI=mongodb://localhost:27017/hotel-management
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database

# Authentication
JWT_SECRET=your-32-character-secret-key-here

# CORS
CORS_ORIGIN=https://yourdomain.com,http://localhost:3001
```

### Frontend (.env)

```env
# API Configuration
VITE_API_BASE_URL=https://api.yourdomain.com
# OR for local development:
# VITE_API_BASE_URL=http://localhost:5000
```

### Security Best Practices

1. **Never commit .env files** - Add to .gitignore
2. **Use strong JWT_SECRET** - Generate with: `openssl rand -base64 32`
3. **Enable HTTPS** - Use SSL certificates in production
4. **Validate input** - All API endpoints validate user input
5. **Use CORS properly** - Only allow trusted origins
6. **Keep dependencies updated** - Run `npm audit` regularly

---

## Database Setup

### MongoDB Atlas (Cloud)

1. **Create Account**
   - Visit https://www.mongodb.com/cloud/atlas
   - Sign up for free account
   - Create organization and project

2. **Create Cluster**
   - Click "Build a Database"
   - Choose Free tier (M0)
   - Select region
   - Create cluster

3. **Add Database User**
   - Go to Database Access
   - Add new database user
   - Copy connection string

4. **Configure IP Whitelist**
   - Go to Network Access
   - Add 0.0.0.0/0 for development (restrict in production)
   - Or add specific IP addresses

5. **Use Connection String**
   ```
   mongodb+srv://username:password@cluster.mongodb.net/hotel-management?retryWrites=true&w=majority
   ```

### Local MongoDB

1. **Install MongoDB Community Edition**
   - Windows: Download from https://www.mongodb.com/try/download/community
   - macOS: `brew install mongodb-community`
   - Linux: Follow official guide

2. **Start MongoDB**
   - Windows: Run `mongod` command
   - macOS/Linux: `brew services start mongodb-community`

3. **Verify Connection**
   ```bash
   mongo mongodb://localhost:27017/hotel-management
   ```

---

## Monitoring & Maintenance

### Log Files

```bash
# Backend logs (PM2)
pm2 logs hotel-api
pm2 logs hotel-api --err

# MongoDB logs
sudo tail -f /var/log/mongod.log

# Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### Backup Database

```bash
# MongoDB backup
mongodump --db hotel-management --out /backup/

# MongoDB restore
mongorestore --db hotel-management /backup/hotel-management/
```

### Update Application

```bash
cd /path/to/application

# Pull latest code
git pull origin main

# Update dependencies
npm install

# Rebuild frontend
cd frontend-react
npm run build
cd ..

# Restart backend
pm2 restart hotel-api

# Reload Nginx
sudo nginx -s reload
```

### Performance Monitoring

```bash
# Monitor system resources
top
# or
htop

# Monitor Node.js processes
pm2 monit

# Monitor database
mongo
  > use hotel-management
  > db.currentOp()
  > db.stats()
```

### Security Checklist

- [ ] Enable HTTPS/SSL
- [ ] Set strong JWT_SECRET
- [ ] Enable firewall
- [ ] Restrict MongoDB access
- [ ] Keep packages updated
- [ ] Enable authentication
- [ ] Set proper CORS headers
- [ ] Use environment variables
- [ ] Regular backups
- [ ] Monitor logs for errors

---

## Troubleshooting

### Application won't start

```bash
# Check if port is in use
lsof -i :5000
netstat -an | grep 5000

# Kill process on port
kill -9 PID
```

### MongoDB connection error

```bash
# Check MongoDB is running
sudo systemctl status mongod

# Check connection string
mongodb://localhost:27017/hotel-management

# Verify database exists
mongo
  > show dbs
  > use hotel-management
  > db.users.count()
```

### API returns 404

```bash
# Check Nginx configuration
sudo nginx -t
sudo systemctl status nginx

# Check backend is running
pm2 list
pm2 logs hotel-api

# Test API directly
curl http://localhost:5000/api/bookings
```

### CORS errors

```bash
# Check CORS_ORIGIN in .env matches frontend domain
# Verify Nginx proxy headers are correct
# Check browser console for actual error
```

---

## Support & Documentation

- **GitHub Repository**: https://github.com/krisp619/hotel-management-system
- **API Documentation**: See API_DOCUMENTATION.md
- **MongoDB Docs**: https://docs.mongodb.com/
- **Express Docs**: https://expressjs.com/
- **React Docs**: https://react.dev/
- **AWS EC2 Docs**: https://docs.aws.amazon.com/ec2/

---

**Last Updated**: January 2026
**Status**: Production Ready
