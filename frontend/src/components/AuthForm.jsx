const API_URL = import.meta.env.VITE_API_URL;
import { useState } from 'react';

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
        <div style={{ maxWidth: '360px', margin: '80px auto', padding: '24px', border: '1px solid #ddd', borderRadius: '8px' }}>
            <h2 style={{ marginTop: 0, textAlign: 'center' }}>{isSignup ? 'Create an account' : 'Log in'}</h2>
            {error && <p style={{ color: '#e53935', fontSize: '13px' }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                {isSignup && (
                    <input
                        type="text"
                        placeholder="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        style={{ display: 'block', width: '100%', marginBottom: '8px', padding: '6px' }}
                    />
                )}
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{ display: 'block', width: '100%', marginBottom: '8px', padding: '6px' }}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{ display: 'block', width: '100%', marginBottom: '12px', padding: '6px' }}
                />
                <button type="submit" disabled={loading} style={{ width: '100%', padding: '8px' }}>
                    {loading ? 'Please wait...' : isSignup ? 'Sign up' : 'Log in'}
                </button>
            </form>
            <p style={{ textAlign: 'center', fontSize: '13px', marginTop: '12px' }}>
                {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
                <button
                    type="button"
                    onClick={() => { setIsSignup(!isSignup); setError(''); }}
                    style={{ border: 'none', background: 'none', color: '#1a73e8', cursor: 'pointer', padding: 0, fontSize: '13px' }}
                >
                    {isSignup ? 'Log in' : 'Sign up'}
                </button>
            </p>
        </div>
    );
}

export default AuthForm;