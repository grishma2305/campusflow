const API_URL = import.meta.env.VITE_API_URL;
import { useState } from 'react';
import { Loader2 } from 'lucide-react';

function AuthForm({ onAuthSuccess }) {
    const [isSignup, setIsSignup] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        if (!email.trim() || !password) {
            setError('Email and password are required');
            return;
        }
        if (isSignup && !name.trim()) {
            setError('Name is required');
            return;
        }

        setLoading(true);
        const endpoint = isSignup ? '/api/auth/signup' : '/api/auth/login';
        const body = isSignup ? { name, email, password } : { email, password };

        fetch(`${API_URL}${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        })
            .then((res) => res.json().then((data) => ({ ok: res.ok, data })))
            .then(({ ok, data }) => {
                setLoading(false);
                if (!ok) {
                    setError(data.error || 'Something went wrong');
                    return;
                }
                onAuthSuccess(data.token, data.user);
            })
            .catch(() => {
                setLoading(false);
                setError('Could not reach the server. Please try again.');
            });
    };

    return (
        <div className="auth-card">
            <h2 className="auth-card-title">{isSignup ? 'Create your account' : 'Welcome back'}</h2>
            <p className="auth-card-subtitle">
                {isSignup ? 'Start organizing your team\u2019s work in minutes.' : 'Log in to see your projects.'}
            </p>
            {error && <div className="form-error">{error}</div>}
            <form onSubmit={handleSubmit} className="auth-form">
                {isSignup && (
                    <div className="field">
                        <label>Full name</label>
                        <input
                            type="text"
                            placeholder="Jane Doe"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                )}
                <div className="field">
                    <label>Email</label>
                    <input
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className="field">
                    <label>Password</label>
                    <input
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <button type="submit" className="btn-primary btn-block" disabled={loading}>
                    {loading ? <Loader2 size={16} className="spin" /> : isSignup ? 'Create account' : 'Log in'}
                </button>
            </form>
            <p className="auth-switch">
                {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
                <button
                    type="button"
                    className="link-btn"
                    onClick={() => { setIsSignup(!isSignup); setError(''); }}
                >
                    {isSignup ? 'Log in' : 'Sign up'}
                </button>
            </p>
        </div>
    );
}

export default AuthForm;