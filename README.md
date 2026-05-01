# Team Task Manager

A full-stack web application for team task management with role-based access control.

## Features

- ✅ User Authentication (Signup/Login with JWT)
- 🗂️ Project Management (Create, update, delete projects)
- ✓ Task Management (Create, assign, track tasks)
- 📊 Dashboard with Statistics
- 👥 Team Member Management
- 🔐 Role-Based Access Control (Admin/Member)
- 📱 Responsive Design

## Tech Stack

### Backend
- Node.js + Express.js
- MongoDB (Mongoose)
- JWT Authentication
- bcryptjs for password hashing

### Frontend
- React 18
- React Router v6
- Axios for API calls
- Vite

## Getting Started

### Prerequisites
- Node.js (v14+)
- MongoDB (local or cloud)
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file (copy from `.env.example`):
```bash
PORT=5000
MONGODB_URI=mongodb://localhost:27017/task-manager
JWT_SECRET=your-secret-key-here
JWT_EXPIRE=7d
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

4. Start the server:
```bash
npm run dev
```

Server will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
VITE_API_URL=http://localhost:5000/api
```

4. Start development server:
```bash
npm run dev
```

App will run on `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (Protected)

### Projects
- `POST /api/projects` - Create project (Protected)
- `GET /api/projects` - Get all projects (Protected)
- `GET /api/projects/:id` - Get project details (Protected)
- `PUT /api/projects/:id` - Update project (Protected)
- `POST /api/projects/:id/members` - Add member (Protected)
- `DELETE /api/projects/:id/members/:userId` - Remove member (Protected)
- `DELETE /api/projects/:id` - Delete project (Protected)

### Tasks
- `POST /api/tasks` - Create task (Protected)
- `GET /api/tasks?projectId=id` - Get tasks (Protected)
- `GET /api/tasks/:id` - Get task details (Protected)
- `PUT /api/tasks/:id` - Update task (Protected)
- `POST /api/tasks/:id/comments` - Add comment (Protected)
- `DELETE /api/tasks/:id` - Delete task (Protected)
- `GET /api/tasks/dashboard/stats` - Get dashboard stats (Protected)

## Deployment on Railway

1. Create Railway account at [railway.app](https://railway.app)

2. For Backend:
   - Connect GitHub repo
   - Select backend folder as root directory
   - Add environment variables
   - Deploy

3. For Frontend:
   - Connect GitHub repo
   - Select frontend folder as root directory
   - Update `VITE_API_URL` to Railway backend URL
   - Deploy

## Project Structure

```
Ethara Task Manager/
├── backend/
│   ├── src/
│   │   ├── config/          # Database and constants config
│   │   ├── controllers/     # Route controllers
│   │   ├── middleware/      # Auth and error middleware
│   │   ├── models/          # MongoDB models
│   │   ├── routes/          # API routes
│   │   └── index.js         # Main server file
│   ├── .env.example
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/      # Reusable components
    │   ├── context/         # Auth context
    │   ├── pages/           # Page components
    │   ├── styles/          # Global styles
    │   ├── utils/           # API utilities
    │   ├── App.jsx
    │   └── main.jsx
    ├── index.html
    ├── vite.config.js
    └── package.json
```

## User Roles

- **Admin**: Can create projects, manage members, update project settings
- **Member**: Can view projects, create/update tasks

## Testing

### Test User Credentials (After Signup)
```
Email: test@example.com
Password: password123
```

## Future Enhancements

- [ ] Real-time notifications
- [ ] Email notifications
- [ ] File attachments
- [ ] Advanced filtering and search
- [ ] Team collaboration features
- [ ] Mobile app

## License

MIT
