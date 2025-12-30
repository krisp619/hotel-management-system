from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv
from mongoengine import connect

load_dotenv()
MONGODB_URI = os.getenv('MONGODB_URI', 'mongodb://localhost:27017/hotel-management')

app = FastAPI(title="Hotel Management System", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Connect to MongoDB
try:
    connect('hotel-management', host=MONGODB_URI)
    print('[OK] MongoDB Connected Successfully')
except Exception as e:
    print(f'[ERROR] MongoDB Connection Error: {str(e)}')
    import traceback
    traceback.print_exc()

@app.get('/api/health')
def health():
    return {"status": "OK", "message": "Server is running"}

@app.get('/')
def root():
    return {
        "message": "Hotel Management System API",
        "version": "1.0.0",
        "docs": "/docs"
    }

if __name__ == '__main__':
    import uvicorn
    print('[OK] Starting server on http://localhost:5000')
    print('[OK] Environment: development')
    uvicorn.run(app, host='0.0.0.0', port=5000)
