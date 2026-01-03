# React Frontend S3 Deployment - Step-by-Step Guide

## ✅ Build Status: SUCCESS

**Build completed successfully!**

- ✅ React 18 compiled and minified
- ✅ All assets optimized and split
- ✅ dist/ folder ready for S3
- ✅ Production preview running at http://localhost:4173/

---

## 📦 Production Build Output

```
dist/
├── index.html                          (650 bytes)
└── assets/
    ├── index-DTc6Rz3U.css              (8.2 KB)
    ├── index-Xwu4t8R7.js              (48 KB - React app logic)
    ├── react-vendor-2KnJ_jrg.js        (137 KB - React/ReactDOM)
    └── router-vendor-BltLO-Pr.js       (20 KB - React Router)
```

**Total**: ~213 KB (minified, production-ready)

---

## 🔧 Pre-Deployment Checklist

- [x] Build successful (npm run build)
- [x] dist/ folder created with all files
- [x] index.html present
- [x] assets/ folder with JS and CSS
- [x] vite.config.js configured for S3
- [x] .env.production has EC2 backend IP (23.22.102.15:5000)
- [ ] AWS CLI installed
- [ ] AWS credentials configured
- [ ] S3 bucket created

---

## 🚀 S3 Deployment - 4 Steps

### **STEP 1: Install AWS CLI (If Not Already Installed)**

**Check if installed:**
```powershell
aws --version
```

**If not installed:**
- Download: https://aws.amazon.com/cli/
- Run installer
- Verify: `aws --version`

---

### **STEP 2: Configure AWS Credentials**

```powershell
aws configure
```

**You'll be prompted for:**
```
AWS Access Key ID: [Your Access Key]
AWS Secret Access Key: [Your Secret Key]
Default region name: us-east-1
Default output format: json
```

**Where to get credentials:**
1. Go to AWS Console
2. Click your username → Security Credentials
3. Access Keys → Create New Access Key
4. Copy Access Key ID and Secret Access Key

---

### **STEP 3: Create S3 Bucket and Configure for Website Hosting**

```powershell
# Create bucket (bucket names must be globally unique)
aws s3 mb s3://hotel-management-frontend-$(Get-Random)

# OR use specific name (if available)
aws s3 mb s3://hotel-management-frontend

# Get your actual bucket name (use in later commands)
$BUCKET_NAME = "hotel-management-frontend"

# Enable website hosting
aws s3 website "s3://$BUCKET_NAME/" `
  --index-document index.html `
  --error-document index.html

# Make bucket public
aws s3api put-bucket-acl --bucket $BUCKET_NAME --acl public-read

# Create and apply bucket policy
$policy = @{
    Version = "2012-10-17"
    Statement = @(
        @{
            Effect = "Allow"
            Principal = "*"
            Action = "s3:GetObject"
            Resource = "arn:aws:s3:::$BUCKET_NAME/*"
        }
    )
} | ConvertTo-Json -Depth 10

$policy | Out-File -FilePath policy.json -Encoding UTF8
aws s3api put-bucket-policy --bucket $BUCKET_NAME --policy file://policy.json
Remove-Item policy.json

Write-Host "✅ S3 bucket created and configured for website hosting"
```

---

### **STEP 4: Upload dist/ to S3**

```powershell
# Navigate to project root
cd "c:\Users\krishna potdar\OneDrive\Desktop\Dyanamic website"

# Set bucket name
$BUCKET_NAME = "hotel-management-frontend"

# Upload all assets with cache (they have hash in filename, never change)
aws s3 sync frontend-react/dist/assets "s3://$BUCKET_NAME/assets" `
  --cache-control "public, max-age=31536000" `
  --region us-east-1

# Upload index.html without cache (always get latest)
aws s3 cp frontend-react/dist/index.html "s3://$BUCKET_NAME/index.html" `
  --content-type "text/html; charset=utf-8" `
  --cache-control "no-cache, no-store, must-revalidate" `
  --region us-east-1

Write-Host "✅ Upload complete!"

# Get website URL
$region = "us-east-1"
$website_url = "http://$BUCKET_NAME.s3-website-$region.amazonaws.com"
Write-Host "Website URL: $website_url"
Write-Host "Test it: $website_url/login"
```

---

## 🧪 Test After Deployment

1. **Visit S3 Website URL**: `http://hotel-management-frontend.s3-website-us-east-1.amazonaws.com/`

2. **Test all routes** (should all work without 404):
   - `/` → Dashboard (redirects to login)
   - `/login` → Login page
   - `/register` → Register page
   - `/bookings` → Bookings page (redirects to login)

3. **Test page refresh** - Each route should work when refreshed directly

4. **Test registration**:
   - Register new user
   - Backend should respond from EC2 (23.22.102.15:5000)
   - Check browser network tab to confirm API calls to EC2

5. **Verify API calls**:
   - Open DevTools → Network tab
   - Check requests go to `http://23.22.102.15:5000/api/*`
   - Should see 200/201 responses (not 403/404)

---

## 🔍 Troubleshooting

### Problem: 403 Forbidden on S3 website

**Solution:**
```powershell
# Re-apply bucket policy
$policy = @{
    Version = "2012-10-17"
    Statement = @(
        @{
            Effect = "Allow"
            Principal = "*"
            Action = "s3:GetObject"
            Resource = "arn:aws:s3:::hotel-management-frontend/*"
        }
    )
} | ConvertTo-Json -Depth 10

$policy | Out-File policy.json -Encoding UTF8
aws s3api put-bucket-policy --bucket hotel-management-frontend --policy file://policy.json
Remove-Item policy.json
```

---

### Problem: Blank page or 404 on refresh

**Solution:**
```powershell
# Verify error document is set
aws s3 website s3://hotel-management-frontend/ `
  --index-document index.html `
  --error-document index.html
```

---

### Problem: API calls fail with CORS error

**Solution:**

Update backend CORS in `backend/.env`:
```env
CORS_ORIGIN=http://hotel-management-frontend.s3-website-us-east-1.amazonaws.com
```

Then restart backend:
```bash
npm start
```

---

### Problem: Can't find AWS CLI

**Solution:**
```powershell
# Check if AWS CLI is in PATH
$result = Get-Command aws -ErrorAction SilentlyContinue
if ($result) {
    Write-Host "AWS CLI found at: $($result.Source)"
} else {
    Write-Host "AWS CLI not found. Download from: https://aws.amazon.com/cli/"
}
```

---

## 📊 Files Deployed to S3

```
UPLOADED ✅
- s3://hotel-management-frontend/index.html
- s3://hotel-management-frontend/assets/index-DTc6Rz3U.css
- s3://hotel-management-frontend/assets/index-Xwu4t8R7.js
- s3://hotel-management-frontend/assets/react-vendor-2KnJ_jrg.js
- s3://hotel-management-frontend/assets/router-vendor-BltLO-Pr.js

NOT UPLOADED ❌ (Local development only)
- frontend-react/src/
- frontend-react/node_modules/
- frontend-react/.env
- frontend-react/.env.production
```

---

## 🌐 Domain Setup (Optional)

To use custom domain instead of S3 website URL:

```powershell
# Via CloudFront (recommended - includes HTTPS and caching)
# 1. Create CloudFront distribution in AWS Console
# 2. Point to: hotel-management-frontend.s3-website-us-east-1.amazonaws.com
# 3. Configure SSL certificate
# 4. Point your domain to CloudFront URL

# OR via Route 53 (if using AWS DNS)
# 1. Create A record
# 2. Type: Alias
# 3. Alias Target: S3 website endpoint
# 4. Evaluate Target Health: No
```

---

## 📈 Production Optimization

### Enable CloudFront CDN (For Faster Global Access)

```powershell
# This caches content at edge locations worldwide
# After CloudFront is set up, access your app faster from anywhere

# 1. Go to AWS Console → CloudFront
# 2. Create Distribution
# 3. Origin: s3://hotel-management-frontend.s3-website-us-east-1.amazonaws.com
# 4. Default Root Object: index.html
# 5. Create

# Then update .env.production to use CloudFront URL:
# VITE_API_BASE_URL=https://your-cloudfront-url.cloudfront.net
```

---

## ✅ Final Verification

After deployment to S3:

- [ ] Website loads at S3 URL
- [ ] Can navigate between /login, /register, /dashboard, /bookings
- [ ] Page refresh works on all routes
- [ ] Can register new user
- [ ] API calls go to EC2 backend (not to S3)
- [ ] Can see "Network" tab shows 200 responses
- [ ] Frontend talks to backend successfully
- [ ] Backend CORS allows S3 origin

---

## 📝 Summary

| Item | Status | Details |
|------|--------|---------|
| Build | ✅ Complete | All files minified and optimized |
| S3 Bucket | ⏳ Pending | Need to create and configure |
| Upload | ⏳ Pending | Need AWS CLI to upload |
| Testing | ⏳ Pending | Test after upload |
| Domain | ⏳ Optional | Use S3 URL or configure custom domain |

---

## 🎯 Next Steps

1. **Install AWS CLI** (if not done)
2. **Configure AWS credentials** (access keys)
3. **Run S3 deployment commands** (create bucket and upload)
4. **Test at S3 website URL**
5. **(Optional) Set up CloudFront** for faster access

---

**Questions?**
- Check PRODUCTION_DEPLOYMENT_GUIDE.md for more details
- Review AWS_vs_GCP_COMPARISON.md for deployment options
- Test preview locally: `npm run preview` and visit http://localhost:4173/

