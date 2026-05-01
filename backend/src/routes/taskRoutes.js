import express from 'express';
import {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  addComment,
  deleteTask,
  getDashboardStats,
} from '../controllers/taskController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(auth);

router.post('/', createTask);
router.get('/', getTasks);
router.get('/dashboard/stats', getDashboardStats);
router.get('/:id', getTaskById);
router.put('/:id', updateTask);
router.post('/:id/comments', addComment);
router.delete('/:id', deleteTask);

export default router;
