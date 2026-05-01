import Project from '../models/Project.js';
import User from '../models/User.js';
import Task from '../models/Task.js';
import config from '../config/constants.js';

// @desc    Create a new project
// @route   POST /api/projects
// @access  Private
export const createProject = async (req, res) => {
  try {
    const { name, description, dueDate, memberIds = [] } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Project name is required' });
    }

    // Only users with global ADMIN role can create projects
    const requestingUser = await User.findById(req.userId);
    if (!requestingUser || requestingUser.role !== config.ROLES.ADMIN) {
      return res.status(403).json({ message: 'Only admins can create projects' });
    }

    const selectedMemberIds = [...new Set(Array.isArray(memberIds) ? memberIds : [])]
      .map((id) => String(id).trim())
      .filter((id) => id && id !== req.userId);

    const validMembers = selectedMemberIds.length
      ? await User.find({ _id: { $in: selectedMemberIds } }).select('_id')
      : [];

    if (validMembers.length !== selectedMemberIds.length) {
      return res.status(400).json({ message: 'One or more selected members are invalid' });
    }

    const project = await Project.create({
      name,
      description,
      dueDate,
      owner: req.userId,
      members: selectedMemberIds.map((id) => ({ user: id, role: config.ROLES.MEMBER })),
    });

    await project.populate('owner members.user', 'name email role');

    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      project,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all projects (user is member/owner)
// @route   GET /api/projects
// @access  Private
export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({
      'members.user': req.userId,
    })
      .populate('owner', 'name email')
      .populate('members.user', 'name email')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      projects,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get project by ID
// @route   GET /api/projects/:id
// @access  Private
export const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('owner', 'name email')
      .populate('members.user', 'name email');

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check if user is a member
    const isMember = project.members.some((m) => m.user._id.toString() === req.userId);
    if (!isMember) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.status(200).json({
      success: true,
      project,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private (Admin of project)
export const updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check if user is admin
    const member = project.members.find((m) => m.user.toString() === req.userId);
    if (!member || member.role !== config.ROLES.ADMIN) {
      return res.status(403).json({ message: 'Only admins can update project' });
    }

    const { name, description, status, dueDate } = req.body;

    if (name) project.name = name;
    if (description !== undefined) project.description = description;
    if (status) project.status = status;
    if (dueDate) project.dueDate = dueDate;

    await project.save();
    await project.populate('owner members.user', 'name email');

    res.status(200).json({
      success: true,
      message: 'Project updated successfully',
      project,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add member to project
// @route   POST /api/projects/:id/members
// @access  Private (Admin of project)
export const addMember = async (req, res) => {
  try {
    const { email, role } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check if user is admin
    const member = project.members.find((m) => m.user.toString() === req.userId);
    if (!member || member.role !== config.ROLES.ADMIN) {
      return res.status(403).json({ message: 'Only admins can add members' });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if already a member
    const alreadyMember = project.members.some((m) => m.user.toString() === user._id.toString());
    if (alreadyMember) {
      return res.status(400).json({ message: 'User is already a member' });
    }

    project.members.push({
      user: user._id,
      role: role || config.ROLES.MEMBER,
    });

    await project.save();
    await project.populate('members.user', 'name email');

    res.status(200).json({
      success: true,
      message: 'Member added successfully',
      project,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Remove member from project
// @route   DELETE /api/projects/:id/members/:userId
// @access  Private (Admin of project)
export const removeMember = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check if user is admin
    const member = project.members.find((m) => m.user.toString() === req.userId);
    if (!member || member.role !== config.ROLES.ADMIN) {
      return res.status(403).json({ message: 'Only admins can remove members' });
    }

    project.members = project.members.filter((m) => m.user.toString() !== req.params.userId);

    await project.save();
    await project.populate('members.user', 'name email');

    res.status(200).json({
      success: true,
      message: 'Member removed successfully',
      project,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private (Admin of project)
export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Any admin member of the project can delete it
    const member = project.members.find((m) => m.user.toString() === req.userId);
    if (!member || member.role !== config.ROLES.ADMIN) {
      return res.status(403).json({ message: 'Only project admins can delete project' });
    }

    // Cleanup project tasks to avoid orphan records
    await Task.deleteMany({ project: project._id });
    await Project.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Project deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
