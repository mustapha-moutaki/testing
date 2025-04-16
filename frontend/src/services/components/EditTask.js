// src/components/EditTask.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import taskService from '../services/taskService';

const EditTask = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    due_date: '',
    priority: 'medium',
    completed: false
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        setFetchLoading(true);
        const task = await taskService.getTaskById(id);
        // Format the date for the date input (YYYY-MM-DD)
        const formattedDate = task.due_date ? new Date(task.due_date).toISOString().split('T')[0] : '';
        
        setFormData({
          title: task.title || '',
          description: task.description || '',
          due_date: formattedDate,
          priority: task.priority || 'medium',
          completed: task.completed || false
        });
      } catch (err) {
        console.error('Error fetching task:', err);
        setError('Failed to fetch task details. Please try again.');
      } finally {
        setFetchLoading(false);
      }
    };

    fetchTask();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await taskService.updateTask(id, formData);
      navigate('/');
    } catch (err) {
      console.error('Error updating task:', err);
      setError('Failed to update task. Please check your inputs and try again.');
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) return <div className="text-center mt-5">Loading task details...</div>;

  return (
    <div className="container mt-4">
      <h2>Edit Task</h2>
      
      {error && <div className="alert alert-danger">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="title" className="form-label">Title</label>
          <input
            type="text"
            className="form-control"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="mb-3">
          <label htmlFor="description" className="form-label">Description</label>
          <textarea
            className="form-control"
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="3"
          ></textarea>
        </div>
        
        <div className="mb-3">
          <label htmlFor="due_date" className="form-label">Due Date</label>
          <input
            type="date"
            className="form-control"
            id="due_date"
            name="due_date"
            value={formData.due_date}
            onChange={handleChange}
          />
        </div>
        
        <div className="mb-3">
          <label htmlFor="priority" className="form-label">Priority</label>
          <select
            className="form-select"
            id="priority"
            name="priority"
            value={formData.priority}
            onChange={handleChange}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
        
        <div className="mb-3 form-check">
          <input
            type="checkbox"
            className="form-check-input"
            id="completed"
            name="completed"
            checked={formData.completed}
            onChange={handleChange}
          />
          <label className="form-check-label" htmlFor="completed">Mark as completed</label>
        </div>
        
        <div className="mb-3">
          <button type="submit" className="btn btn-primary me-2" disabled={loading}>
            {loading ? 'Updating...' : 'Update Task'}
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate('/')}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditTask;