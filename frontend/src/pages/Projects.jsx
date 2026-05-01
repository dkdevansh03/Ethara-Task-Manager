import React, { useState, useEffect } from 'react';
import { projectAPI, taskAPI } from '../utils/api';
import './Projects.css';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '', dueDate: '' });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await projectAPI.getProjects();
      setProjects(response.data.projects);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    try {
      await projectAPI.createProject(formData);
      setFormData({ name: '', description: '', dueDate: '' });
      setShowForm(false);
      fetchProjects();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create project');
    }
  };

  if (loading) return <div className="text-center mt-20">Loading...</div>;

  return (
    <div className="projects-container">
      <div className="projects-header">
        <h1>Projects</h1>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? '✕ Cancel' : '+ New Project'}
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {showForm && (
        <form className="project-form" onSubmit={handleCreateProject}>
          <div className="form-group">
            <label className="form-label">Project Name</label>
            <input
              type="text"
              className="form-input"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
          <div className="form-group">
            <label className="form-label">Due Date</label>
            <input
              type="date"
              className="form-input"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Create Project
          </button>
        </form>
      )}

      <div className="projects-grid">
        {projects.map((project) => (
          <div key={project._id} className="project-card">
            <div className="project-header">
              <h3>{project.name}</h3>
              <span className="badge">{project.status}</span>
            </div>
            <p className="project-description">{project.description}</p>
            <div className="project-meta">
              <span>👥 {project.members.length} members</span>
              {project.dueDate && (
                <span>📅 {new Date(project.dueDate).toLocaleDateString()}</span>
              )}
            </div>
            <div className="project-actions">
              <button className="btn btn-small btn-primary">View Details</button>
            </div>
          </div>
        ))}
      </div>

      {projects.length === 0 && !loading && (
        <div className="empty-state">
          <p>No projects yet. Create one to get started!</p>
        </div>
      )}
    </div>
  );
};

export default Projects;
