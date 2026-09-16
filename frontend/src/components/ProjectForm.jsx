const API_URL = import.meta.env.VITE_API_URL;
import { useState } from 'react';
import { Plus } from 'lucide-react';

function ProjectForm({ onProjectAdded, token }) {
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
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
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
        <form onSubmit={handleSubmit} className="new-project-card">
            <div className="new-project-header">
                <h3>New Project</h3>
            </div>
            {error && <div className="form-error">{error}</div>}
            <input
                type="text"
                placeholder="Project name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="project-name-input"
                style={{ width: '100%', marginBottom: '10px' }}
            />
            <textarea
                placeholder="Description (optional)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
            />
            <div className="new-project-grid" style={{ marginTop: '10px' }}>
                <div />
                <div>
                    <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-text-muted)', display: 'block', marginBottom: '4px' }}>Start date</label>
                    <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} style={{ width: '100%' }} />
                </div>
                <div>
                    <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-text-muted)', display: 'block', marginBottom: '4px' }}>End date</label>
                    <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} style={{ width: '100%' }} />
                </div>
            </div>
            <button type="submit" className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginTop: '6px' }}>
                <Plus size={15} /> Add Project
            </button>
        </form>
    );
}

export default ProjectForm;