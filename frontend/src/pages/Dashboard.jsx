import React, { useState, useEffect } from 'react';
import { taskAPI } from '../utils/api';
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await taskAPI.getDashboardStats();
      setStats(response.data.stats);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load stats');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center mt-20">Loading...</div>;
  if (error) return <div className="alert alert-error">{error}</div>;

  return (
    <div className="dashboard">
      <div className="dashboard-hero">
        <div className="hero-content">
          <h1 className="app-title">📋 Task Manager Pro</h1>
          <p className="hero-subtitle">Organize, Collaborate, Deliver</p>
        </div>
      </div>

      <div className="dashboard-section">
        <h2 className="section-title">Quick Stats</h2>
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">📊</div>
            <div className="stat-content">
              <div className="stat-value">{stats?.totalProjects || 0}</div>
              <div className="stat-label">Total Projects</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">✓</div>
            <div className="stat-content">
              <div className="stat-value">{stats?.totalTasks || 0}</div>
              <div className="stat-label">Total Tasks</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">✅</div>
            <div className="stat-content">
              <div className="stat-value">{stats?.completedTasks || 0}</div>
              <div className="stat-label">Completed</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">🚀</div>
            <div className="stat-content">
              <div className="stat-value">{stats?.inProgressTasks || 0}</div>
              <div className="stat-label">In Progress</div>
            </div>
          </div>

          <div className="stat-card danger">
            <div className="stat-icon">⏰</div>
            <div className="stat-content">
              <div className="stat-value">{stats?.overdueTasks || 0}</div>
              <div className="stat-label">Overdue</div>
            </div>
          </div>
        </div>
      </div>

      <div className="charts-container">
        <div className="chart-card">
          <h3>Tasks by Status</h3>
          <div className="task-status">
            <div className="status-item">
              <span>To Do:</span>
              <span className="badge badge-todo">{stats?.tasksByStatus?.['To Do'] || 0}</span>
            </div>
            <div className="status-item">
              <span>In Progress:</span>
              <span className="badge badge-in-progress">{stats?.tasksByStatus?.['In Progress'] || 0}</span>
            </div>
            <div className="status-item">
              <span>Completed:</span>
              <span className="badge badge-completed">{stats?.tasksByStatus?.Completed || 0}</span>
            </div>
          </div>
        </div>

        <div className="chart-card">
          <h3>Tasks by Priority</h3>
          <div className="task-priority">
            <div className="priority-item">
              <span>High:</span>
              <span className="badge badge-high">{stats?.tasksByPriority?.High || 0}</span>
            </div>
            <div className="priority-item">
              <span>Medium:</span>
              <span className="badge badge-medium">{stats?.tasksByPriority?.Medium || 0}</span>
            </div>
            <div className="priority-item">
              <span>Low:</span>
              <span className="badge badge-low">{stats?.tasksByPriority?.Low || 0}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
