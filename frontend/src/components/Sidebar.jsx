import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h3>Menu</h3>
      </div>
      <nav className="sidebar-nav">
        <Link to="/dashboard" className={`sidebar-link ${isActive('/dashboard') ? 'active' : ''}`}>
          📊 Dashboard
        </Link>
        <Link to="/projects" className={`sidebar-link ${isActive('/projects') ? 'active' : ''}`}>
          🗂️ Projects
        </Link>
        <Link to="/tasks" className={`sidebar-link ${isActive('/tasks') ? 'active' : ''}`}>
          ✓ Tasks
        </Link>
      </nav>
    </aside>
  );
};

export default Sidebar;
