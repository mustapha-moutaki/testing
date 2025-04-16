import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

const CreateTask = ({ taskToEdit }) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: taskToEdit ? taskToEdit.title : '',
        description: taskToEdit ? taskToEdit.description : '',
        due_date: taskToEdit ? taskToEdit.due_date : '',
        priority: taskToEdit ? taskToEdit.priority : 'medium',
        completed: taskToEdit ? taskToEdit.completed : false,
    });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (taskToEdit) {
                // Update existing task logic here (if needed)
                // For example: await API.updateTask(taskToEdit.id, formData);
            } else {
                await API.createTask(formData);
            }
            navigate('/');
        } catch (err) {
            console.error('Error creating task:', err);
            setError('Failed to create task. Please check your inputs and try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-4">
            <h2>{taskToEdit ? 'Edit Task' : 'Create New Task'}</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleSubmit}>
                {/* Form fields for title, description, due date, priority, and completed status */}
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
                {/* Additional form fields... */}
                <div className="mb-3">
                    <button type="submit" className="btn btn-primary me-2" disabled={loading}>
                        {loading ? 'Creating...' : 'Create Task'}
                    </button>
                    <button type="button" className="btn btn-secondary" onClick={() => navigate('/')}>
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateTask;
