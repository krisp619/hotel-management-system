#!/usr/bin/env pwsh
<#
.SYNOPSIS
    Automated S3 Deployment Script for Hotel Management System Frontend
.DESCRIPTION
    Builds React app and deploys to AWS S3 with proper configuration
#>

param(
    [Parameter(Mandatory=$false)]
    [string]$BucketName = "hotel-management-frontend",
    
    [Parameter(Mandatory=$false)]
    [string]$Region = "us-east-1"
)

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Hotel Management System - S3 Deployment" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# Check AWS CLI
Write-Host "`n[1/5] Checking AWS CLI..." -ForegroundColor Cyan
$awsCmd = Get-Command aws -ErrorAction SilentlyContinue
if (-not $awsCmd) {
    Write-Host "[FAIL] AWS CLI not found!" -ForegroundColor Red
    Write-Host "Download: https://aws.amazon.com/cli/" -ForegroundColor Yellow
    exit 1
}
Write-Host "[OK] AWS CLI found" -ForegroundColor Green

# Check credentials
Write-Host "`n[2/5] Checking AWS credentials..." -ForegroundColor Cyan
try {
    $identity = aws sts get-caller-identity --region $Region 2>$null | ConvertFrom-Json
    Write-Host "[OK] AWS credentials valid" -ForegroundColor Green
}
catch {
    Write-Host "[FAIL] AWS credentials not configured!" -ForegroundColor Red
    Write-Host "Run: aws configure" -ForegroundColor Yellow
    exit 1
}

# Build React app
Write-Host "`n[3/5] Building React application..." -ForegroundColor Cyan
$frontendPath = Join-Path (Get-Location) "frontend-react"
if (-not (Test-Path (Join-Path $frontendPath "package.json"))) {
    Write-Host "[FAIL] frontend-react/package.json not found!" -ForegroundColor Red
    exit 1
}

Push-Location $frontendPath
npm run build 2>&1 | Out-Null
if ($LASTEXITCODE -ne 0) {
    Write-Host "[FAIL] Build failed!" -ForegroundColor Red
    Pop-Location
    exit 1
}
Pop-Location
Write-Host "[OK] Build successful" -ForegroundColor Green

# Verify dist folder
Write-Host "`n[4/5] Verifying dist folder..." -ForegroundColor Cyan
$distPath = Join-Path $frontendPath "dist"
if (-not (Test-Path $distPath)) {
    Write-Host "[FAIL] dist/ folder not found!" -ForegroundColor Red
    exit 1
}
if (-not (Test-Path (Join-Path $distPath "index.html"))) {
    Write-Host "[FAIL] index.html not found in dist/" -ForegroundColor Red
    exit 1
}
Write-Host "[OK] dist/ folder ready for upload" -ForegroundColor Green

# Setup S3
Write-Host "`n[5/5] Setting up S3 bucket..." -ForegroundColor Cyan

# Create bucket if needed
$bucketExists = aws s3 ls "s3://$BucketName" --region $Region 2>$null
if (-not $bucketExists) {
    Write-Host "[INFO] Creating S3 bucket: $BucketName" -ForegroundColor Yellow
    aws s3 mb "s3://$BucketName" --region $Region
}

# Enable website hosting
aws s3 website "s3://$BucketName" --index-document index.html --error-document index.html --region $Region 2>$null

# Set public read policy
$bucketPolicy = @"
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicRead",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::$BucketName/*"
    }
  ]
}
"@

$tempFile = [System.IO.Path]::GetTempFileName()
Set-Content -Path $tempFile -Value $bucketPolicy -Encoding UTF8
aws s3api put-bucket-policy --bucket $BucketName --policy file://$tempFile --region $Region 2>$null
Remove-Item $tempFile

Write-Host "[OK] S3 bucket configured" -ForegroundColor Green

# Upload files
Write-Host "`nUploading files to S3..." -ForegroundColor Cyan
aws s3 sync $distPath "s3://$BucketName/" --region $Region --delete --cache-control "no-cache" 2>&1 | Out-Null
Write-Host "[OK] Files uploaded" -ForegroundColor Green

# Summary
Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "DEPLOYMENT COMPLETE" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green

$websiteUrl = "http://$BucketName.s3-website-$Region.amazonaws.com"
Write-Host ""
Write-Host "Website URL: $websiteUrl" -ForegroundColor Green
Write-Host ""
Write-Host "Test URLs:" -ForegroundColor Cyan
Write-Host "  Login:    $websiteUrl/login" 
Write-Host "  Register: $websiteUrl/register"
Write-Host "  Bookings: $websiteUrl/bookings"
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "  1. Open website URL in browser"
Write-Host "  2. Register a new user"
Write-Host "  3. Test booking a room"
Write-Host "  4. Check Network tab for API calls"
Write-Host ""
Write-Host "Backend API: http://23.22.102.15:5000" -ForegroundColor Yellow
Write-Host ""
