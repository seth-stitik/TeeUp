import React, { useState } from 'react';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch( 'http://localhost:5000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
            });

            if (response.ok) {
                const data = await response.json();
                alert('Login successful');
                console.log('Token:', data.token);
            } else {
                alert('Failed to login');
            }
        } catch (error) {
            console.error('Login Error:', error);
            alert('Error logging in');
            } 
        };
        
        return (
            <div>
                <h2>Login</h2>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Username</label>
                        <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        />
                    </div>
                    <div>
                        <label>Password</label>
                        <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        />
                    </div>
                    <button type="submit">Login</button>
                </form>
            </div>
            );
        }

export default Login;