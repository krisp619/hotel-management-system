# 🔧 CORS Configuration Guide - Hotel Management System

## Problem Diagnosis

**Error**: `Access to XMLHttpRequest has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present`

**Cause**: Browser blocks requests from different origins (domains/ports) for security. Cross-Origin Resource Sharing (CORS) needs proper configuration.

---

## ✅ Solution Implemented

### 1. Enhanced CORS Middleware (server.js)

The following improvements have been made:

```javascript
// ============================================
// MIDDLEWARE
// ============================================

// CORS Configuration - Production Ready
const getAllowedOrigins = () => {
  const defaultOrigins = [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:5000',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:3001',
    'http://127.0.0.1:5000',
  ];

  // Add S3 domains
  const s3Origins = [
    'http://hotel-management-frontend.s3-website-us-east-1.amazonaws.com',
    'https://hotel-management-frontend.s3-website-us-east-1.amazonaws.com',
  ];

  // Parse CORS_ORIGIN from .env (comma-separated)
  const envOrigins = process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(',').map(url => url.trim()).filter(Boolean)
    : [];

  // Combine all origins (remove duplicates)
  const allOrigins = [...new Set([...defaultOrigins, ...s3Origins, ...envOrigins])];
  
  console.log('✓ CORS Origins Allowed:', allOrigins);
  return allOrigins;
};

const corsOptions = {
  origin: getAllowedOrigins(),
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true,
  optionsSuccessStatus: 200,
  maxAge: 86400, // 24 hours
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Explicit OPTIONS handler for preflight requests
app.options('*', cors(corsOptions));
```

### Key Improvements:

✅ **Multiple Origin Support**:
- Localhost variants (3000, 3001, 5000)
- Both 127.0.0.1 and localhost (some systems use different notation)
- S3 production domains (HTTP and HTTPS)
- Environment variable configuration

✅ **All HTTP Methods**:
- GET, POST, PUT, DELETE (CRUD operations)
- OPTIONS (preflight requests)
- PATCH (partial updates)

✅ **Required Headers**:
- `Content-Type` (for JSON payloads)
- `Authorization` (for JWT tokens)
- `X-Requested-With` (for AJAX requests)

✅ **Preflight Handling**:
- `app.options('*', cors(corsOptions))` handles OPTIONS requests
- Required for complex requests (POST with JSON, DELETE, etc.)
- Cached for 24 hours to improve performance

✅ **Credentials Support**:
- `credentials: true` allows cookies and authorization headers
- Essential for JWT token-based authentication

---

## 📋 Configuration Details

### Understanding CORS Preflight

When your frontend makes a complex request (POST with JSON, DELETE, etc.), the browser first sends an **OPTIONS** request to check if the server allows it.

**Request Flow**:
```
1. Browser: OPTIONS /api/bookings (preflight)
2. Server: 200 OK + CORS headers
3. Browser: POST /api/bookings (actual request)
4. Server: 200 OK + data
```

**Without preflight handling**, the browser receives no CORS headers and blocks the request.

### Origin Matching

Origins are matched **exactly** (including protocol and port):

```
✅ Allowed:        http://localhost:3001
❌ Not Allowed:    http://localhost:3002 (different port)
❌ Not Allowed:    https://localhost:3001 (different protocol)
```

---

## 🔐 Environment-Based Configuration

### Development (.env)
```dotenv
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000,http://localhost:3001,http://localhost:5000
```

### Production (.env.production)
```dotenv
NODE_ENV=production
CORS_ORIGIN=https://hotel-management-frontend.s3-website-us-east-1.amazonaws.com
```

### Adding New Domains

Simply add to `CORS_ORIGIN` (comma-separated):

```dotenv
# Add your domain
CORS_ORIGIN=http://localhost:3000,http://localhost:3001,https://your-custom-domain.com
```

---

## 🧪 Testing CORS Configuration

### Test 1: Check Backend Health
```bash
curl -X GET http://localhost:5000/api/health
```

**Expected Response**:
```json
{
  "status": "ok",
  "mongodb": "connected"
}
```

### Test 2: Check CORS Headers
```bash
curl -X OPTIONS http://localhost:5000/api/bookings \
  -H "Origin: http://localhost:3001" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type" \
  -v
```

**Expected Response Headers**:
```
Access-Control-Allow-Origin: http://localhost:3001
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS, PATCH
Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With
Access-Control-Max-Age: 86400
```

### Test 3: Frontend Console Test
```javascript
// From browser console at http://localhost:3001
fetch('http://localhost:5000/api/health', {
  credentials: 'include',
  headers: {
    'Content-Type': 'application/json'
  }
})
.then(r => r.json())
.then(data => console.log('✅ CORS Works:', data))
.catch(e => console.error('❌ CORS Error:', e));
```

---

## 🐛 Troubleshooting

### Error: "CORS policy: No 'Access-Control-Allow-Origin' header"

**Cause**: Origin not in allowed list

**Solution**: 
1. Check exact origin in browser console: `console.log(window.location.origin)`
2. Add to `CORS_ORIGIN` in .env
3. Restart backend: `npm run dev`

### Error: "CORS policy: The value of the 'Access-Control-Allow-Credentials' header in the response is ''"

**Cause**: `credentials: true` but origin is wildcard `*`

**Solution**: Already fixed in this config - we explicitly list origins instead of using `*`

### Error: "CORS policy: Request header field X is not allowed by Access-Control-Allow-Headers"

**Cause**: Custom header not in `allowedHeaders`

**Solution**: Add to `allowedHeaders` array in corsOptions:
```javascript
allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'X-Custom-Header']
```

### OPTIONS request returns 404

**Cause**: OPTIONS middleware not applied

**Solution**: Ensure this line exists:
```javascript
app.options('*', cors(corsOptions));
```

---

## 📊 Current Configuration Summary

| Setting | Value |
|---------|-------|
| **Frontend Ports** | 3000, 3001 |
| **Backend Port** | 5000 |
| **S3 Production** | hotel-management-frontend.s3-website-us-east-1.amazonaws.com |
| **Allowed Methods** | GET, POST, PUT, DELETE, OPTIONS, PATCH |
| **Allowed Headers** | Content-Type, Authorization, X-Requested-With |
| **Credentials** | ✅ Enabled (for JWT tokens) |
| **Preflight Cache** | 24 hours |

---

## 🚀 Testing Complete Workflow

### Step 1: Start Backend
```bash
cd backend
npm run dev
```

**Expected Output**:
```
✓ CORS Origins Allowed: [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:5000',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:3001',
  'http://127.0.0.1:5000',
  'http://hotel-management-frontend.s3-website-us-east-1.amazonaws.com',
  'https://hotel-management-frontend.s3-website-us-east-1.amazonaws.com'
]
✓ Express Server Started
✓ Mongoose connected to MongoDB
```

### Step 2: Start Frontend
```bash
cd frontend-react
npm run dev
```

### Step 3: Test Login/Register
1. Navigate to http://localhost:3001/register
2. Fill form and submit
3. Check browser Network tab:
   - Should see OPTIONS request (preflight) - 200 OK
   - Should see POST request - 200/201 OK
4. No CORS errors should appear ✅

---

## 🎯 Production Deployment Notes

When deploying to AWS:

1. **Update S3 domain**: Ensure your S3 website endpoint is in CORS_ORIGIN
2. **Use HTTPS**: Production should use HTTPS domains
3. **Update .env.production**: Add your final domain

Example for production:
```dotenv
NODE_ENV=production
CORS_ORIGIN=https://YOUR_DOMAIN.com,https://hotel-management-frontend.s3-website-us-east-1.amazonaws.com
```

---

## 📚 Resources

- [MDN CORS Documentation](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
- [Express CORS Middleware](https://www.npmjs.com/package/cors)
- [CORS Tester Tool](https://www.test-cors.org/)

---

**Status**: ✅ CORS Configuration Fixed and Tested
**Backend**: Running at http://localhost:5000
**Frontend**: Running at http://localhost:3001
