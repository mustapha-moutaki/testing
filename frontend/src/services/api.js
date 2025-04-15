import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Accept': 'application/json',
  }
});

// Add a request interceptor to handle errors globally
API.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

// Task API services
export const TaskService = {
  getAllTasks: (filters = {}) => {
    let queryParams = new URLSearchParams();
    
    if (filters.status !== undefined) {
      queryParams.append('status', filters.status);
    }
    
    if (filters.sort) {
      queryParams.append('sort', filters.sort);
    }
    
    return API.get(`/tasks?${queryParams.toString()}`);
  },
  
  getTask: (id) => API.get(`/tasks/${id}`),
  
  createTask: (taskData) => {
    const formData = new FormData();
    
    Object.keys(taskData).forEach(key => {
      if (key === 'image' && taskData[key]) {
        formData.append('image', taskData[key]);
      } else if (key !== 'image') {
        formData.append(key, taskData[key]);
      }
    });
    
    return API.post('/tasks', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },
  
  updateTask: (id, taskData) => {
    const formData = new FormData();
    
    if (taskData.id) {
      delete taskData.id;
    }
    
    Object.keys(taskData).forEach(key => {
      if (key === 'image' && taskData[key] && typeof taskData[key] !== 'string') {
        formData.append('image', taskData[key]);
      } else if (key !== 'image') {
        formData.append(key, taskData[key]);
      }
    });
    
    return API.post(`/tasks/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },
  
  toggleTaskStatus: (id) => API.patch(`/tasks/${id}/toggle-status`),
  
  deleteTask: (id) => API.delete(`/tasks/${id}`)
};

export default API;