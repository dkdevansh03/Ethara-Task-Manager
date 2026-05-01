import axios from 'axios';

const normalizeApiUrl = (url) => {
  const trimmed = (url || '').trim().replace(/\/$/, '');

  if (!trimmed) {
    return 'http://localhost:5000/api';
  }

  return trimmed.endsWith('/api') ? trimmed : `${trimmed}/api`;
};

const API_URL = normalizeApiUrl(import.meta.env.VITE_API_URL);

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth endpoints
export const authAPI = {
  signup: (data) => api.post('/auth/signup', data),
  login: (data) => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/profile'),
};

// User endpoints
export const userAPI = {
  getUsers: () => api.get('/users'),
};

// Project endpoints
export const projectAPI = {
  createProject: (data) => api.post('/projects', data),
  getProjects: () => api.get('/projects'),
  getProjectById: (id) => api.get(`/projects/${id}`),
  updateProject: (id, data) => api.put(`/projects/${id}`, data),
  addMember: (id, data) => api.post(`/projects/${id}/members`, data),
  removeMember: (id, userId) => api.delete(`/projects/${id}/members/${userId}`),
  deleteProject: (id) => api.delete(`/projects/${id}`),
};

// Task endpoints
export const taskAPI = {
  createTask: (data) => api.post('/tasks', data),
  getTasks: (projectId, filters) => {
    let url = `/tasks?projectId=${projectId}`;
    if (filters?.status) url += `&status=${filters.status}`;
    if (filters?.assignee) url += `&assignee=${filters.assignee}`;
    return api.get(url);
  },
  getTaskById: (id) => api.get(`/tasks/${id}`),
  updateTask: (id, data) => api.put(`/tasks/${id}`, data),
  addComment: (id, data) => api.post(`/tasks/${id}/comments`, data),
  deleteTask: (id) => api.delete(`/tasks/${id}`),
  getDashboardStats: () => api.get('/tasks/dashboard/stats'),
};

export default api;
