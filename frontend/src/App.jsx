import { useState, useEffect } from 'react';
import { TaskService } from './services/api';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';

function App() {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingTask, setEditingTask] = useState(null);
  const [filters, setFilters] = useState({
    status: undefined,
    sort: 'desc',
  });
  
  // Fetch tasks on component mount and when filters change
  useEffect(() => {
    fetchTasks();
  }, [filters]);
  
  const fetchTasks = async () => {
    try {
      setIsLoading(true);
      const response = await TaskService.getAllTasks(filters);
      setTasks(response.data.tasks);
      setError(null);
    } catch (err) {
      setError('Failed to fetch tasks. Please try again later.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCreateTask = async (taskData) => {
    try {
      setIsLoading(true);
      const response = await TaskService.createTask(taskData);
      setTasks([response.data.task, ...tasks]);
      setError(null);
      return true;
    } catch (err) {
      setError('Failed to create task. Please try again.');
      console.error(err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleUpdateTask = async (id, taskData) => {
    try {
      setIsLoading(true);
      const response = await TaskService.updateTask(id, taskData);
      setTasks(tasks.map(task => task.id === id ? response.data.task : task));
      setEditingTask(null);
      setError(null);
      return true;
    } catch (err) {
      setError('Failed to update task. Please try again.');
      console.error(err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleToggleStatus = async (id) => {
    try {
      const response = await TaskService.toggleTaskStatus(id);
      setTasks(tasks.map(task => task.id === id ? response.data.task : task));
      setError(null);
    } catch (err) {
      setError('Failed to update task status. Please try again.');
      console.error(err);
    }
  };
  
  const handleDeleteTask = async (id) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    
    try {
      setIsLoading(true);
      await TaskService.deleteTask(id);
      setTasks(tasks.filter(task => task.id !== id));
      setError(null);
    } catch (err) {
      setError('Failed to delete task. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  const startEditingTask = (task) => {
    setEditingTask(task);
  };
  
  const cancelEditing = () => {
    setEditingTask(null);
  };
  
  const handleFilterChange = (name, value) => {
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <h1 className="text-3xl font-bold mb-8 text-center">Task Management System</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">
          {editingTask ? 'Edit Task' : 'Create New Task'}
        </h2>
        <TaskForm 
          initialData={editingTask}
          onSubmit={editingTask 
            ? (data) => handleUpdateTask(editingTask.id, data) 
            : handleCreateTask
          }
          onCancel={editingTask ? cancelEditing : undefined}
        />
      </div>
      
      <div>
        <h2 className="text-xl font-semibold mb-4">Your Tasks</h2>
        
        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="w-full md:w-1/2">
            <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-1">
              Status Filter
            </label>
            <select
              id="status-filter"
              value={filters.status === undefined ? '' : filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value === '' ? undefined : e.target.value === 'true')}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">All Tasks</option>
              <option value="true">Completed</option>
              <option value="false">Pending</option>
            </select>
          </div>
          
          <div className="w-full md:w-1/2">
            <label htmlFor="sort-filter" className="block text-sm font-medium text-gray-700 mb-1">
              Sort By
            </label>
            <select
              id="sort-filter"
              value={filters.sort}
              onChange={(e) => handleFilterChange('sort', e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="desc">Newest First</option>
              <option value="asc">Oldest First</option>
            </select>
          </div>
        </div>
        
        {isLoading && !tasks.length ? (
          <p className="text-center py-4">Loading tasks...</p>
        ) : tasks.length === 0 ? (
          <p className="text-center py-4">No tasks found. Create your first task above!</p>
        ) : (
          <TaskList 
            tasks={tasks} 
            onToggleStatus={handleToggleStatus}
            onEdit={startEditingTask}
            onDelete={handleDeleteTask}
          />
        )}
      </div>
    </div>
  );
}

export default App;