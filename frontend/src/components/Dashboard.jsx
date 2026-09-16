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
import { GripVertical, Trash2, Circle } from 'lucide-react';

const columnColors = {
    'To Do': '#94a3b8',
    'In Progress': '#3b82f6',
    'Blocked': '#ef4444',
    'Done': '#10b981',
};

function initialsOf(name) {
    if (!name) return '?';
    return name.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase();
}

function PriorityBadge({ priority }) {
    const cls = priority === 'High' ? 'badge-high' : priority === 'Low' ? 'badge-low' : 'badge-medium';
    return <span className={`badge ${cls}`}>{priority}</span>;
}

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
        <div {...listeners} {...attributes} className="drag-handle" title="Drag to move">
            <GripVertical size={14} />
        </div>
    );
}

function DroppableColumn({ id, children }) {
    const { setNodeRef, isOver } = useDroppable({ id });
    return (
        <div ref={setNodeRef} className={`column${isOver ? ' column-over' : ''}`}>
            {children}
        </div>
    );
}

function Dashboard({ token }) {

    const [projects, setProjects] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [users, setUsers] = useState([]);
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

        fetch(`${API_URL}/api/users`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => res.json())
            .then((data) => setUsers(data))
            .catch((err) => console.error('Error fetching users:', err));
    }, [token]);

    const findUser = (id) => users.find((u) => u.id === id || u.id === Number(id));

    const handleStatusChange = (taskId, newStatus) => {
        fetch(`${API_URL}/api/tasks/${taskId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
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
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
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
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
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
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ description: newDescription || null })
        })
            .then((res) => res.json())
            .then(() => {
                setTasks(tasks.map((t) => (t.id === taskId ? { ...t, description: newDescription } : t)));
            })
            .catch((err) => console.error('Error updating description:', err));
    };

    const handleAssigneeChange = (taskId, newAssigneeId) => {
        fetch(`${API_URL}/api/tasks/${taskId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ assigned_to: newAssigneeId || null })
        })
            .then((res) => res.json())
            .then(() => {
                setTasks(tasks.map((t) => (t.id === taskId ? { ...t, assigned_to: newAssigneeId ? Number(newAssigneeId) : null } : t)));
            })
            .catch((err) => console.error('Error updating assignee:', err));
    };

    const handleDeleteTask = (taskId) => {
        fetch(`${API_URL}/api/tasks/${taskId}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token}`,
            },
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
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token}`,
            },
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
            <h2 className="page-title">Projects</h2>
            <ProjectForm onProjectAdded={handleProjectAdded} token={token} />
            <div className="toolbar">
                <div className="toolbar-field">
                    <label>Priority</label>
                    <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}>
                        <option value="All">All</option>
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                    </select>
                </div>
                <div className="toolbar-field toolbar-search">
                    <label>Search</label>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search tasks by title or description..."
                    />
                </div>
            </div>
            {projects.map((project) => (
                <div key={project.id} className="project-card">
                    <div className="project-card-header">
                        <div>
                            <h3>{project.name}</h3>
                            {project.description && <p className="project-desc">{project.description}</p>}
                        </div>
                        <button className="btn-danger-text" onClick={() => handleDeleteProject(project.id)}>
                            <Trash2 size={13} style={{ verticalAlign: '-2px', marginRight: '4px' }} />
                            Delete Project
                        </button>
                    </div>
                    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                        <div className="board">
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
                                        <div className="column-header">
                                            <span className="column-dot" style={{ background: columnColors[status] }} />
                                            <span className="column-title">{status}</span>
                                            <span className="column-count">{columnTasks.length}</span>
                                        </div>
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
                                                const assignee = findUser(t.assigned_to);
                                                return (
                                                    <DraggableTask key={t.id} id={t.id}>
                                                        <div className={`task-card${isOverdue ? ' task-overdue' : ''}`}>
                                                            <div className="task-top">
                                                                <DragHandle id={t.id} />
                                                                <PriorityBadge priority={t.priority || 'Medium'} />
                                                            </div>
                                                            <div className="task-title">{t.title}</div>
                                                            <textarea
                                                                value={t.description || ''}
                                                                onChange={(e) => handleDescriptionChange(t.id, e.target.value)}
                                                                placeholder="Add description..."
                                                                className="task-desc-input"
                                                                rows={2}
                                                            />
                                                            <div className="task-row">
                                                                <select
                                                                    value={t.priority || 'Medium'}
                                                                    onChange={(e) => handlePriorityChange(t.id, e.target.value)}
                                                                    className="task-priority-select"
                                                                >
                                                                    <option value="Low">Low</option>
                                                                    <option value="Medium">Medium</option>
                                                                    <option value="High">High</option>
                                                                </select>
                                                                <input
                                                                    type="date"
                                                                    value={t.due_date ? t.due_date.split('T')[0] : ''}
                                                                    onChange={(e) => handleDueDateChange(t.id, e.target.value)}
                                                                    className={`task-date${isOverdue ? ' task-date-overdue' : ''}`}
                                                                />
                                                            </div>
                                                            <div className="task-row">
                                                                <div className="assignee-pill">
                                                                    <div className="assignee-avatar">
                                                                        {assignee ? initialsOf(assignee.name) : <Circle size={10} />}
                                                                    </div>
                                                                    <select
                                                                        value={t.assigned_to || ''}
                                                                        onChange={(e) => handleAssigneeChange(t.id, e.target.value)}
                                                                    >
                                                                        <option value="">Unassigned</option>
                                                                        {users.map((u) => (
                                                                            <option key={u.id} value={u.id}>{u.name}</option>
                                                                        ))}
                                                                    </select>
                                                                </div>
                                                            </div>
                                                            <div className="task-footer">
                                                                <select
                                                                    value={t.status}
                                                                    onChange={(e) => handleStatusChange(t.id, e.target.value)}
                                                                    className="task-status-select"
                                                                >
                                                                    {statuses.map((s) => (
                                                                        <option key={s} value={s}>{s}</option>
                                                                    ))}
                                                                </select>
                                                                <button className="btn-icon" onClick={() => handleDeleteTask(t.id)} title="Delete task">
                                                                    <Trash2 size={14} />
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
                    <TaskForm projectId={project.id} onTaskAdded={(newTask) => setTasks([...tasks, newTask])} token={token} users={users} />
                    <p className="project-dates">Starts: {project.start_date?.slice(0, 10) || '—'} · Ends: {project.end_date?.slice(0, 10) || '—'}</p>
                </div>
            ))}
        </div>
    );
}
export default Dashboard;