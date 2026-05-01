const config = {
  ROLES: {
    ADMIN: 'Admin',
    MEMBER: 'Member',
  },
  TASK_STATUS: {
    TODO: 'To Do',
    IN_PROGRESS: 'In Progress',
    COMPLETED: 'Completed',
    OVERDUE: 'Overdue',
  },
  JWT_EXPIRE: process.env.JWT_EXPIRE || '7d',
};

export default config;
