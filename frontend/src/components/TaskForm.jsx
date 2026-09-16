const API_URL = import.meta.env.VITE_API_URL;
import { useState } from 'react';
import { Plus } from 'lucide-react';

function TaskForm({ projectId, onTaskAdded, token, users }) {
    const [title, setTitle] = useState('');
    const [priority, setPriority] = useState('Medium');
    const [dueDate, setDueDate] = useState('');
    const [description, setDescription] = useState('');
    const [assignedTo, setAssignedTo] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!title.trim()) {
            setError('Task title is required');
            return;
        }
        setError('');

        fetch(`${API_URL}/api/tasks`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ project_id: projectId, title, status: 'To Do', priority, due_date: dueDate || null, description: description || null, assigned_to: assignedTo || null })
        })
            .then((res) => {
                if (!res.ok) throw new Error('Failed to create task');
                return res.json();
            })
            .then((newTask) => {
                onTaskAdded(newTask);
                setTitle('');
                setDescription('');
                setPriority('Medium');
                setDueDate('');
                setAssignedTo('');
            })
            .catch((err) => {
                console.error('Error adding task:', err);
                setError('Failed to add task. Please try again.');
            });
    };

    return (
        <form onSubmit={handleSubmit} className="add-task-form">
            {error && <div className="form-error">{error}</div>}
            <div className="add-task-row">
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="New task title"
                    className="add-task-title"
                />
                <select value={priority} onChange={(e) => setPriority(e.target.value)}>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                </select>
                <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                />
                <select value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)}>
                    <option value="">Unassigned</option>
                    {users && users.map((u) => (
                        <option key={u.id} value={u.id}>{u.name}</option>
                    ))}
                </select>
                <button type="submit" className="btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                    <Plus size={14} /> Add
                </button>
            </div>
            <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description (optional)"
                className="add-task-desc"
                rows={2}
            />
        </form>
    );
}

export default TaskForm;