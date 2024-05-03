import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

function Login() {
    const [email, setEmail] = useState(''); // Use email for login
    const [password, setPassword] = useState('');
    const { setAuth } = useContext(AuthContext);
    const navigate = useNavigate();

const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const response = await fetch('http://localhost:5000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json(); // Moved inside the if-statement to ensure it's only read when response.ok is true

        if (response.ok) {
            alert('Login successful');
            localStorage.setItem('token', data.token); // Correctly use data.token
            setAuth({ token: data.token, isLoggedIn: true, userId: data.userId}); // Assume data includes userId
            navigate('/profile');
        } else {
            // This block handles HTTP error statuses, such as 401 Unauthorized
            alert('Failed to login: ' + data.message); // Assuming the server response includes some message
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
                    <label>Email</label>
                    <input
                        type="email" // This helps with keyboards on mobile devices
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
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


