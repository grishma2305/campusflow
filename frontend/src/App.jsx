import { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import AuthForm from './components/AuthForm';
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

  if (!token) {
    return (
      <div className="app">
        <h1>CampusFlow</h1>
        <AuthForm onAuthSuccess={handleAuthSuccess} />
      </div>
    );
  }

  return (
    <div className="app">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>CampusFlow</h1>
        <div style={{ fontSize: '13px' }}>
          Signed in as {user?.name}{' '}
          <button onClick={handleLogout} style={{ marginLeft: '8px' }}>
            Log out
          </button>
        </div>
      </div>
      <Dashboard token={token} />
    </div>
  );
}

export default App;