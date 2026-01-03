# QUICK REFERENCE - ALL API KEYS & SECRETS

## ENVIRONMENT VARIABLE QUICK LOOKUP

### BACKEND (.env)
```
PORT=5000
NODE_ENV=production
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/database
JWT_SECRET=your-32-char-random-string
CORS_ORIGIN=http://s3-url.com,http://localhost:3000
```

### FRONTEND (.env.production)
```
VITE_API_BASE_URL=http://23.22.102.15:5000
```

### FIREBASE (.env.firebase or in .env.production)
```
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=project-id
VITE_FIREBASE_STORAGE_BUCKET=project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123:web:abc...
```

---

## API ENDPOINT QUICK REFERENCE

### Health Check
```
GET http://23.22.102.15:5000/api/health
No auth required
```

### Register
```
POST http://23.22.102.15:5000/api/auth/register
Body: { name, email, password, confirmPassword }
Returns: { token, user }
```

### Login
```
POST http://23.22.102.15:5000/api/auth/login
Body: { email, password }
Returns: { token, userId, user }
Header: Content-Type: application/json
```

### Create Booking (Auth Required)
```
POST http://23.22.102.15:5000/api/book-room
Headers: Authorization: Bearer <token>
Body: { name, email, roomType, checkInDate, checkOutDate }
```

### Get Bookings (Auth Required)
```
GET http://23.22.102.15:5000/api/bookings
Headers: Authorization: Bearer <token>
```

### Update/Delete Booking (Auth Required)
```
PUT/DELETE http://23.22.102.15:5000/api/bookings/:id
Headers: Authorization: Bearer <token>
```

---

## WHERE TO GET EACH KEY

### MongoDB URI
1. Go to https://cloud.mongodb.com/
2. Create cluster
3. Click "Connect"
4. Choose "Connect your application"
5. Copy connection string
6. Replace <password> and <username>

### JWT Secret
```
Generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Firebase Keys
1. Go to https://console.firebase.google.com/
2. Select project
3. Settings → Project Settings
4. Copy all 6 values
5. Paste into .env.firebase

### Backend URL
```
EC2 Instance: 23.22.102.15:5000
```

### Frontend URL (S3)
```
S3 Bucket: http://hotel-management-frontend.s3-website-us-east-1.amazonaws.com
```

---

## SECURITY RULES

✓ Never commit .env files
✓ Keep JWT_SECRET 32+ characters
✓ Rotate secrets periodically
✓ Use environment-specific configs
✓ Firebase keys are public (safe for web)
✓ MongoDB password in URI only
✓ All secrets loaded from .env
✓ No hardcoded credentials

---

## TESTING ALL ENDPOINTS

1. Register: POST /api/auth/register → Get token
2. Login: POST /api/auth/login → Use token
3. Create: POST /api/book-room + token → Get booking ID
4. Read: GET /api/bookings + token → List bookings
5. Update: PUT /api/bookings/:id + token → Modify booking
6. Delete: DELETE /api/bookings/:id + token → Remove booking

See POSTMAN_API_TESTING.md for complete details.
