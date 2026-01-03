#!/usr/bin/env pwsh
<#
.SYNOPSIS
    Automated S3 Deployment Script for Hotel Management System Frontend
.DESCRIPTION
    Builds React app and deploys to AWS S3 with proper configuration
.PARAMETER BucketName
    S3 bucket name (must be globally unique)
.PARAMETER Region
    AWS region (default: us-east-1)
#>

param(
    [Parameter(Mandatory=$false)]
    [string]$BucketName = "hotel-management-frontend",
    
    [Parameter(Mandatory=$false)]
    [string]$Region = "us-east-1"
)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Hotel Management System - S3 Deployment" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# Color codes
$Success = @{ ForegroundColor = 'Green' }
$Error_Color = @{ ForegroundColor = 'Red' }
$Warning = @{ ForegroundColor = 'Yellow' }
$Info = @{ ForegroundColor = 'Cyan' }

# Step 1: Check AWS CLI
Write-Host "`n[1/6] Checking AWS CLI..." @Info
$awsCmd = Get-Command aws -ErrorAction SilentlyContinue
if (-not $awsCmd) {
    Write-Host "❌ AWS CLI not found!" @Error_Color
    Write-Host "Download from: https://aws.amazon.com/cli/" @Warning
    exit 1
}
Write-Host "✅ AWS CLI found" @Success

# Step 2: Check credentials
Write-Host "`n[2/6] Checking AWS credentials..." @Info
try {
    $identity = aws sts get-caller-identity --region $Region 2>$null | ConvertFrom-Json
    Write-Host "✅ AWS credentials valid (Account: $($identity.Account))" @Success
}
catch {
    Write-Host "❌ AWS credentials not configured!" @Error_Color
    Write-Host "Run: aws configure" @Warning
    exit 1
}

# Step 3: Build React app
Write-Host "`n[3/6] Building React application..." @Info
$projectRoot = Split-Path -Parent $PSScriptRoot
$frontendPath = Join-Path $projectRoot "frontend-react"

if (-not (Test-Path (Join-Path $frontendPath "package.json"))) {
    Write-Host "❌ frontend-react/package.json not found!" @Error_Color
    exit 1
}

Push-Location $frontendPath
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed!" @Error_Color
    Pop-Location
    exit 1
}
Pop-Location
Write-Host "✅ Build successful" @Success

# Step 4: Verify dist folder
Write-Host "`n[4/6] Verifying dist folder..." @Info
$distPath = Join-Path $frontendPath "dist"
if (-not (Test-Path $distPath)) {
    Write-Host "❌ dist/ folder not found!" @Error_Color
    exit 1
}
$indexHtml = Join-Path $distPath "index.html"
if (-not (Test-Path $indexHtml)) {
    Write-Host "❌ index.html not found in dist/" @Error_Color
    exit 1
}
Write-Host "✅ dist/ folder ready for upload" @Success

# Step 5: Create/Configure S3 bucket
Write-Host "`n[5/6] Setting up S3 bucket..." @Info

# Check if bucket exists
$bucketExists = aws s3 ls "s3://$BucketName" --region $Region 2>$null
if (-not $bucketExists) {
    Write-Host "Creating S3 bucket: $BucketName"
    aws s3 mb "s3://$BucketName" --region $Region
}

# Enable website hosting
Write-Host "Configuring website hosting..."
aws s3 website "s3://$BucketName" `
    --index-document index.html `
    --error-document index.html `
    --region $Region

# Make bucket public
Write-Host "Applying public access policy..."
$policy = @{
    Version = "2012-10-17"
    Statement = @(
        @{
            Effect = "Allow"
            Principal = "*"
            Action = "s3:GetObject"
            Resource = "arn:aws:s3:::$BucketName/*"
        }
    )
} | ConvertTo-Json -Depth 10

$tempPolicy = New-TemporaryFile
$policy | Out-File -FilePath $tempPolicy.FullName -Encoding UTF8
aws s3api put-bucket-policy --bucket $BucketName --policy file://$tempPolicy.FullName --region $Region
Remove-Item $tempPolicy

Write-Host "✅ S3 bucket configured" @Success

# Step 6: Upload to S3
Write-Host "`n[6/6] Uploading to S3..." @Info

# Upload assets with long cache
Write-Host "Uploading assets (with cache)..."
$assetsPath = Join-Path $distPath "assets"
aws s3 sync $assetsPath "s3://$BucketName/assets" `
    --cache-control "public, max-age=31536000" `
    --delete `
    --region $Region

# Upload index.html without cache
Write-Host "Uploading index.html (no cache)..."
aws s3 cp $indexHtml "s3://$BucketName/index.html" `
    --content-type "text/html; charset=utf-8" `
    --cache-control "no-cache, no-store, must-revalidate" `
    --region $Region

Write-Host "✅ Upload complete" @Success

# Final summary
Write-Host "`n========================================" -ForegroundColor Green
Write-Host "✅ Deployment Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green

$websiteUrl = "http://$BucketName.s3-website-$Region.amazonaws.com"
Write-Host "`n📍 Website URL: $websiteUrl" @Info
Write-Host "`n🧪 Test URLs:"
Write-Host "   - Home: $websiteUrl/"
Write-Host "   - Login: $websiteUrl/login"
Write-Host "   - Register: $websiteUrl/register"
Write-Host "   - Bookings: $websiteUrl/bookings"

Write-Host "`n💡 Next steps:"
Write-Host "   1. Open the website URL in browser"
Write-Host "   2. Register a new user"
Write-Host "   3. Test booking a room"
Write-Host "   4. Verify API calls to backend (check Network tab)"

Write-Host "`n📝 Backend must be running at: http://23.22.102.15:5000"
Write-Host "`n✨ Deployment successful!"
