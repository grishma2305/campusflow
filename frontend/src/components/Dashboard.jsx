const API_URL = import.meta.env.VITE_API_URL;
import TaskForm from './TaskForm';
import ProjectForm from './ProjectForm';
import { useState, useEffect } from 'react';
import {
    DndContext,
    useDraggable,
    useDroppable,
    closestCenter,
} from '@dnd-kit/core';

function DraggableTask({ id, children }) {
    const { setNodeRef, transform, isDragging } = useDraggable({ id });
    const style = {
        transform: transform ? `translate(${transform.x}px, ${transform.y}px)` : undefined,
        opacity: isDragging ? 0.4 : 1,
        zIndex: isDragging ? 999 : 'auto',
        position: isDragging ? 'relative' : 'static',
    };
    return (
        <div ref={setNodeRef} style={style}>
            {children}
        </div>
    );
}

function DragHandle({ id }) {
    const { attributes, listeners } = useDraggable({ id });
    return (
        <div
            {...listeners}
            {...attributes}
            style={{
                cursor: 'grab',
                fontSize: '12px',
                color: '#999',
                marginBottom: '2px',
                userSelect: 'none',
            }}
            title="Drag to move"
        >
            ⠿
        </div>
    );
}

function DroppableColumn({ id, children }) {
    const { setNodeRef, isOver } = useDroppable({ id });
    return (
        <div
            ref={setNodeRef}
            style={{
                flex: 1,
                background: isOver ? '#eef6ff' : '#f9f9f9',
                borderRadius: '6px',
                padding: '8px',
                minHeight: '80px',
                transition: 'background 0.15s',
            }}
        >
            {children}
        </div>
    );
}

function Dashboard() {

    const [projects, setProjects] = useState([]);
    const [tasks, setTasks] = useState([]);
    const statuses = ['To Do', 'In Progress', 'Blocked', 'Done'];
    const [priorityFilter, setPriorityFilter] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetch(`${API_URL}/api/projects`)
            .then((res) => res.json())
            .then((data) => setProjects(data))
            .catch((err) => console.error('Error fetching projects:', err));

        fetch(`${API_URL}/api/tasks`)
            .then((res) => res.json())
            .then((data) => setTasks(data))
            .catch((err) => console.error('Error fetching tasks:', err));
    }, []);

    const handleStatusChange = (taskId, newStatus) => {
        fetch(`${API_URL}/api/tasks/${taskId}`, {
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

    const handleProjectAdded = (newProject) => {
        setProjects([...projects, newProject]);
    };

    const handleDragEnd = (event) => {
        const { active, over } = event;
        if (!over) return;
        const taskId = active.id;
        const newStatus = over.id;
        const task = tasks.find((t) => t.id === taskId);
        if (task && task.status !== newStatus) {
            handleStatusChange(taskId, newStatus);
        }
    };

    const handlePriorityChange = (taskId, newPriority) => {
        fetch(`${API_URL}/api/tasks/${taskId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ priority: newPriority })
        })
            .then((res) => res.json())
            .then(() => {
                setTasks(tasks.map((t) => (t.id === taskId ? { ...t, priority: newPriority } : t)));
            })
            .catch((err) => console.error('Error updating priority:', err));
    };

    const handleDueDateChange = (taskId, newDueDate) => {
        fetch(`${API_URL}/api/tasks/${taskId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ due_date: newDueDate || null })
        })
            .then((res) => res.json())
            .then(() => {
                setTasks(tasks.map((t) => (t.id === taskId ? { ...t, due_date: newDueDate } : t)));
            })
            .catch((err) => console.error('Error updating due date:', err));
    };

    const handleDescriptionChange = (taskId, newDescription) => {
        fetch(`${API_URL}/api/tasks/${taskId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ description: newDescription || null })
        })
            .then((res) => res.json())
            .then(() => {
                setTasks(tasks.map((t) => (t.id === taskId ? { ...t, description: newDescription } : t)));
            })
            .catch((err) => console.error('Error updating description:', err));
    };

    const handleDeleteTask = (taskId) => {
        fetch(`${API_URL}/api/tasks/${taskId}`, {
            method: 'DELETE'
        })
            .then((res) => res.json())
            .then(() => {
                setTasks(tasks.filter((t) => t.id !== taskId));
            })
            .catch((err) => console.error('Error deleting task:', err));
    };

    const handleDeleteProject = (projectId) => {
        if (!window.confirm('Delete this project and all its tasks? This cannot be undone.')) {
            return;
        }
        fetch(`${API_URL}/api/projects/${projectId}`, {
            method: 'DELETE'
        })
            .then((res) => res.json())
            .then(() => {
                setProjects(projects.filter((p) => p.id !== projectId));
                setTasks(tasks.filter((t) => t.project_id !== projectId));
            })
            .catch((err) => console.error('Error deleting project:', err));
    };

    return (
        <div className="dashboard">
            <h2>Projects</h2>
            <ProjectForm onProjectAdded={handleProjectAdded} />
            <div style={{ marginBottom: '12px', display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
                <div>
                    <label style={{ marginRight: '6px', fontSize: '13px' }}>Filter by priority:</label>
                    <select
                        value={priorityFilter}
                        onChange={(e) => setPriorityFilter(e.target.value)}
                        style={{ fontSize: '13px' }}
                    >
                        <option value="All">All</option>
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                    </select>
                </div>
                <div>
                    <label style={{ marginRight: '6px', fontSize: '13px' }}>Search:</label>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search tasks..."
                        style={{ fontSize: '13px', padding: '3px 6px' }}
                    />
                </div>
            </div>
            {projects.map((project) => (
                <div key={project.id} className="project-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3 style={{ margin: 0 }}>{project.name}</h3>
                        <button
                            onClick={() => handleDeleteProject(project.id)}
                            style={{ fontSize: '12px', color: '#e53935' }}
                        >
                            Delete Project
                        </button>
                    </div>
                    <p>{project.description}</p>
                    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                        <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                            {statuses.map((status) => {
                                const columnTasks = tasks.filter((t) => {
                                    const query = searchQuery.trim().toLowerCase();
                                    const matchesSearch = query === '' ||
                                        t.title.toLowerCase().includes(query) ||
                                        (t.description || '').toLowerCase().includes(query);
                                    return t.project_id === project.id && t.status === status &&
                                        (priorityFilter === 'All' || t.priority === priorityFilter) &&
                                        matchesSearch;
                                });
                                return (
                                    <DroppableColumn key={status} id={status}>
                                        <h4 style={{ margin: '0 0 8px 0', fontSize: '14px' }}>{status} ({columnTasks.length})</h4>
                                        {columnTasks
                                            .sort((a, b) => {
                                                const order = { High: 1, Medium: 2, Low: 3 };
                                                const priorityDiff = (order[a.priority] || 2) - (order[b.priority] || 2);
                                                if (priorityDiff !== 0) return priorityDiff;

                                                if (!a.due_date && !b.due_date) return 0;
                                                if (!a.due_date) return 1;
                                                if (!b.due_date) return -1;
                                                return new Date(a.due_date) - new Date(b.due_date);
                                            })
                                            .map((t) => {
                                                const isOverdue = t.due_date && new Date(t.due_date) < new Date() && t.status !== 'Done';
                                                return (
                                                    <DraggableTask key={t.id} id={t.id}>
                                                        <div
                                                            style={{
                                                                background: 'white',
                                                                border: isOverdue ? '1px solid #e53935' : '1px solid #ddd',
                                                                borderRadius: '4px',
                                                                padding: '6px',
                                                                marginBottom: '6px',
                                                                fontSize: '13px'
                                                            }}
                                                        >
                                                            <DragHandle id={t.id} />
                                                            {t.title}
                                                            <textarea
                                                                value={t.description || ''}
                                                                onChange={(e) => handleDescriptionChange(t.id, e.target.value)}
                                                                placeholder="Add description..."
                                                                style={{ display: 'block', width: '100%', maxWidth: '160px', marginTop: '4px', padding: '3px', fontSize: '11px', fontFamily: 'inherit', border: '1px solid #eee', borderRadius: '3px', resize: 'vertical' }}
                                                                rows={2}
                                                            />
                                                            <div style={{ fontSize: '11px', marginTop: '4px', display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
                                                                <select
                                                                    value={t.priority || 'Medium'}
                                                                    onChange={(e) => handlePriorityChange(t.id, e.target.value)}
                                                                    style={{ fontSize: '11px' }}
                                                                >
                                                                    <option value="Low">Low</option>
                                                                    <option value="Medium">Medium</option>
                                                                    <option value="High">High</option>
                                                                </select>
                                                                <input
                                                                    type="date"
                                                                    value={t.due_date ? t.due_date.split('T')[0] : ''}
                                                                    onChange={(e) => handleDueDateChange(t.id, e.target.value)}
                                                                    style={{ fontSize: '11px', color: isOverdue ? '#e53935' : 'inherit', fontWeight: isOverdue ? 'bold' : 'normal' }}
                                                                />
                                                            </div>
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
                                                    </DraggableTask>
                                                );
                                            })}
                                    </DroppableColumn>
                                );
                            })}
                        </div>
                    </DndContext>
                    <TaskForm projectId={project.id} onTaskAdded={(newTask) => setTasks([...tasks, newTask])} />
                    <p>Starts: {project.start_date?.slice(0, 10)} | Ends: {project.end_date?.slice(0, 10)}</p>
                </div>
            ))}
        </div>
    );
}
export default Dashboard;