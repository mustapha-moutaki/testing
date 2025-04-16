import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import TaskList from './services/components/TaskList';
import TaskForm from './services/components/TaskForm';

function App() {
    return (
        <Router>
            <div className="container">
                <Routes>
                    <Route path="/" element={<TaskList />} />
                    <Route path="/create" element={<TaskForm />} />
                    <Route path="/edit/:id" element={<TaskForm />} /> {/* Modify to handle editing */}
                </Routes>
            </div>
        </Router>
    );
}

export default App;
