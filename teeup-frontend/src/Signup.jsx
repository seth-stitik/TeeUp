import React, { useState } from 'react';

function Signup() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch ('http://localhost:5000/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            if (response.ok) {
                alert('User created');
                setUsername('');
                setPassword('');
            } else {
                alert('Failed to create user');
            }
        } catch (error) {
            console.error('Signup Error:', error);
            alert('Error signing up');
        }
    };

    return (
        <div>
            <h2>Signup</h2>
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
            <button type="submit">Signup</button>
            </form>
        </div>
    );
}

export default Signup;