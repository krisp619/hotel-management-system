# QUICK START - S3 DEPLOYMENT COMMANDS

## 🚀 Option 1: Automated Deployment (Recommended)

```powershell
cd "c:\Users\krishna potdar\OneDrive\Desktop\Dyanamic website"
powershell -ExecutionPolicy Bypass -File deploy-s3.ps1
```

This script will:
✅ Check AWS CLI is installed
✅ Verify AWS credentials
✅ Confirm build is complete
✅ Create S3 bucket
✅ Configure website hosting
✅ Upload all files to S3
✅ Show you the website URL

---

## 🔧 Option 2: Manual Step-by-Step Commands

### Prerequisites
```powershell
# 1. Install AWS CLI: https://aws.amazon.com/cli/
# 2. Configure credentials
aws configure
# Enter: Access Key ID, Secret Access Key, Region (us-east-1), Output (json)
```

### Deploy Commands
```powershell
# Set variables
$BUCKET_NAME = "hotel-management-frontend"
$REGION = "us-east-1"
$PROJECT_ROOT = "c:\Users\krishna potdar\OneDrive\Desktop\Dyanamic website"

# 1. Navigate to project
cd $PROJECT_ROOT

# 2. Build (already done, but if you make changes)
cd frontend-react
npm run build
cd ..

# 3. Create S3 bucket
aws s3 mb "s3://$BUCKET_NAME" --region $REGION

# 4. Enable website hosting
aws s3 website "s3://$BUCKET_NAME" `
  --index-document index.html `
  --error-document index.html `
  --region $REGION

# 5. Make bucket public
$policy = @{
    Version = "2012-10-17"
    Statement = @(@{
        Effect = "Allow"
        Principal = "*"
        Action = "s3:GetObject"
        Resource = "arn:aws:s3:::$BUCKET_NAME/*"
    })
} | ConvertTo-Json -Depth 10

$policy | Out-File policy.json -Encoding UTF8
aws s3api put-bucket-policy --bucket $BUCKET_NAME --policy file://policy.json --region $REGION
Remove-Item policy.json

# 6. Upload assets (with cache - files have hash in name so they never change)
aws s3 sync frontend-react/dist/assets "s3://$BUCKET_NAME/assets" `
  --cache-control "public, max-age=31536000" `
  --delete `
  --region $REGION

# 7. Upload index.html (no cache - always get latest)
aws s3 cp frontend-react/dist/index.html "s3://$BUCKET_NAME/index.html" `
  --content-type "text/html; charset=utf-8" `
  --cache-control "no-cache, no-store, must-revalidate" `
  --region $REGION

# 8. Get your website URL
$WEBSITE_URL = "http://$BUCKET_NAME.s3-website-$REGION.amazonaws.com"
Write-Host "✅ Deployment Complete!"
Write-Host "Website URL: $WEBSITE_URL"
Write-Host "Test: $WEBSITE_URL/login"
```

---

## 📝 What Gets Deployed

```
✅ UPLOADED TO S3:
   - index.html (650 bytes)
   - assets/index-[hash].css (8.2 KB)
   - assets/index-[hash].js (48 KB) - React app
   - assets/react-vendor-[hash].js (137 KB) - React library
   - assets/router-vendor-[hash].js (20 KB) - React Router

❌ NOT UPLOADED (Local only):
   - frontend-react/src/
   - frontend-react/node_modules/
   - .env files
```

---

## 🧪 Testing After Deployment

```powershell
# After getting S3 URL, test these:

# 1. Open in browser
$WEBSITE_URL = "http://hotel-management-frontend.s3-website-us-east-1.amazonaws.com"
Start-Process $WEBSITE_URL

# 2. Test all routes
# - Visit /login
# - Visit /register  
# - Visit /bookings
# - Refresh page on each route (should work)

# 3. Check Network tab for API calls
# - Should see requests to: http://23.22.102.15:5000/api/*
# - Status should be 200/201 (not 403/404)

# 4. Try registering a user
# - Enter name, email, password
# - Should see response from EC2 backend
# - Redirect to login
```

---

## ✅ Checklist Before Deployment

- [ ] AWS CLI installed (`aws --version` works)
- [ ] AWS credentials configured (`aws configure` done)
- [ ] Backend running at 23.22.102.15:5000
- [ ] React build complete (`frontend-react/dist/` has files)
- [ ] `.env.production` has correct EC2 IP
- [ ] Have AWS Access Key ID and Secret
- [ ] Can create S3 bucket (AWS account has permissions)

---

## 🔍 Troubleshooting

### AWS CLI not found
```powershell
# Download from: https://aws.amazon.com/cli/
# Or install via Chocolatey:
choco install awscli
```

### AWS credentials error
```powershell
aws configure
# Then enter your AWS Access Key and Secret Key
```

### Deployment script won't run
```powershell
# Allow script execution
Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope CurrentUser
```

### S3 shows 403 Forbidden
```powershell
# Reapply bucket policy
$policy = @{
    Version = "2012-10-17"
    Statement = @(@{
        Effect = "Allow"
        Principal = "*"
        Action = "s3:GetObject"
        Resource = "arn:aws:s3:::hotel-management-frontend/*"
    })
} | ConvertTo-Json -Depth 10

$policy | Out-File policy.json -Encoding UTF8
aws s3api put-bucket-policy --bucket hotel-management-frontend --policy file://policy.json
Remove-Item policy.json
```

### API calls fail with CORS error
```powershell
# Update backend/.env
$env:CORS_ORIGIN = "http://hotel-management-frontend.s3-website-us-east-1.amazonaws.com"

# Restart backend
npm restart
```

---

## 📊 Expected Output

After running deploy script:
```
========================================
Hotel Management System - S3 Deployment
========================================

[1/6] Checking AWS CLI...
✅ AWS CLI found

[2/6] Checking AWS credentials...
✅ AWS credentials valid (Account: 123456789012)

[3/6] Building React application...
✓ 97 modules transformed.
✓ built in 1.44s
✅ Build successful

[4/6] Verifying dist folder...
✅ dist/ folder ready for upload

[5/6] Setting up S3 bucket...
Configuring website hosting...
Applying public access policy...
✅ S3 bucket configured

[6/6] Uploading to S3...
Uploading assets (with cache)...
upload: frontend-react/dist/assets/...
Uploading index.html (no cache)...
upload: frontend-react/dist/index.html
✅ Upload complete

========================================
✅ Deployment Complete!
========================================

📍 Website URL: http://hotel-management-frontend.s3-website-us-east-1.amazonaws.com

🧪 Test URLs:
   - Home: http://hotel-management-frontend.s3-website-us-east-1.amazonaws.com/
   - Login: http://hotel-management-frontend.s3-website-us-east-1.amazonaws.com/login
   - Register: http://hotel-management-frontend.s3-website-us-east-1.amazonaws.com/register
```

---

## 🎯 Next: What To Do After Deployment

1. **Test Website**: Visit S3 URL and try registering
2. **Verify Backend Connection**: Check if API calls reach EC2
3. **Optional - Set Up Domain**: Configure custom domain (docs in PRODUCTION_DEPLOYMENT_GUIDE.md)
4. **Optional - CloudFront**: Set up CDN for faster global access

---

**Ready to deploy?** Run:
```powershell
cd "c:\Users\krishna potdar\OneDrive\Desktop\Dyanamic website"
powershell -ExecutionPolicy Bypass -File deploy-s3.ps1
```
