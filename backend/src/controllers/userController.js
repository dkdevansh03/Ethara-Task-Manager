import User from '../models/User.js';
import config from '../config/constants.js';

export const getUsers = async (req, res) => {
  try {
    const requester = await User.findById(req.userId);

    if (!requester || requester.role !== config.ROLES.ADMIN) {
      return res.status(403).json({ message: 'Only admins can view users' });
    }

    const users = await User.find({}, 'name email role avatar').sort('name');

    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};