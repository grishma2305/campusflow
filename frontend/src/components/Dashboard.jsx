import TaskForm from './TaskForm';
import { useState, useEffect } from 'react';

function Dashboard() {

    const [projects, setProjects] = useState([]);
    const [tasks, setTasks] = useState([]);
    const statuses = ['To Do', 'In Progress', 'Blocked', 'Done'];

    useEffect(() => {
        fetch('http://localhost:5000/api/projects')
            .then((res) => res.json())
            .then((data) => setProjects(data))
            .catch((err) => console.error('Error fetching projects:', err));

        fetch('http://localhost:5000/api/tasks')
            .then((res) => res.json())
            .then((data) => setTasks(data))
            .catch((err) => console.error('Error fetching tasks:', err));
    }, []);

    const handleStatusChange = (taskId, newStatus) => {
        fetch(`http://localhost:5000/api/tasks/${taskId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: newStatus })
        })
            .then((res) => res.json())
            .then(() => {
                setTasks(tasks.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t)));
            })
            .catch((err) => console.error('Error updating task:', err));
    };

    const handleDeleteTask = (taskId) => {
        fetch(`http://localhost:5000/api/tasks/${taskId}`, {
            method: 'DELETE'
        })
            .then((res) => res.json())
            .then(() => {
                setTasks(tasks.filter((t) => t.id !== taskId));
            })
            .catch((err) => console.error('Error deleting task:', err));
    };

    return (
        <div className="dashboard">
            <h2>Projects</h2>
            {projects.map((project) => (
                <div key={project.id} className="project-card">
                    <h3>{project.name}</h3>
                    <p>{project.description}</p>
                    <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                        {statuses.map((status) => (
                            <div
                                key={status}
                                style={{
                                    flex: 1,
                                    background: '#f9f9f9',
                                    borderRadius: '6px',
                                    padding: '8px',
                                    minHeight: '80px'
                                }}
                            >
                                <h4 style={{ margin: '0 0 8px 0', fontSize: '14px' }}>{status}</h4>
                                {tasks
                                    .filter((t) => t.project_id === project.id && t.status === status)
                                    .map((t) => (
                                        <div
                                            key={t.id}
                                            style={{
                                                background: 'white',
                                                border: '1px solid #ddd',
                                                borderRadius: '4px',
                                                padding: '6px',
                                                marginBottom: '6px',
                                                fontSize: '13px'
                                            }}
                                        >
                                            {t.title}
                                            <div style={{ marginTop: '4px' }}>
                                                <select
                                                    value={t.status}
                                                    onChange={(e) => handleStatusChange(t.id, e.target.value)}
                                                    style={{ fontSize: '12px' }}
                                                >
                                                    {statuses.map((s) => (
                                                        <option key={s} value={s}>{s}</option>
                                                    ))}
                                                </select>
                                                <button
                                                    onClick={() => handleDeleteTask(t.id)}
                                                    style={{ marginLeft: '4px', fontSize: '12px' }}
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        ))}
                    </div>
                    <TaskForm projectId={project.id} onTaskAdded={(newTask) => setTasks([...tasks, newTask])} />
                    <p>Starts: {project.start_date?.slice(0, 10)} | Ends: {project.end_date?.slice(0, 10)}</p>
                </div>))
            }
        </div>);
}
export default Dashboard;