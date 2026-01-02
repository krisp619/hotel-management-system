@echo off
REM MongoDB Startup Script for Windows

echo Starting MongoDB...

REM Create data directory if it doesn't exist
if not exist C:\data\db mkdir C:\data\db

REM Try to find mongod.exe in common locations
set "MONGO_PATH="

if exist "C:\Program Files\MongoDB\Server\7.0\bin\mongod.exe" (
    set "MONGO_PATH=C:\Program Files\MongoDB\Server\7.0\bin\mongod.exe"
) else if exist "C:\Program Files\MongoDB\Server\6.0\bin\mongod.exe" (
    set "MONGO_PATH=C:\Program Files\MongoDB\Server\6.0\bin\mongod.exe"
) else if exist "C:\mongodb\bin\mongod.exe" (
    set "MONGO_PATH=C:\mongodb\bin\mongod.exe"
) else (
    echo MongoDB not found in standard locations
    echo Please install MongoDB Community Edition from: https://www.mongodb.com/try/download/community
    pause
    exit /b 1
)

echo Found MongoDB at: %MONGO_PATH%
echo.
echo Starting MongoDB on localhost:27017...
echo Data directory: C:\data\db
echo.

REM Start MongoDB
"%MONGO_PATH%" --dbpath "C:\data\db" --bind_ip localhost

pause
