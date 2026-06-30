import axios from 'axios';

// Get API base URL from env variables or fallback to localhost
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to inject JWT token automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Centralized Services
export const authService = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },
  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
  getUsers: async () => {
    const response = await api.get('/auth/users');
    return response.data;
  },
  deleteUser: async (id) => {
    const response = await api.delete(`/auth/users/${id}`);
    return response.data;
  },
};

export const studentService = {
  getAll: async () => {
    const response = await api.get('/students');
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get(`/students/${id}`);
    return response.data;
  },
  create: async (studentData) => {
    const response = await api.post('/students', studentData);
    return response.data;
  },
  update: async (id, studentData) => {
    const response = await api.put(`/students/${id}`, studentData);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/students/${id}`);
    return response.data;
  },
};

export const albumService = {
  getAll: async (params = {}) => {
    const response = await api.get('/albums', { params });
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get(`/albums/${id}`);
    return response.data;
  },
  create: async (albumData) => {
    const response = await api.post('/albums', albumData);
    return response.data;
  },
  update: async (id, albumData) => {
    const response = await api.put(`/albums/${id}`, albumData);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/albums/${id}`);
    return response.data;
  },
  approve: async (id) => {
    const response = await api.put(`/albums/${id}/approve`);
    return response.data;
  },
  reject: async (id, rejectionReason) => {
    const response = await api.put(`/albums/${id}/reject`, { rejectionReason });
    return response.data;
  },
  getStats: async () => {
    const response = await api.get('/albums/stats');
    return response.data;
  },
};

export const photoService = {
  upload: async (albumId, taggedStudents, files, onUploadProgress) => {
    const formData = new FormData();
    formData.append('albumId', albumId);
    
    // Convert array to a format the parser expects (comma-separated list)
    if (taggedStudents && taggedStudents.length > 0) {
      formData.append('taggedStudents', taggedStudents.join(','));
    }

    // Append multiple files
    for (let i = 0; i < files.length; i++) {
      formData.append('images', files[i]);
    }

    const response = await api.post('/photos/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress,
    });
    return response.data;
  },
  getAll: async (params = {}) => {
    const response = await api.get('/photos', { params });
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get(`/photos/${id}`);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/photos/${id}`);
    return response.data;
  },
};

export default api;
