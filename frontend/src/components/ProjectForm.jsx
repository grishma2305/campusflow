const API_URL = import.meta.env.VITE_API_URL;
import { useState } from 'react';

function ProjectForm({ onProjectAdded }) {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name.trim()) {
            setError('Project name is required');
            return;
        }
        setError('');
        fetch(`${API_URL}/api/projects`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name,
                description: description || null,
                start_date: startDate || null,
                end_date: endDate || null,
            }),
        })
            .then((res) => {
                if (!res.ok) throw new Error('Failed to create project');
                return res.json();
            })
            .then((newProject) => {
                onProjectAdded(newProject);
                setName('');
                setDescription('');
                setStartDate('');
                setEndDate('');
            })
            .catch((err) => {
                console.error('Error creating project:', err);
                setError('Failed to create project. Please try again.');
            });
    };

    return (
        <form onSubmit={handleSubmit} style={{ marginBottom: '20px', padding: '12px', border: '1px solid #ddd', borderRadius: '6px' }}>
            <h3 style={{ marginTop: 0 }}>New Project</h3>
            {error && <p style={{ color: '#e53935', fontSize: '13px' }}>{error}</p>}
            <input
                type="text"
                placeholder="Project name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{ display: 'block', width: '100%', maxWidth: '300px', marginBottom: '6px', padding: '4px' }}
            />
            <textarea
                placeholder="Description (optional)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                style={{ display: 'block', width: '100%', maxWidth: '300px', marginBottom: '6px', padding: '4px' }}
                rows={2}
            />
            <div style={{ marginBottom: '6px' }}>
                <label style={{ fontSize: '12px', marginRight: '4px' }}>Start:</label>
                <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    style={{ marginRight: '12px' }}
                />
                <label style={{ fontSize: '12px', marginRight: '4px' }}>End:</label>
                <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                />
            </div>
            <button type="submit">Add Project</button>
        </form>
    );
}

export default ProjectForm;