import React, { useState } from 'react';

function TaskList({ tasks, onToggleStatus, onEdit, onDelete }) {
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  
  const handleEditStart = (task) => {
    setEditingId(task.id);
    setEditText(task.text);
  };
  
  const handleEditSave = (id) => {
    if (editText.trim()) {
      onEdit(id, editText);
      setEditingId(null);
    }
  };
  
  const handleEditCancel = () => {
    setEditingId(null);
  };
  
  const handleKeyDown = (e, id) => {
    if (e.key === 'Enter') {
      handleEditSave(id);
    } else if (e.key === 'Escape') {
      handleEditCancel();
    }
  };
  
  if (!tasks || tasks.length === 0) {
    return <div className="empty-list">No tasks available. Add a task to get started!</div>;
  }
  
  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <li key={task.id} className={`task-item ${task.completed ? 'completed' : ''}`}>
          <div className="task-content">
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => onToggleStatus(task.id)}
              className="task-checkbox"
            />
            
            {editingId === task.id ? (
              <div className="task-edit-form">
                <input
                  type="text"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, task.id)}
                  autoFocus
                  className="task-edit-input"
                />
                <div className="task-edit-buttons">
                  <button onClick={() => handleEditSave(task.id)} className="save-btn">
                    Save
                  </button>
                  <button onClick={handleEditCancel} className="cancel-btn">
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="task-details">
                <span className="task-text">{task.text}</span>
                <div className="task-actions">
                  <button 
                    onClick={() => handleEditStart(task)} 
                    className="edit-btn"
                    disabled={task.completed}
                  >
                    Edit
                  </button>
                  <button onClick={() => onDelete(task.id)} className="delete-btn">
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}

export default TaskList;