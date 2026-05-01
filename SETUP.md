# Setup and Run Instructions

## Prerequisites
- Node.js v18+ 
- MongoDB (local or cloud instance)
- npm or yarn
- Git (optional)

## Quick Start (Local Development)

### Step 1: MongoDB Setup

**Option A: Local MongoDB**
1. Install MongoDB from [mongodb.com/try/download/community](https://www.mongodb.com/try/download/community)
2. Start MongoDB service
3. MongoDB will run on `mongodb://localhost:27017`

**Option B: MongoDB Cloud (MongoDB Atlas)**
1. Create account at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Get connection string (looks like: `mongodb+srv://user:pass@cluster.mongodb.net/dbname`)
4. Update `MONGODB_URI` in `backend/.env`

### Step 2: Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Environment is already configured in `.env`. Verify values:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/task-manager
JWT_SECRET=task-manager-super-secret-key-change-in-production-12345
FRONTEND_URL=http://localhost:3000
```

3. Start backend server:
```bash
npm run dev
```

You'll see:
```
🚀 Server is running on port 5000
MongoDB Connected: localhost
```

**Backend is ready at:** `http://localhost:5000`

### Step 3: Frontend Setup

**In a new terminal:**

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Environment is already configured in `.env`:
```
VITE_API_URL=http://localhost:5000/api
```

3. Start frontend dev server:
```bash
npm run dev
```

You'll see:
```
VITE v5.0.2  ready in 234 ms
➜  Local:   http://localhost:3000/
```

**Application is ready at:** `http://localhost:3000`

### Step 4: Test the Application

1. Open browser: `http://localhost:3000`
2. Click "Sign up" to create a new account
3. Fill in details:
   - Name: Your Name
   - Email: your@email.com
   - Password: Any password (min 6 chars)
4. Click "Sign Up" → You're logged in! 🎉
5. Create a project from Projects page
6. Create tasks within the project
7. View dashboard for statistics



---

## Deployment on Railway

### Backend Deployment

1. Create Railway account: [railway.app](https://railway.app)
2. Connect your GitHub repository
3. In Railway dashboard:
   - Add new service
   - Connect to GitHub
   - Select "backend" folder as root directory
   - Add environment variables:
     ```
     PORT=5000
     MONGODB_URI=<your-mongodb-url>
     JWT_SECRET=<strong-secret-key>
     NODE_ENV=production
     FRONTEND_URL=<your-frontend-url>
     ```
   - Deploy

### Frontend Deployment

1. In Railway dashboard:
   - Add new service for frontend
   - Select "frontend" folder as root directory
   - Add environment variables:
     ```
     VITE_API_URL=<your-backend-railway-url>/api
     ```
   - Deploy

**Note:** After deployment, update the `VITE_API_URL` to point to your Railway backend URL.

---

## Production Build

### Backend Production Build
```bash
cd backend
# No build needed, runs as is
# Update .env:
# NODE_ENV=production
npm start
```

### Frontend Production Build
```bash
cd frontend
npm run build
# Creates optimized build in dist/ folder
npm run preview  # Test production build locally
```

---

## Troubleshooting

### Port already in use
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

### MongoDB connection error
- Verify MongoDB is running
- Check connection string in `.env`
- Try connecting with MongoDB Compass

### API not found errors
- Ensure backend is running on port 5000
- Check backend console for errors
- Verify `VITE_API_URL` in frontend `.env`

### CORS errors
- Backend CORS is configured for `http://localhost:3000`
- Update `FRONTEND_URL` in backend `.env` if using different URL

---

## Environment Variables Explained

### Backend (.env)
| Variable | Purpose |
|----------|---------|
| PORT | Server port (default: 5000) |
| MONGODB_URI | MongoDB connection string |
| JWT_SECRET | Secret for JWT tokens (change in production!) |
| JWT_EXPIRE | Token expiration time (default: 7d) |
| NODE_ENV | Environment (development/production) |
| FRONTEND_URL | Frontend URL for CORS |

### Frontend (.env)
| Variable | Purpose |
|----------|---------|
| VITE_API_URL | Backend API URL for requests |

---

## Project Structure

```
Ethara Task Manager/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.js
│   │   │   └── constants.js
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── projectController.js
│   │   │   └── taskController.js
│   │   ├── middleware/
│   │   │   ├── auth.js
│   │   │   ├── authorize.js
│   │   │   └── errorHandler.js
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── Project.js
│   │   │   └── Task.js
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── projectRoutes.js
│   │   │   └── taskRoutes.js
│   │   └── index.js (main server)
│   ├── .env
│   ├── package.json
│   └── package-lock.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   └── *.css
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Projects.jsx
│   │   │   ├── Tasks.jsx
│   │   │   └── *.css
│   │   ├── styles/
│   │   │   └── global.css
│   │   ├── utils/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   ├── .env
│   ├── package.json
│   └── package-lock.json
│
├── README.md
├── SETUP.md (this file)
├── DEPLOYMENT.md
├── QUICK_START.md
├── PROJECT_SUMMARY.md
```

---

## API Testing

Use tools like Postman or cURL to test API endpoints:

### Test Authentication
```bash
# Signup
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name":"Test User",
    "email":"test@example.com",
    "password":"password123",
    "confirmPassword":"password123"
  }'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email":"test@example.com",
    "password":"password123"
  }'
```

---

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review backend server console for errors
3. Check browser console for frontend errors
4. Verify all environment variables are set correctly
