import Task from '../models/Task.js';
import Project from '../models/Project.js';
import User from '../models/User.js';
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

    if (!assigneeId) {
      return res.status(400).json({ message: 'Assignee is required' });
    }

    // Check if project exists and user is member
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Only project admins can create tasks
    const member = project.members.find((m) => m.user.toString() === req.userId);
    if (!member || member.role !== config.ROLES.ADMIN) {
      return res.status(403).json({ message: 'Only project admins can create tasks' });
    }

    if (assigneeId) {
      const isProjectMember = project.members.some((m) => m.user.toString() === assigneeId);
      if (!isProjectMember) {
        return res.status(400).json({ message: 'Assignee must be a member of the project' });
      }
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

    const member = project.members.find((m) => m.user.toString() === req.userId);
    if (!member) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Admins see all tasks in project; members see only tasks assigned to them
    let query = { project: projectId };
    if (status) query.status = status;

    if (member.role === config.ROLES.ADMIN) {
      if (assignee) query.assignee = assignee;
    } else {
      // non-admin members can only see their own assigned tasks
      query.assignee = req.userId;
    }

    const tasks = await Task.find(query).populate('creator assignee', 'name email').sort('-createdAt');

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

    // Check permissions: admin of project or assignee
    const project = await Project.findById(task.project);
    const member = project.members.find((m) => m.user.toString() === req.userId);
    const isAssignee = task.assignee && task.assignee.toString() === req.userId;

    if (!member && !isAssignee) {
      return res.status(403).json({ message: 'Access denied' });
    }

    if (member && member.role !== config.ROLES.ADMIN && !isAssignee) {
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

    // Check permissions based on project role and assignee
    const project = await Project.findById(task.project);
    const member = project.members.find((m) => m.user.toString() === req.userId);
    const isAssignee = task.assignee && task.assignee.toString() === req.userId;

    if (!member && !isAssignee) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { title, description, status, priority, dueDate, assigneeId } = req.body;

    // Admins can update all fields
    if (member && member.role === config.ROLES.ADMIN) {
      if (title) task.title = title;
      if (description !== undefined) task.description = description;
      if (status) task.status = status;
      if (priority) task.priority = priority;
      if (dueDate) task.dueDate = dueDate;
      if (assigneeId !== undefined) {
        if (assigneeId) {
          const isProjectMember = project.members.some((m) => m.user.toString() === assigneeId);
          if (!isProjectMember) {
            return res.status(400).json({ message: 'Assignee must be a member of the project' });
          }
        }
        task.assignee = assigneeId || null;
      }
    } else if (isAssignee) {
      // Non-admin assignee can only mark task as completed
      if (status && status === config.TASK_STATUS.COMPLETED) {
        task.status = config.TASK_STATUS.COMPLETED;
      } else {
        return res.status(403).json({ message: 'Only admins can modify this task. Assignees may only mark it completed.' });
      }
    }

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

    // Only project admins can delete tasks
    const project = await Project.findById(task.project);
    const member = project.members.find((m) => m.user.toString() === req.userId);
    if (!member || member.role !== config.ROLES.ADMIN) {
      return res.status(403).json({ message: 'Only project admins can delete tasks' });
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
