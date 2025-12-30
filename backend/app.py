"""
Hotel Management System - Flask Backend
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv
import jwt
import bcrypt

load_dotenv()

app = Flask(__name__)
CORS(app)

JWT_SECRET = os.getenv('JWT_SECRET', 'your-secret-key')
JWT_ALGORITHM = 'HS256'
JWT_EXPIRATION_HOURS = 30 * 24

# In-memory storage
users_db = {}
bookings_db = {}

# Utilities
def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()

def verify_password(password: str, hashed: str) -> bool:
    try:
        return bcrypt.checkpw(password.encode(), hashed.encode())
    except:
        return False

def create_access_token(email: str) -> str:
    expiration = datetime.utcnow() + timedelta(hours=JWT_EXPIRATION_HOURS)
    payload = {'sub': email, 'exp': int(expiration.timestamp())}
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

def verify_token(token: str):
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        return payload.get('sub')
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None

def get_auth_user():
    auth_header = request.headers.get('Authorization', '')
    if not auth_header or not auth_header.startswith('Bearer '):
        return None
    token = auth_header.split(' ')[1]
    return verify_token(token)

# Routes
@app.route('/', methods=['GET'])
def root():
    return jsonify({
        "message": "Hotel Management System API",
        "version": "1.0.0",
        "docs": "/docs"
    })

@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({"status": "OK", "message": "Server is running"})

@app.route('/api/auth/register', methods=['POST'])
def register():
    data = request.get_json()
    
    if data['password'] != data['confirm_password']:
        return jsonify({"detail": "Passwords do not match"}), 400
    if data['email'] in users_db:
        return jsonify({"detail": "Email already registered"}), 400
    
    hashed_password = hash_password(data['password'])
    users_db[data['email']] = {'password': hashed_password}
    token = create_access_token(data['email'])
    
    return jsonify({"access_token": token, "token_type": "bearer"}), 201

@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    
    if data['email'] not in users_db:
        return jsonify({"detail": "Invalid credentials"}), 401
    
    user = users_db[data['email']]
    if not verify_password(data['password'], user['password']):
        return jsonify({"detail": "Invalid credentials"}), 401
    
    token = create_access_token(data['email'])
    return jsonify({"access_token": token, "token_type": "bearer"}), 200

@app.route('/api/book-room', methods=['POST'])
def book_room():
    email = get_auth_user()
    if not email:
        return jsonify({"detail": "Unauthorized"}), 401
    
    data = request.get_json()
    booking_id = f"booking_{len(bookings_db) + 1}"
    bookings_db[booking_id] = {
        'id': booking_id,
        'user_email': email,
        'guest_name': data.get('guest_name'),
        'email': data.get('email'),
        'room_type': data.get('room_type'),
        'check_in': data.get('check_in'),
        'check_out': data.get('check_out'),
        'guests': data.get('guests'),
        'created_at': datetime.utcnow().isoformat()
    }
    return jsonify({'booking_id': booking_id, 'status': 'success', 'message': 'Booking created'}), 201

@app.route('/api/bookings', methods=['GET'])
def get_bookings():
    email = get_auth_user()
    if not email:
        return jsonify({"detail": "Unauthorized"}), 401
    
    skip = request.args.get('skip', 0, type=int)
    limit = request.args.get('limit', 10, type=int)
    
    user_bookings = [b for b in bookings_db.values() if b.get('user_email') == email]
    items = user_bookings[skip:skip + limit]
    
    return jsonify({
        'bookings': items,
        'total': len(user_bookings),
        'skip': skip,
        'limit': limit
    }), 200

@app.route('/api/bookings/<booking_id>', methods=['DELETE'])
def delete_booking(booking_id):
    email = get_auth_user()
    if not email:
        return jsonify({"detail": "Unauthorized"}), 401
    
    if booking_id not in bookings_db:
        return jsonify({"detail": "Booking not found"}), 404
    
    booking = bookings_db[booking_id]
    if booking.get('user_email') != email:
        return jsonify({"detail": "Unauthorized"}), 403
    
    del bookings_db[booking_id]
    return jsonify({'status': 'success', 'message': 'Booking deleted'}), 200

if __name__ == '__main__':
    print('[OK] Server is running on http://localhost:5000')
    print('[OK] Environment: development')
    app.run(host='0.0.0.0', port=5000, debug=False)
