import { useState, useEffect } from 'react';

function TaskForm({ initialData, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: false,
    image: null,
  });
  
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  
  // Update form data when editing an existing task
  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        description: initialData.description || '',
        status: initialData.status || false,
      });
      
      // Set image preview if available
      if (initialData.image_path) {
        setImagePreview(`${import.meta.env.VITE_API_BASE_URL.replace('/api', '')}/storage/${initialData.image_path}`);
      } else {
        setImagePreview(null);
      }
    } else {
      // Reset form when not editing
      setFormData({
        title: '',
        description: '',
        status: false,
        image: null
      });
      setImagePreview(null);
    }
    setErrors({});
  }, [initialData]);
  
  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    
    if (type === 'file') {
      if (files.length > 0) {
        const file = files[0];
        const reader = new FileReader();
        
        reader.onloadend = () => {
          setImagePreview(reader.result);
        };
        
        reader.readAsDataURL(file);
        
        setFormData(prev => ({
          ...prev,
          image: file
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
    
    // Clear error for this field if any
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };
  
  const validate = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!initialData && !formData.image && !imagePreview) {
      newErrors.image = 'Image is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    try {
      setLoading(true);
      const success = await onSubmit({
        ...formData,
        // Only include image if it's a File object
        image: formData.image instanceof File ? formData.image : null
      });
      
      if (success && !initialData) {
        // Reset form only for new task creation and if successful
        setFormData({
          title: '',
          description: '',
          status: false,
          image: null
        });
        setImagePreview(null);
      }
    } finally {
      setLoading(false);
    }
  };
  
  const handleRemoveImage = () => {
    setFormData(prev => ({
      ...prev,
      image: null
    }));
    setImagePreview(null);
  };
  
  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
          Title *
        </label>
        <input 
          className={`shadow appearance-none border ${errors.title ? 'border-red-500' : 'border-gray-300'} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
          id="title"
          name="title"
          type="text" 
          placeholder="Task title"
          value={formData.title}
          onChange={handleChange}
        />
        {errors.title && <p className="text-red-500 text-xs italic mt-1">{errors.title}</p>}
      </div>
      
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
          Description
        </label>
        <textarea 
          className="shadow appearance-none border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
          id="description"
          name="description"
          placeholder="Task description"
          rows="3"
          value={formData.description}
          onChange={handleChange}
        />
      </div>
      
      <div className="mb-4">
        <label className="flex items-center">
          <input 
            type="checkbox" 
            name="status"
            checked={formData.status}
            onChange={handleChange}
            className="mr-2"
          />
          <span className="text-gray-700 text-sm font-bold">Mark as completed</span>
        </label>
      </div>
      
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="image">
          Task Image {!initialData && '*'}
        </label>
        <input 
          className={`shadow appearance-none border ${errors.image ? 'border-red-500' : 'border-gray-300'} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
          id="image"
          name="image"
          type="file" 
          accept="image/*"
          onChange={handleChange}
        />
        {errors.image && <p className="text-red-500 text-xs italic mt-1">{errors.image}</p>}
        
        {imagePreview && (
          <div className="mt-2">
            <div className="relative inline-block">
              <img 
                src={imagePreview} 
                alt="Task preview" 
                className="h-32 w-auto object-cover rounded border border-gray-300"
              />
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                title="Remove image"
              >
                ×
              </button>
            </div>
          </div>
        )}
      </div>
      
      <div className="flex items-center">
        <button 
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2" 
          type="submit"
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="spinner inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
              {initialData ? 'Updating...' : 'Creating...'}
            </>
          ) : (
            initialData ? 'Update Task' : 'Create Task'
          )}
        </button>
        
        {onCancel && (
          <button 
            type="button"
            onClick={onCancel}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

export default TaskForm;