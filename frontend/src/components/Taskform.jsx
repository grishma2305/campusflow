const API_URL = import.meta.env.VITE_API_URL;
import { useState } from 'react';

function TaskForm({ projectId, onTaskAdded }) {
    const [title, setTitle] = useState('');
    const [priority, setPriority] = useState('Medium');
    const [dueDate, setDueDate] = useState('');
    const [description, setDescription] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!title.trim()) return;

        fetch(`${API_URL}/api/tasks`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ project_id: projectId, title, status: 'To Do', priority, due_date: dueDate || null, description: description || null })
        })
            .then((res) => res.json())
            .then((newTask) => {
                onTaskAdded(newTask);
                setTitle('');
                setDescription('');
            })
            .catch((err) => console.error('Error adding task:', err));
    };

    return (
        <form onSubmit={handleSubmit} style={{ marginTop: '8px' }}>
            <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="New task title"
                style={{ padding: '4px', marginRight: '4px' }}
            />
            <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description (optional)"
                style={{ display: 'block', width: '100%', maxWidth: '300px', marginTop: '4px', marginBottom: '4px', padding: '4px', fontSize: '12px', fontFamily: 'inherit' }}
                rows={2}
            />
            <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                style={{ marginRight: '4px' }}
            >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
            </select>
            <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                style={{ marginRight: '4px' }}
            />
            <button type="submit">Add Task</button>
        </form>
    );
}

export default TaskForm;