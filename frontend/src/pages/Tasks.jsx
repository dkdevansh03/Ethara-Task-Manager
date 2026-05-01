import React, { useState, useEffect } from 'react';
import { projectAPI, taskAPI } from '../utils/api';
import './Tasks.css';

const Tasks = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState('');
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'Medium',
    dueDate: '',
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    if (selectedProject) {
      fetchTasks();
    }
  }, [selectedProject, filter]);

  const fetchProjects = async () => {
    try {
      const response = await projectAPI.getProjects();
      setProjects(response.data.projects);
      if (response.data.projects.length > 0) {
        setSelectedProject(response.data.projects[0]._id);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const fetchTasks = async () => {
    try {
      const filters = filter ? { status: filter } : {};
      const response = await taskAPI.getTasks(selectedProject, filters);
      setTasks(response.data.tasks);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load tasks');
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      await taskAPI.createTask({
        ...formData,
        projectId: selectedProject,
      });
      setFormData({ title: '', description: '', priority: 'Medium', dueDate: '' });
      setShowForm(false);
      fetchTasks();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create task');
    }
  };

  const handleUpdateTask = async (taskId, status) => {
    try {
      await taskAPI.updateTask(taskId, { status });
      fetchTasks();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update task');
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await taskAPI.deleteTask(taskId);
        fetchTasks();
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete task');
      }
    }
  };

  if (loading) return <div className="text-center mt-20">Loading...</div>;

  return (
    <div className="tasks-container">
      <div className="tasks-header">
        <h1>Tasks</h1>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? '✕ Cancel' : '+ New Task'}
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="tasks-controls">
        <select
          className="form-select"
          value={selectedProject}
          onChange={(e) => setSelectedProject(e.target.value)}
        >
          {projects.map((project) => (
            <option key={project._id} value={project._id}>
              {project.name}
            </option>
          ))}
        </select>

        <select className="form-select" value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="">All Status</option>
          <option value="To Do">To Do</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
      </div>

      {showForm && (
        <form className="task-form" onSubmit={handleCreateTask}>
          <div className="form-group">
            <label className="form-label">Task Title</label>
            <input
              type="text"
              className="form-input"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              className="form-textarea"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Priority</label>
              <select
                className="form-select"
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Due Date</label>
              <input
                type="date"
                className="form-input"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              />
            </div>
          </div>
          <button type="submit" className="btn btn-primary">
            Create Task
          </button>
        </form>
      )}

      <div className="tasks-list">
        {tasks.map((task) => (
          <div key={task._id} className="task-item">
            <div className="task-info">
              <h4>{task.title}</h4>
              <p>{task.description}</p>
              <div className="task-meta">
                <span className={`badge badge-${task.priority.toLowerCase()}`}>{task.priority}</span>
                <span className={`badge badge-${task.status.toLowerCase().replace(' ', '-')}`}>{task.status}</span>
                {task.dueDate && <span>📅 {new Date(task.dueDate).toLocaleDateString()}</span>}
              </div>
            </div>
            <div className="task-actions">
              <select
                className="form-select"
                value={task.status}
                onChange={(e) => handleUpdateTask(task._id, e.target.value)}
              >
                <option>To Do</option>
                <option>In Progress</option>
                <option>Completed</option>
              </select>
              <button
                className="btn btn-danger btn-small"
                onClick={() => handleDeleteTask(task._id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {tasks.length === 0 && !loading && (
        <div className="empty-state">
          <p>No tasks yet. Create one to get started!</p>
        </div>
      )}
    </div>
  );
};

export default Tasks;
