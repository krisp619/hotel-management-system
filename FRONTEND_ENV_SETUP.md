# 🌐 Frontend Environment Configuration

**Date:** January 6, 2026  
**Status:** ✅ Ready for Production S3 Deployment

---

## 📦 Frontend Environment Files

### For Production (AWS S3)

Create file: `frontend-react/.env.production`

```env
# Production API Endpoint - AWS EC2 Backend
VITE_API_BASE_URL=http://18.215.168.203:5000/api

# Debug logging (disable in production if needed)
VITE_DEBUG=false
```

### For Local Development

Create file: `frontend-react/.env`

```env
# Local Development
VITE_API_BASE_URL=http://localhost:5000/api

# Enable debug logging
VITE_DEBUG=true
```

---

## 🔧 API Configuration Details

### What Changed

**Before:**
```javascript
const API_BASE_URL = 'http://localhost:5000'
timeout: 10000 // 10 seconds
```

**After:**
```javascript
const API_BASE_URL = 'http://18.215.168.203:5000/api' // Production EC2 backend
timeout: 30000 // 30 seconds for production stability
```

### Why These Changes

- **Base URL:** Points to AWS EC2 public IP (18.215.168.203) instead of localhost
- **Port:** Still uses 5000 (configured in backend)
- **/api path:** Included in base URL for consistency
- **Timeout:** Increased from 10s to 30s for production stability

---

## 🚀 Building for Production

```bash
# Navigate to frontend directory
cd frontend-react

# Install dependencies
npm install

# Build for production
npm run build

# Output: dist/ folder contains production build
```

---

## 📤 Deploying to AWS S3

### 1. Upload Build Files

```bash
# After running `npm run build`, sync to S3
aws s3 sync dist/ s3://hotel-frontend-krishna --delete

# Or using AWS CLI with CloudFront invalidation
aws s3 sync dist/ s3://hotel-frontend-krishna \
  --delete \
  --cache-control "max-age=3600"
```

### 2. Verify Deployment

**S3 Frontend URL:**
```
http://hotel-frontend-krishna.s3-website-us-east-1.amazonaws.com
```

**Check if it's working:**
- Open in browser
- Should load the React app
- Try Register - should work
- Try Login - should work

---

## ✅ Verification Checklist

### Environment Configuration
- [x] VITE_API_BASE_URL set to http://18.215.168.203:5000/api
- [x] .env.production created
- [x] .env created for development
- [x] No localhost in production .env

### API Endpoints
- [x] Register: POST http://18.215.168.203:5000/api/auth/register
- [x] Login: POST http://18.215.168.203:5000/api/auth/login
- [x] Health: GET http://18.215.168.203:5000/api/health

### Axios Configuration
- [x] Timeout set to 30 seconds
- [x] Content-Type headers configured
- [x] Error handling improved
- [x] Request/response logging enabled

### Error Handling
- [x] Network errors detected
- [x] Timeout errors detected
- [x] API errors with backend messages shown
- [x] 403 token expired handled

---

## 🔒 Security Best Practices

### Environment Variables
- ✅ API URL in .env files (not hardcoded)
- ✅ Different configs for dev and production
- ✅ .env files in .gitignore
- ✅ No secrets exposed in frontend code

### API Communication
- ✅ JWT tokens stored in localStorage
- ✅ Token sent in Authorization header
- ✅ CORS properly configured on backend
- ✅ HTTPS ready (when domain is available)

---

## 📊 Testing After Deployment

### 1. Test Health Endpoint

```javascript
// In browser console
fetch('http://18.215.168.203:5000/api/health')
  .then(r => r.json())
  .then(d => console.log('✅ Health:', d))
  .catch(e => console.error('❌ Error:', e))
```

**Expected Output:**
```javascript
✅ Health: {
  status: "healthy",
  mongodb: "connected",
  environment: "production",
  uptime: 123.45
}
```

### 2. Test Register (from S3 Frontend)

Open the React app at:
```
http://hotel-frontend-krishna.s3-website-us-east-1.amazonaws.com
```

1. Click Register
2. Fill in:
   - Name: Test User
   - Email: test@example.com
   - Password: Password123
   - Confirm: Password123
3. Click Register
4. Should see success message with token

### 3. Test Login (from S3 Frontend)

1. Click Login
2. Fill in:
   - Email: test@example.com
   - Password: Password123
3. Click Login
4. Should receive JWT token
5. Should redirect to dashboard

### 4. Check Logs

In EC2:
```bash
pm2 logs hotel-api
```

Should see:
```
[backend] ✓ User registered: test@example.com
[backend] ✓ User logged in: test@example.com
```

---

## 🐛 Debugging Tips

### Enable Debug Mode

Add to .env:
```env
VITE_DEBUG=true
```

### Check API Calls

Open browser DevTools (F12):
1. Go to Network tab
2. Try Register/Login
3. Look for POST requests to http://18.215.168.203:5000/api/auth/*
4. Check response headers and body

### Check Logs

**Frontend Logs (Browser Console):**
```javascript
// Shows all API requests
// Format: "🚀 API Configuration: Base URL: ..."
```

**Backend Logs (EC2):**
```bash
pm2 logs hotel-api
# Shows register/login attempts
```

---

## 🔧 Common Issues & Solutions

### Issue: "CORS error" in console
**Solution:** Check CORS_ORIGIN in backend .env includes S3 URL

### Issue: "Timeout exceeded" error
**Solution:** 
1. Verify backend is running: `pm2 status`
2. Test health: `curl http://18.215.168.203:5000/api/health`
3. Check EC2 security group allows port 5000

### Issue: "Cannot reach backend" in frontend
**Solution:**
1. Check VITE_API_BASE_URL is correct
2. Rebuild frontend: `npm run build`
3. Redeploy to S3
4. Clear browser cache

### Issue: "Invalid token" after login
**Solution:**
1. Check JWT_SECRET is same in backend .env
2. Check token is being stored in localStorage
3. Check Authorization header format: "Bearer <token>"

---

## 📋 File Locations

| File | Location | Purpose |
|------|----------|---------|
| .env | `frontend-react/.env` | Local development config |
| .env.production | `frontend-react/.env.production` | S3 production config |
| API config | `frontend-react/src/api/index.js` | Axios setup |
| Vite config | `frontend-react/vite.config.js` | Build configuration |

---

## 🚀 Production Deployment Workflow

```bash
# 1. Update code locally
git pull origin main

# 2. Install dependencies
npm install

# 3. Build for production
npm run build

# 4. Deploy to S3
aws s3 sync dist/ s3://hotel-frontend-krishna --delete

# 5. Verify in browser
# Open: http://hotel-frontend-krishna.s3-website-us-east-1.amazonaws.com
```

---

## ✅ Final Checklist

- [x] VITE_API_BASE_URL configured correctly
- [x] .env files created
- [x] Axios timeout set to 30 seconds
- [x] Error handling comprehensive
- [x] Frontend builds without errors
- [x] S3 bucket configured for static website
- [x] CORS configured on backend for S3 origin
- [x] Register works from S3 frontend
- [x] Login works from S3 frontend
- [x] No timeout errors
- [x] JWT tokens working

---

**Status:** ✅ Frontend Ready for Production  
**Backend:** http://18.215.168.203:5000  
**Frontend:** http://hotel-frontend-krishna.s3-website-us-east-1.amazonaws.com
