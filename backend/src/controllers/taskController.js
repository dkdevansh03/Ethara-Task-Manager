import Task from '../models/Task.js';
import Project from '../models/Project.js';
import config from '../config/constants.js';

// @desc    Create a task
// @route   POST /api/tasks
// @access  Private
export const createTask = async (req, res) => {
  try {
    const { title, description, projectId, assigneeId, priority, dueDate } = req.body;

    if (!title || !projectId) {
      return res.status(400).json({ message: 'Title and project ID are required' });
    }

    // Check if project exists and user is member
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const isMember = project.members.some((m) => m.user.toString() === req.userId);
    if (!isMember) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const task = await Task.create({
      title,
      description,
      project: projectId,
      creator: req.userId,
      assignee: assigneeId || null,
      priority: priority || 'Medium',
      dueDate,
    });

    await task.populate('creator assignee', 'name email');

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      task,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all tasks for a project
// @route   GET /api/tasks?projectId=id
// @access  Private
export const getTasks = async (req, res) => {
  try {
    const { projectId, status, assignee } = req.query;

    if (!projectId) {
      return res.status(400).json({ message: 'Project ID is required' });
    }

    // Check if project exists and user is member
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const isMember = project.members.some((m) => m.user.toString() === req.userId);
    if (!isMember) {
      return res.status(403).json({ message: 'Access denied' });
    }

    let query = { project: projectId };

    if (status) query.status = status;
    if (assignee) query.assignee = assignee;

    const tasks = await Task.find(query)
      .populate('creator assignee', 'name email')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      tasks,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get task by ID
// @route   GET /api/tasks/:id
// @access  Private
export const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('creator assignee', 'name email')
      .populate('comments.user', 'name email');

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check if user is member of project
    const project = await Project.findById(task.project);
    const isMember = project.members.some((m) => m.user.toString() === req.userId);

    if (!isMember) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.status(200).json({
      success: true,
      task,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
export const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check if user is member of project
    const project = await Project.findById(task.project);
    const isMember = project.members.some((m) => m.user.toString() === req.userId);

    if (!isMember) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { title, description, status, priority, dueDate, assigneeId } = req.body;

    if (title) task.title = title;
    if (description !== undefined) task.description = description;
    if (status) task.status = status;
    if (priority) task.priority = priority;
    if (dueDate) task.dueDate = dueDate;
    if (assigneeId !== undefined) task.assignee = assigneeId;

    await task.save();
    await task.populate('creator assignee', 'name email');

    res.status(200).json({
      success: true,
      message: 'Task updated successfully',
      task,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add comment to task
// @route   POST /api/tasks/:id/comments
// @access  Private
export const addComment = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ message: 'Comment text is required' });
    }

    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    task.comments.push({
      user: req.userId,
      text,
    });

    await task.save();
    await task.populate('comments.user', 'name email');

    res.status(200).json({
      success: true,
      message: 'Comment added successfully',
      task,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private (Creator or Admin)
export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check if user is creator or admin of project
    if (task.creator.toString() !== req.userId) {
      const project = await Project.findById(task.project);
      const member = project.members.find((m) => m.user.toString() === req.userId);

      if (!member || member.role !== config.ROLES.ADMIN) {
        return res.status(403).json({ message: 'Access denied' });
      }
    }

    await Task.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get dashboard stats
// @route   GET /api/tasks/dashboard/stats
// @access  Private
export const getDashboardStats = async (req, res) => {
  try {
    // Get all projects user is member of
    const projects = await Project.find({
      'members.user': req.userId,
    });

    const projectIds = projects.map((p) => p._id);

    const tasks = await Task.find({
      project: { $in: projectIds },
    });

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((t) => t.status === config.TASK_STATUS.COMPLETED).length;
    const inProgressTasks = tasks.filter((t) => t.status === config.TASK_STATUS.IN_PROGRESS).length;
    const overdueTasks = tasks.filter((t) => t.isOverdue && t.status !== config.TASK_STATUS.COMPLETED).length;

    const tasksByStatus = {
      [config.TASK_STATUS.TODO]: tasks.filter((t) => t.status === config.TASK_STATUS.TODO).length,
      [config.TASK_STATUS.IN_PROGRESS]: inProgressTasks,
      [config.TASK_STATUS.COMPLETED]: completedTasks,
    };

    const tasksByPriority = {
      Low: tasks.filter((t) => t.priority === 'Low').length,
      Medium: tasks.filter((t) => t.priority === 'Medium').length,
      High: tasks.filter((t) => t.priority === 'High').length,
    };

    res.status(200).json({
      success: true,
      stats: {
        totalProjects: projects.length,
        totalTasks,
        completedTasks,
        inProgressTasks,
        overdueTasks,
        tasksByStatus,
        tasksByPriority,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
