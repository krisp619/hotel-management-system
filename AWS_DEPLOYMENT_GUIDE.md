# 🚀 Deploy Backend to AWS

Complete guide to deploy your Node.js Hotel Management System backend on AWS.

---

## 🎯 AWS Deployment Options

| Option | Ease | Cost | Best For |
|--------|------|------|----------|
| **Elastic Beanstalk** ⭐ | Easy | Pay-as-you-go | Beginners |
| **EC2** | Medium | Pay-as-you-go | Full control |
| **Lambda** | Hard | Cheapest | Serverless |
| **LightSail** | Easy | Fixed price | Simple apps |

**Recommended**: **Elastic Beanstalk** (easiest for your project)

---

# ⭐ OPTION 1: Deploy to AWS Elastic Beanstalk (Recommended)

## Step 1: Create AWS Account

1. Go to https://aws.amazon.com
2. Click **"Create an AWS Account"**
3. Complete sign up
4. Add payment method

## Step 2: Install AWS CLI

Download and install AWS CLI:
https://aws.amazon.com/cli/

Verify installation:
```bash
aws --version
```

## Step 3: Configure AWS Credentials

Get your credentials from AWS Console:

1. Go to AWS Console → Security Credentials
2. Create Access Key
3. Copy Access Key ID and Secret Access Key

Configure locally:
```bash
aws configure
```

Enter:
- Access Key ID
- Secret Access Key
- Region: `us-east-1`
- Output: `json`

## Step 4: Install Elastic Beanstalk CLI

```bash
pip install awsebcli --upgrade --user
```

Verify:
```bash
eb --version
```

## Step 5: Prepare Your Backend

Navigate to your backend folder:
```bash
cd "C:\Users\krishna potdar\OneDrive\Desktop\Dyanamic website\backend"
```

Your folder should have:
```
backend/
├── server.js
├── package.json
├── .env (will be added on AWS)
└── node_modules/
```

## Step 6: Create Elastic Beanstalk App

In your backend folder:
```bash
eb init -p node.js-18 hotel-management --region us-east-1
```

This creates:
- `.elasticbeanstalk/` folder
- `.gitignore` file

## Step 7: Create Environment

```bash
eb create hotel-backend-env
```

This will:
- Create EC2 instances
- Deploy your code
- Create load balancer
- Take ~5-10 minutes

Wait for it to finish. You'll see:
```
Environment has been created successfully.
```

## Step 8: Add Environment Variables

Configure `.env` variables on AWS:

```bash
eb setenv MONGODB_URI="mongodb+srv://potdarkrishna352_db_user:ZGIcigr74KJB8utB@cluster0.2fufkan.mongodb.net/hotel-management?retryWrites=true&w=majority"
eb setenv NODE_ENV=production
eb setenv PORT=5000
```

## Step 9: Get Your Backend URL

```bash
eb open
```

Or check in AWS Console:
```
https://hotel-backend-env.elasticbeanstalk.com
```

This is your **Production Backend URL**!

---

# 🔗 STEP 10: Update Frontend

Update your frontend files with the production backend URL.

### Edit `frontend/js/script.js`

Find this line:
```javascript
const API_URL = 'http://localhost:5000';
```

Replace with:
```javascript
const API_URL = 'https://hotel-backend-env.elasticbeanstalk.com';
```

### Edit `frontend/js/admin.js`

Same change:
```javascript
const API_URL = 'https://hotel-backend-env.elasticbeanstalk.com';
```

## Push to GitHub & Redeploy Frontend

```bash
cd "C:\Users\krishna potdar\OneDrive\Desktop\Dyanamic website"
git add .
git commit -m "Update backend URL for AWS production"
git push
```

Netlify will automatically redeploy your frontend.

---

# ✅ Verify Everything Works

1. Open your frontend URL (Netlify)
2. Try booking a room
3. Check admin dashboard
4. Verify data in MongoDB Atlas

Everything should work! 🎉

---

# 📊 AWS Elastic Beanstalk Commands

```bash
# Deploy latest code
eb deploy

# Check status
eb status

# View logs
eb logs

# Open in browser
eb open

# SSH into server
eb ssh

# Terminate environment (WARNING: deletes everything!)
eb terminate
```

---

# 💰 AWS Cost Estimate

For free tier:
- **t2.micro** EC2 instance: **FREE** (first 12 months)
- **RDS** (if used): **FREE** (first 12 months)
- **Data transfer**: ~1GB free per month

After free tier:
- ~$10-20/month for basic usage

---

# 🐛 Troubleshooting

### Error: "eb command not found"
```bash
pip install awsebcli --upgrade --user
# Add to PATH or use full path
```

### Backend returns 502 Bad Gateway
- Check MongoDB connection string
- Check environment variables with `eb printenv`
- Check logs with `eb logs`

### CORS errors
- Backend already has CORS enabled
- Check frontend URL is correct

### Can't connect to MongoDB
- Verify connection string in `.env`
- Check MongoDB Atlas allows AWS IP
  - Go to MongoDB Atlas → Network Access
  - Add AWS IP or allow all IPs (0.0.0.0/0)

---

# 🔒 Security Tips

1. **Never commit .env file**
   - Already ignored by .gitignore
   - Set variables on AWS instead

2. **Use IAM users instead of root**
   - Don't use root AWS credentials
   - Create IAM user for EB deployment

3. **Enable HTTPS**
   - Elastic Beanstalk provides free SSL
   - Just enable in settings

4. **Monitor costs**
   - Enable billing alerts
   - Check AWS Billing Console regularly

---

# 📈 Next Steps

### Option 1: Add Custom Domain
```
Buy domain from Route53 or GoDaddy
→ Point to Elastic Beanstalk URL
→ Enable HTTPS
```

### Option 2: Auto-Scaling
```
If traffic increases:
→ EB auto-scales horizontally
→ Load balancer distributes traffic
→ Your app stays fast!
```

### Option 3: CI/CD Pipeline
```
GitHub → CodePipeline → Elastic Beanstalk
→ Auto-deploy on push!
```

---

# 🎯 Complete Checklist

- [ ] AWS account created
- [ ] AWS CLI installed and configured
- [ ] EB CLI installed
- [ ] Backend prepared
- [ ] `eb init` completed
- [ ] `eb create` completed
- [ ] Environment variables set
- [ ] Backend URL obtained
- [ ] Frontend URLs updated
- [ ] Frontend pushed to GitHub
- [ ] Tested booking functionality
- [ ] Tested admin dashboard
- [ ] Data saved in MongoDB Atlas

---

# 💡 Quick Reference

```bash
# Full deployment from scratch
cd backend
eb init -p node.js-18 hotel-management --region us-east-1
eb create hotel-backend-env
eb setenv MONGODB_URI="your-connection-string"
eb setenv NODE_ENV=production
eb open
```

---

# 🚀 Your Production URLs

After deployment:

```
📝 Frontend:    https://your-netlify-domain.netlify.app
👁️  Admin:      https://your-netlify-domain.netlify.app/admin.html
🔧 Backend:     https://hotel-backend-env.elasticbeanstalk.com
🗄️  Database:   MongoDB Atlas
```

---

# 📚 AWS Resources

- **Elastic Beanstalk Docs**: https://docs.aws.amazon.com/elasticbeanstalk
- **AWS Free Tier**: https://aws.amazon.com/free
- **Node.js on EB**: https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/create-deploy-nodejs.html
- **Environment Variables**: https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/environments-cfg-softwareversionlabels.html

---

# Alternative: AWS LightSail

If Elastic Beanstalk is too complex, try **LightSail**:

1. Go to AWS LightSail
2. Create instance → Node.js
3. Upload your code
4. Get URL
5. Set environment variables
6. Done!

Easier but less flexible. Fixed monthly price (~$5-10).

---

## Need Help?

Let me know if you get stuck at any step!

- AWS setup issues?
- Deployment errors?
- Connection problems?

**Let me know and I'll help!** 🚀

---

**Your backend will be live on AWS in ~10 minutes!** ✨
