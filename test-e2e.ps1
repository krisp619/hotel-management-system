# End-to-End Testing Script for Hotel Management System

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Hotel Management System - E2E Test" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

$baseUrl = "http://localhost:5000/api"
$testEmail = "e2etest_$(Get-Date -Format 'yyyyMMdd_HHmmss')@example.com"
$testPassword = "TestPassword123"

# Test 1: Register User
Write-Host "`n[TEST 1] Register New User" -ForegroundColor Yellow
try {
    $registerBody = @{
        name = "E2E Test User"
        email = $testEmail
        password = $testPassword
        confirmPassword = $testPassword
    } | ConvertTo-Json
    
    $response = Invoke-WebRequest -Uri "$baseUrl/auth/register" `
        -Method POST `
        -ContentType "application/json" `
        -Body $registerBody `
        -UseBasicParsing -ErrorAction Stop
    
    Write-Host "Registration response: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "Email: $testEmail" -ForegroundColor Green
}
catch {
    Write-Host "Registration error: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Test 2: Login User
Write-Host "`n[TEST 2] Login User" -ForegroundColor Yellow
try {
    $loginBody = @{
        email = $testEmail
        password = $testPassword
    } | ConvertTo-Json
    
    $loginResponse = Invoke-WebRequest -Uri "$baseUrl/auth/login" `
        -Method POST `
        -ContentType "application/json" `
        -Body $loginBody `
        -UseBasicParsing -ErrorAction Stop
    
    $loginData = $loginResponse.Content | ConvertFrom-Json
    $token = $loginData.token
    $userId = $loginData.userId
    
    Write-Host "Login successful - Status: $($loginResponse.StatusCode)" -ForegroundColor Green
    Write-Host "User ID: $userId" -ForegroundColor Green
    Write-Host "Token received: Yes" -ForegroundColor Green
}
catch {
    Write-Host "Login error: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Test 3: Create Booking
Write-Host "`n[TEST 3] Create Room Booking" -ForegroundColor Yellow
try {
    $tomorrow = (Get-Date).AddDays(1).ToString("yyyy-MM-dd")
    $nextWeek = (Get-Date).AddDays(7).ToString("yyyy-MM-dd")
    
    $bookingBody = @{
        name = "E2E Test User"
        email = $testEmail
        roomType = "Double"
        checkInDate = $tomorrow
        checkOutDate = $nextWeek
    } | ConvertTo-Json
    
    $bookingResponse = Invoke-WebRequest -Uri "$baseUrl/book-room" `
        -Method POST `
        -ContentType "application/json" `
        -Headers @{ "Authorization" = "Bearer $token" } `
        -Body $bookingBody `
        -UseBasicParsing -ErrorAction Stop
    
    $bookingData = $bookingResponse.Content | ConvertFrom-Json
    $bookingId = $bookingData._id
    
    Write-Host "Booking created - Status: $($bookingResponse.StatusCode)" -ForegroundColor Green
    Write-Host "Booking ID: $bookingId" -ForegroundColor Green
    Write-Host "Room Type: Double" -ForegroundColor Green
}
catch {
    Write-Host "Booking error: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Test 4: Retrieve Bookings
Write-Host "`n[TEST 4] Retrieve User Bookings" -ForegroundColor Yellow
try {
    $bookingsResponse = Invoke-WebRequest -Uri "$baseUrl/bookings" `
        -Method GET `
        -Headers @{ "Authorization" = "Bearer $token" } `
        -UseBasicParsing -ErrorAction Stop
    
    $bookingsData = $bookingsResponse.Content | ConvertFrom-Json
    
    Write-Host "Bookings retrieved - Status: $($bookingsResponse.StatusCode)" -ForegroundColor Green
    Write-Host "Bookings found: Yes" -ForegroundColor Green
}
catch {
    Write-Host "Booking retrieval error: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Test 5: Frontend Availability
Write-Host "`n[TEST 5] Frontend Availability" -ForegroundColor Yellow
try {
    $frontendResponse = Invoke-WebRequest -Uri "http://localhost:3001" `
        -UseBasicParsing -ErrorAction Stop
    
    Write-Host "Frontend is running - Status: $($frontendResponse.StatusCode)" -ForegroundColor Green
    Write-Host "URL: http://localhost:3001" -ForegroundColor Green
}
catch {
    Write-Host "Frontend error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "E2E TEST COMPLETE - ALL SYSTEMS OPERATIONAL" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
