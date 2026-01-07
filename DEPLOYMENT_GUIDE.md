# 🚀 QUICK START DEPLOYMENT GUIDE

## Overview
This guide will help you deploy your hotel booking platform to production quickly and securely.

---

## PREREQUISITES

Before deploying, ensure you have:
- ✅ AWS account (for S3 and EC2)
- ✅ MongoDB Atlas account (free tier available)
- ✅ Domain name (optional, but recommended)
- ✅ Environment variables configured
- ✅ GitHub account (for version control)

---

## PART 1: FRONTEND DEPLOYMENT (S3 + CloudFront)

### Step 1: Build Frontend
```bash
cd frontend-react
npm install
npm run build
```

### Step 2: Create S3 Bucket
1. Go to AWS S3 console
2. Create bucket: `hotel-booking-frontend-prod`
3. Enable static website hosting
4. Set index.html as default document

### Step 3: Upload Build to S3
```bash
aws s3 sync dist/ s3://hotel-booking-frontend-prod/ --acl public-read
```

### Step 4: Configure CloudFront (Optional but Recommended)
1. Create CloudFront distribution pointing to S3 bucket
2. Use S3 as origin
3. Set cache behavior (long TTL for static assets)
4. Point domain to CloudFront

### Step 5: Update Environment Variables
In `frontend-react/.env.production`:
```
VITE_API_BASE_URL=https://api.yourdomain.com
VITE_APP_NAME=Hotel Booking
```

---

## PART 2: BACKEND DEPLOYMENT (EC2)

### Step 1: Launch EC2 Instance
1. Go to AWS EC2 console
2. Launch instance: t2.micro (eligible for free tier)
3. Ubuntu 22.04 LTS
4. Create security group allowing ports 22 (SSH), 80 (HTTP), 443 (HTTPS)
5. Create and download key pair

### Step 2: Connect to Instance
```bash
chmod 400 your-key-pair.pem
ssh -i your-key-pair.pem ubuntu@your-instance-ip
```

### Step 3: Install Dependencies
```bash
# Update packages
sudo apt update && sudo apt upgrade -y

# Install Node.js and npm
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install MongoDB (optional - use Atlas instead)
# Or configure MongoDB Atlas connection

# Install PM2 for process management
sudo npm install -g pm2
```

### Step 4: Deploy Backend
```bash
# Clone repository
git clone https://github.com/yourusername/hotel-booking-backend.git
cd hotel-booking-backend

# Install dependencies
npm install

# Create .env file
nano .env
```

#### .env Configuration
```
# Server
PORT=5000
NODE_ENV=production

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/hotel-booking

# JWT
JWT_SECRET=your-super-secret-key-here-min-32-chars

# CORS
CORS_ORIGINS=https://yourdomain.com,https://www.yourdomain.com

# Email (optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

### Step 5: Start Backend with PM2
```bash
# Start application
pm2 start server.js --name "hotel-api"

# Save PM2 configuration
pm2 save

# Set up PM2 startup
pm2 startup
```

### Step 6: Setup Nginx as Reverse Proxy
```bash
# Install Nginx
sudo apt install -y nginx

# Create Nginx config
sudo nano /etc/nginx/sites-available/hotel-api
```

#### Nginx Configuration
```nginx
server {
    listen 80;
    server_name api.yourdomain.com;

    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name api.yourdomain.com;

    # SSL certificates (using Let's Encrypt)
    ssl_certificate /etc/letsencrypt/live/api.yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.yourdomain.com/privkey.pem;

    # Proxy to Node.js
    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### Step 7: Enable Nginx Config
```bash
# Create symbolic link
sudo ln -s /etc/nginx/sites-available/hotel-api /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Start Nginx
sudo systemctl start nginx
sudo systemctl enable nginx
```

### Step 8: Setup SSL Certificate (Let's Encrypt)
```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Generate certificate
sudo certbot certonly --nginx -d api.yourdomain.com

# Auto-renewal (already enabled by default)
sudo systemctl enable certbot.timer
```

---

## PART 3: DATABASE SETUP

### MongoDB Atlas
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create free cluster
3. Create database user with strong password
4. Add IP whitelist (or allow all for development)
5. Get connection string
6. Update MONGODB_URI in .env

---

## PART 4: DOMAIN & DNS

### Point Domain to CloudFront (Frontend)
```
Type: CNAME
Name: yourdomain.com
Value: d1234abcd.cloudfront.net
TTL: 3600
```

### Point Domain to Nginx (Backend)
```
Type: A
Name: api.yourdomain.com
Value: your-ec2-instance-ip
TTL: 3600
```

---

## PART 5: VERIFY DEPLOYMENT

### Test Frontend
1. Visit `https://yourdomain.com`
2. Verify page loads
3. Check browser console for errors
4. Test responsive design

### Test Backend
```bash
# Test health endpoint
curl -X GET https://api.yourdomain.com/health

# Test registration
curl -X POST https://api.yourdomain.com/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Test User",
    "email": "test@example.com",
    "password": "TestPassword123",
    "phone": "1234567890"
  }'

# Test login
curl -X POST https://api.yourdomain.com/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPassword123"
  }'
```

### Test Protected Route
```bash
# Use token from login response
curl -X GET https://api.yourdomain.com/api/bookings \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## MONITORING & MAINTENANCE

### Check PM2 Status
```bash
pm2 status
pm2 logs hotel-api
```

### Monitor Server Resources
```bash
# Install monitoring tool
sudo apt install -y htop
htop

# Check disk usage
df -h

# Check memory
free -m
```

### Backup Database
```bash
# Create scheduled backup
0 2 * * * mongodump --uri="$MONGODB_URI" --out=/home/ubuntu/backups/$(date +\%Y\%m\%d)
```

### Auto-restart on Reboot
```bash
# PM2 startup
pm2 startup

# Save current process list
pm2 save
```

---

## TROUBLESHOOTING

### Frontend not loading
- Check CloudFront cache invalidation
- Verify S3 bucket is public
- Check browser console for errors
- Verify CORS is enabled

### Backend returning 502
- Check PM2 process is running: `pm2 status`
- Check Nginx logs: `sudo tail -f /var/log/nginx/error.log`
- Verify Node.js is listening on port 5000
- Check MongoDB connection

### CORS errors
- Verify CORS_ORIGINS includes frontend domain
- Check browser console for specific origin
- Restart backend: `pm2 restart hotel-api`

### SSL certificate issues
- Check certificate expiration: `sudo certbot certificates`
- Renew if needed: `sudo certbot renew`
- Check Nginx configuration syntax

---

## COST ESTIMATION (AWS)

### Free Tier (First 12 months)
- EC2 t2.micro: $0/month
- RDS: Not needed (using MongoDB Atlas)
- S3: ~$0.50/month (minimal storage)
- CloudFront: ~$5/month (minimal requests)
- **Total: ~$5.50/month**

### After 12 months (Realistic)
- EC2 t2.micro: ~$8/month
- S3: ~$1/month
- CloudFront: ~$10/month
- MongoDB Atlas: Free tier sufficient
- **Total: ~$19/month**

### For Higher Traffic (Recommended)
- EC2 t3.small: ~$15/month
- RDS MySQL: ~$25/month
- S3 + CloudFront: ~$20/month
- **Total: ~$60/month**

---

## SECURITY CHECKLIST

- [ ] Generate strong JWT_SECRET (use: `openssl rand -base64 32`)
- [ ] Enable HTTPS for all domains
- [ ] Configure firewall to block unnecessary ports
- [ ] Use environment variables for sensitive data
- [ ] Enable database user authentication
- [ ] Regular security updates (`sudo apt update && sudo apt upgrade`)
- [ ] Enable logging and monitoring
- [ ] Configure automated backups
- [ ] Set strong passwords for all services
- [ ] Review CORS origins regularly

---

## PERFORMANCE OPTIMIZATION

### Frontend
- CloudFront caching enabled ✅
- Gzip compression enabled ✅
- Image optimization recommended
- Code splitting in place

### Backend
- Database indexing recommended
- Caching layer (Redis) recommended for scaling
- Load balancing (AWS ALB) for high traffic
- Rate limiting recommended

### Database
- Regular index analysis
- Connection pooling enabled
- Backup strategy implemented

---

## NEXT STEPS

1. ✅ Deploy frontend to S3
2. ✅ Deploy backend to EC2
3. ✅ Configure domain and SSL
4. ✅ Test all features
5. ✅ Setup monitoring
6. ✅ Configure backups
7. ✅ Plan scaling strategy

---

## ADDITIONAL RESOURCES

- [AWS EC2 Documentation](https://docs.aws.amazon.com/ec2/)
- [MongoDB Atlas Guide](https://docs.atlas.mongodb.com/)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [Let's Encrypt](https://letsencrypt.org/)
- [PM2 Documentation](https://pm2.keymetrics.io/docs/)

---

## SUPPORT CONTACTS

For deployment issues:
1. Check AWS status page
2. Review error logs
3. Consult documentation
4. Contact cloud provider support

---

**Deployment Status**: Ready for Production ✅  
**Estimated Setup Time**: 1-2 hours  
**Difficulty Level**: Intermediate

Good luck with your deployment! 🚀
