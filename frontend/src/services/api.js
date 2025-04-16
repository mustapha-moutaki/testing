import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL; // Ensure this is set in your .env file

const getAllTasks = async () => {
    const response = await axios.get(`${API_URL}/tasks`);
    return response.data; // Adjust based on your API response structure
};

const createTask = async (task) => {
    const response = await axios.post(`${API_URL}/tasks`, task);
    return response.data;
};

const deleteTask = async (id) => {
    await axios.delete(`${API_URL}/tasks/${id}`);
};

const toggleTaskStatus = async (id) => {
    await axios.patch(`${API_URL}/tasks/${id}/toggle-status`);
};

export default {
    getAllTasks,
    createTask,
    deleteTask,
    toggleTaskStatus,
};
