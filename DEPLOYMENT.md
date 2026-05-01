# Railway Deployment Guide

## Overview

This guide will help you deploy the Team Task Manager application on Railway, a modern cloud platform for hosting applications.

## Prerequisites

- Railway account (free tier available): https://railway.app
- GitHub account with repository access
- GitHub repository with your code pushed
- MongoDB Atlas account (for cloud database): https://www.mongodb.com/cloud/atlas

## Step-by-Step Deployment

### Part 1: MongoDB Atlas Setup

1. **Create MongoDB Account**
   - Go to https://www.mongodb.com/cloud/atlas
   - Sign up with email
   - Complete verification

2. **Create a Cluster**
   - Click "Create" → Select "Build a Cluster"
   - Choose free tier (M0)
   - Select region closest to you
   - Click "Create Cluster"

3. **Add User**
   - Go to Database Access
   - Click "Add New User"
   - Create username and password (save these!)
   - Select "Scram (Username/Password)"
   - Click "Add User"

4. **Get Connection String**
   - Go to Clusters
   - Click "Connect"
   - Select "Connect your application"
   - Choose "Node.js" driver
   - Copy connection string
   - Replace `<password>` with your password
   - Replace `myFirstDatabase` with `task-manager`
   - **Save this string!**

Example format:
```
mongodb+srv://username:password@cluster.mongodb.net/task-manager?retryWrites=true&w=majority
```

---

### Part 2: Railway Backend Deployment

1. **Create Railway Account**
   - Go to https://railway.app
   - Sign in with GitHub
   - Authorize Railway

2. **Create New Project**
   - Click "Create New Project"
   - Select "GitHub Repo"
   - Authorize and select your repository
   - Select the repository

3. **Add Backend Service**
   - Click "Add"
   - Select "GitHub Repo"
   - Confirm repository selection
   - Select "backend" directory as root (if you have separate folders)
   - Click "Deploy"

4. **Configure Environment Variables**
   - Go to Variables in project settings
   - Add the following variables:
   
   ```
   PORT=5000
   MONGODB_URI=<your-mongodb-connection-string>
   JWT_SECRET=your-super-secret-key-change-me-12345
   NODE_ENV=production
   FRONTEND_URL=<your-frontend-railway-url>  (We'll get this later)
   ```

5. **Get Backend URL**
   - Wait for deployment to complete (green status)
   - In the Deployment tab, copy the Railway URL (looks like: `https://task-manager-backend-production.up.railway.app`)
   - **Save this URL!**

---

### Part 3: Railway Frontend Deployment

1. **Add Frontend Service**
   - In your Railway project, click "Add"
   - Select "GitHub Repo"
   - Confirm and deploy
   - Select "frontend" directory as root

2. **Configure Environment Variables**
   - Go to Variables
   - Add:
   ```
   VITE_API_URL=https://your-backend-railway-url/api
   ```
   (Use the backend URL you saved earlier with `/api` suffix)

3. **Build Configuration**
   - Ensure build command is: `npm run build`
   - Ensure start command is: `npm start` or configure for static hosting
   - For Railway static hosting, install: `npm i -g serve`
   - Start command: `serve -s dist -l 5000`

4. **Get Frontend URL**
   - Wait for deployment
   - Copy the Railway URL (looks like: `https://task-manager-frontend-production.up.railway.app`)

---

### Part 4: Update Backend with Frontend URL

1. Go back to Backend service settings
2. Click Variables
3. Update `FRONTEND_URL` with your frontend Railway URL
4. Trigger a redeploy

---

## Complete Environment Variables Reference

### Backend (.env on Railway)
```
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/task-manager
JWT_SECRET=a-very-secure-random-key-change-this
JWT_EXPIRE=7d
NODE_ENV=production
FRONTEND_URL=https://your-frontend-railway-url
```

### Frontend (.env on Railway)
```
VITE_API_URL=https://your-backend-railway-url/api
```

---

## Deployment Checklist

- [ ] MongoDB Atlas cluster created
- [ ] MongoDB user created with password
- [ ] MongoDB connection string copied
- [ ] Railway account created
- [ ] Repository pushed to GitHub
- [ ] Backend deployed with all env vars
- [ ] Backend URL copied
- [ ] Frontend deployed with env vars
- [ ] Frontend URL copied
- [ ] Backend updated with frontend URL
- [ ] All services show green status

---

## Troubleshooting Deployment Issues

### Backend Connection Issues

**Problem:** Backend logs show "MongoDB Connection Error"
**Solution:**
1. Check MongoDB connection string in environment variables
2. Verify MongoDB Atlas IP whitelist includes Railway IPs (usually set to 0.0.0.0/0 for ease)
3. Check username and password are correct in connection string
4. Test connection string in MongoDB Compass

**Problem:** Backend deployed but API returns 404
**Solution:**
1. Check backend service is running (green status)
2. Verify PORT environment variable is set to 5000
3. Check logs for startup errors
4. Try accessing http://your-backend-url/api/health

### Frontend Connection Issues

**Problem:** Frontend deployed but stuck loading
**Solution:**
1. Check browser console for CORS errors
2. Verify `VITE_API_URL` points to correct backend URL
3. Ensure backend `FRONTEND_URL` matches frontend URL
4. Try accessing frontend URL directly

**Problem:** API calls return CORS error
**Solution:**
1. Backend CORS is configured for the FRONTEND_URL
2. Make sure both URLs are correct in environment variables
3. Rebuild and redeploy frontend after changing env vars

### Build Failures

**Problem:** "npm: not found" during deployment
**Solution:**
1. Ensure Node.js environment is selected in Railway
2. Check package.json is in the correct root directory
3. Verify all dependencies are specified (not globally installed)

**Problem:** Build timeout
**Solution:**
1. Check npm dependencies for size
2. Remove unnecessary packages
3. Consider using npm ci instead of npm install

---

## Monitoring & Logs

### View Logs
1. Go to your Railway project
2. Select the service (backend or frontend)
3. Click "Logs" tab
4. View real-time logs

### Monitor Performance
1. Go to "Metrics" tab
2. View CPU, Memory, Network usage
3. Set up alerts if needed

---

## Updating After Deployment

### Deploy Backend Changes
1. Push changes to GitHub
2. Railway automatically redeploys
3. Or manually trigger redeploy in Railway dashboard

### Deploy Frontend Changes
1. Push changes to GitHub
2. Railway rebuilds and redeploys
3. Check build logs for errors

---

## Custom Domain (Optional)

1. In Railway project, go to Settings
2. Look for "Custom Domains"
3. Add your domain
4. Update DNS records as instructed
5. Update environment variables with new URLs

---

## Costs

- **Railway Free Tier:** $5/month credit (enough for small projects)
- **MongoDB Atlas:** Free tier includes 512MB storage
- **Total:** ~$0 for small projects, scales with usage

---

## Performance Optimization

### Backend
- Database indexes are set up in models
- Connection pooling via Mongoose
- CORS configured for production

### Frontend
- Built with Vite for fast builds
- Code splitting for better load times
- CSS minified and optimized

---

## Security Best Practices

✅ **Implemented:**
- JWT token authentication
- Password hashing with bcryptjs
- Environment variables for secrets
- CORS protection
- Input validation

⚠️ **For Production:**
- Change JWT_SECRET to a strong random value
- Enable HTTPS (Railway does this by default)
- Set up rate limiting on API
- Use strong MongoDB passwords
- Enable IP whitelist on MongoDB Atlas
- Regular security audits
- Keep dependencies updated

---

## Support

- Railway Documentation: https://docs.railway.app
- MongoDB Atlas Help: https://www.mongodb.com/support
- Check logs in Railway dashboard for detailed errors

---

## Next Steps After Deployment

1. Test all features in production
2. Monitor logs for errors
3. Set up monitoring/alerts
4. Plan for scaling if needed
5. Regular backups of database
