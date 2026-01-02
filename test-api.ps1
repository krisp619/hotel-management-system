# Test Backend Health Endpoint
Write-Host "=== Testing Backend ===" -ForegroundColor Green
Write-Host "Testing Health Endpoint: http://23.22.102.15:5000/api/health"

try {
    $response = Invoke-WebRequest -Uri "http://23.22.102.15:5000/api/health" -TimeoutSec 5 -ErrorAction Stop
    Write-Host "✓ Backend Health Check PASSED" -ForegroundColor Green
    Write-Host "Status Code: $($response.StatusCode)" -ForegroundColor Cyan
    Write-Host "Response:" -ForegroundColor Cyan
    $response.Content | ConvertFrom-Json | Format-List
} catch {
    Write-Host "✗ Backend Health Check FAILED" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "=== Frontend Status ===" -ForegroundColor Green
Write-Host "Frontend is running at: http://localhost:3001" -ForegroundColor Cyan
Write-Host "Login Page: http://localhost:3001/login" -ForegroundColor Cyan
Write-Host "Register Page: http://localhost:3001/register" -ForegroundColor Cyan

Write-Host ""
Write-Host "=== Test Instructions ===" -ForegroundColor Yellow
Write-Host "1. Open http://localhost:3001 in your browser"
Write-Host "2. Go to /register to create a new account"
Write-Host "3. Test login with your credentials"
Write-Host "4. Check LocalStorage (F12 -> Application -> LocalStorage) for JWT token"
Write-Host "5. Try booking a room from the Dashboard"
Write-Host "6. View and manage bookings in /bookings page"
