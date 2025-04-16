import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { Link } from 'react-router-dom';

const TaskList = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            setLoading(true);
            const data = await API.getAllTasks();
            setTasks(data);
            setError(null);
        } catch (err) {
            setError('Failed to fetch tasks. Please try again later.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this task?')) {
            try {
                await API.deleteTask(id);
                // Remove the deleted task from state
                setTasks(tasks.filter(task => task.id !== id));
            } catch (err) {
                setError('Failed to delete task. Please try again.');
                console.error(err);
            }
        }
    };

    const handleToggleStatus = async (id) => {
        try {
            await API.toggleTaskStatus(id);
            // Update the task status in the local state
            setTasks(tasks.map(task => {
                if (task.id === id) {
                    return { ...task, completed: !task.completed };
                }
                return task;
            }));
        } catch (err) {
            setError('Failed to update task status. Please try again.');
            console.error(err);
        }
    };

    if (loading) return <div className="text-center mt-5">Loading tasks...</div>;
    if (error) return <div className="alert alert-danger">{error}</div>;

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Task List</h2>
                <Link to="/create" className="btn btn-primary">Add New Task</Link>
            </div>
            {tasks.length === 0 ? (
                <div className="alert alert-info">No tasks found. Create a new task!</div>
            ) : (
                <div className="list-group">
                    {tasks.map(task => (
                        <div key={task.id} className="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
                            <div className="d-flex align-items-center">
                                <input
                                    type="checkbox"
                                    checked={task.completed}
                                    onChange={() => handleToggleStatus(task.id)}
                                    className="me-3"
                                />
                                <div>
                                    <h5 className={task.completed ? 'text-decoration-line-through' : ''}>
                                        {task.title}
                                    </h5>
                                    <p className="mb-1">{task.description}</p>
                                    <small>Due: {new Date(task.due_date).toLocaleDateString()}</small>
                                </div>
                            </div>
                            <div>
                                <Link to={`/edit/${task.id}`} className="btn btn-sm btn-outline-primary me-2">
                                    Edit
                                </Link>
                                <button onClick={() => handleDelete(task.id)} className="btn btn-sm btn-outline-danger">
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TaskList;
