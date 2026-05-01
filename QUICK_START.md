# Quick Reference - Team Task Manager

## 🚀 Get Started in 3 Steps

### Step 1: Ensure MongoDB is Running
```bash
# Make sure MongoDB is running on your system
# Default connection: mongodb://localhost:27017
```

### Step 2: Start Backend (Terminal 1)
```bash
cd backend
npm start
```
✅ Backend runs on: http://localhost:5000

### Step 3: Start Frontend (Terminal 2)
```bash
cd frontend
npm run dev
```
✅ Frontend runs on: http://localhost:3000

**Open browser → http://localhost:3000** 🎉

---

## 📝 Quick Testing

### Create Test Account
1. Click "Sign up"
2. Fill in: Name, Email, Password
3. Click "Sign Up"

### Create Project
1. Go to "Projects" page
2. Click "+ New Project"
3. Enter project name
4. Click "Create Project"

### Create Task
1. Go to "Tasks" page
2. Select a project
3. Click "+ New Task"
4. Fill in details
5. Click "Create Task"

### View Dashboard
1. Click "Dashboard" in sidebar
2. See statistics and charts

---

## 📁 Project Files

```
backend/           → Node.js server
frontend/          → React app
README.md          → Features overview
SETUP.md           → Detailed setup
DEPLOYMENT.md      → Railway deployment
PROJECT_SUMMARY.md → Full architecture
```

---

## 🔐 User Roles

| Role | Can Do |
|------|--------|
| Admin | Create projects, manage members, delete projects |
| Member | Create tasks, view projects, update tasks |

---

## 📊 API Base URL

- **Local:** `http://localhost:5000/api`
- **Production:** `https://your-railway-url/api`

---

## 🆘 Common Issues

### Port Already in Use
```bash
# Kill processes
lsof -ti:5000 | xargs kill -9  # Backend
lsof -ti:3000 | xargs kill -9  # Frontend
```

### MongoDB Connection Error
- Ensure MongoDB is running
- Check .env file has correct MONGODB_URI

### API not found Error
- Backend must be running on port 5000
- Check console for startup errors

---

## 📚 Key Files to Know

| File | Purpose |
|------|---------|
| `backend/src/index.js` | Express server |
| `backend/src/models/` | Database schemas |
| `frontend/src/App.jsx` | Main React app |
| `frontend/src/pages/Dashboard.jsx` | Dashboard page |
| `backend/.env` | Backend configuration |
| `frontend/.env` | Frontend configuration |

---

## 🚢 Deploy on Railway

1. Create Railway account: https://railway.app
2. Connect GitHub repo
3. Add backend service with env vars
4. Add frontend service with env vars
5. Update FRONTEND_URL in backend after deploy
6. Done! ✅

Full guide: See `DEPLOYMENT.md`

---

## 💾 Environment Variables

### Backend (.env)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/task-manager
JWT_SECRET=your-secret-key
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000/api
```

---

## 📞 Documentation

- **README.md** - What's included
- **SETUP.md** - How to run locally
- **DEPLOYMENT.md** - Deploy to Railway
- **PROJECT_SUMMARY.md** - Architecture details

---

## ✅ Project Status

- ✅ Backend: Complete with all APIs
- ✅ Frontend: Complete with all pages
- ✅ Database: MongoDB models ready
- ✅ Authentication: JWT configured
- ✅ Deployment: Railway ready
- ✅ Documentation: Full guides provided

---

## 🎯 What's Next?

1. ✅ Run locally (see above)
2. ✅ Test all features
3. ✅ Deploy to Railway (see DEPLOYMENT.md)
4. ✅ Share with team!

Happy coding! 🚀
