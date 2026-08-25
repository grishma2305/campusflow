const projects = [
    {
        id: 1, name: 'Startup Networking Night', progress: 75, totalTasks: 24, overdue: 2, blocked: 1
    },
    {
        id: 2, name: 'Fall Recruitment Drive', progress: 40, totalTasks: 18, overdue: 4, blocked: 0
    }
];

function Dashboard() {
    return (
        <div className="dashboard">
            <h2>Projects</h2>
            {projects.map((project) => (
                <div key={project.id} className="project-card">
                    <h3>{project.name}</h3>
                    <div style={
                        { background: '#eee', borderRadius: '4px', height: '8px', width: '100%' }}>
                        <div style={
                            { background: '#4caf50', height: '8px', borderRadius: '4px', width: `${project.progress}%` }}>

                        </div>
                    </div>
                    <p>{project.progress}% Complete</p>
                    <p>{project.totalTasks} Tasks | {project.overdue} Overdue | {project.blocked} Blocked</p>
                </div>))
            }
        </div>);
}
export default Dashboard;