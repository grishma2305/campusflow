import { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import AuthForm from './components/AuthForm';
import { LayoutGrid, LogOut } from 'lucide-react';
import './App.css';

function App() {
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [user, setUser] = useState(() => {
        const stored = localStorage.getItem('user');
        return stored ? JSON.parse(stored) : null;
    });

    const handleAuthSuccess = (newToken, newUser) => {
        localStorage.setItem('token', newToken);
        localStorage.setItem('user', JSON.stringify(newUser));
        setToken(newToken);
        setUser(newUser);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
    };

    const initials = user?.name
        ? user.name.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase()
        : '?';

    if (!token) {
        return (
            <div className="auth-page">
                <div className="brand">
                    <LayoutGrid size={22} color="#4f46e5" strokeWidth={2.5} />
                    CampusFlow
                </div>
                <AuthForm onAuthSuccess={handleAuthSuccess} />
            </div>
        );
    }

    return (
        <div>
            <header className="app-header">
                <h1>
                    <span className="logo-dot" />
                    CampusFlow
                </h1>
                <div className="user-menu">
                    <div className="avatar">{initials}</div>
                    Signed in as <strong>{user?.name}</strong>
                    <button className="btn-icon" onClick={handleLogout} title="Log out">
                        <LogOut size={16} />
                    </button>
                </div>
            </header>
            <Dashboard token={token} />
        </div>
    );
}

export default App;