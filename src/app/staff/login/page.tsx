'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        const res = await fetch('/api/auth/login', {
            method: 'POST',
            body: JSON.stringify({ password }),
        });

        if (res.ok) {
            router.push('/staff/dashboard');
        } else {
            setError('Password errata');
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column'
        }}>
            <div className="glass-panel" style={{ padding: '3rem', width: '100%', maxWidth: '400px' }}>
                <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>Staff Access</h1>
                <form onSubmit={handleLogin}>
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={{ marginBottom: '1rem' }}
                    />
                    {error && <p style={{ color: '#ff6b6b', marginBottom: '1rem' }}>{error}</p>}
                    <button type="submit" className="btn-primary" style={{ width: '100%' }}>Entra</button>
                </form>
            </div>
        </div>
    );
}
