import TaskForm from './TaskForm';
import { useState, useEffect } from 'react';

function Dashboard() {

    const [projects, setProjects] = useState([]);
    const [tasks, setTasks] = useState([]);

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

    return (
        <div className="dashboard">
            <h2>Projects</h2>
            {projects.map((project) => (
                <div key={project.id} className="project-card">
                    <h3>{project.name}</h3>
                    <p>{project.description}</p>
                    <ul>
                        {tasks.filter((t) => t.project_id === project.id).map((t) => (
                            <li key={t.id}>{t.title} — {t.status}</li>
                        ))}
                    </ul>
                    <TaskForm projectId={project.id} onTaskAdded={(newTask) => setTasks([...tasks, newTask])} />
                    <p>Starts: {project.start_date?.slice(0, 10)} | Ends: {project.end_date?.slice(0, 10)}</p>
                </div>))
            }
        </div>);
}
export default Dashboard;