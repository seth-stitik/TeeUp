import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

function Signup() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [bio, setBio] = useState('');
    const [handicap, setHandicap] = useState('');
    const navigate = useNavigate();
    const { setAuth } = useContext(AuthContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:5000/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, email, password, bio, handicap }),
            });
    
            if (response.ok) {
                // If the response is OK, try to parse it as JSON
                const data = await response.json();
                localStorage.setItem('token', data.token);
                setAuth({ token: data.token, isLoggedIn: true });
                navigate('/profile'); // Navigate to the profile page
            } else {
                // If the response is not OK, try to parse it as JSON to get the error message
                let errorMessage = 'Signup failed due to server error';
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.message || errorMessage;
                } catch (jsonError) {
                    // If parsing as JSON fails, use the status text as the error message
                    errorMessage = response.statusText || errorMessage;
                }
                alert(errorMessage);
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
                    <label>Email</label>
                    <input
                        type="email"
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
                <div>
                    <label>Bio</label>
                    <textarea
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                    />
                </div>
                <div>
                    <label>Handicap</label>
                    <input
                        type="number"
                        step="0.1"
                        value={handicap}
                        onChange={(e) => setHandicap(e.target.value)}
                    />
                </div>
                <button type="submit">Signup</button>
            </form>
        </div>
    );
}

export default Signup;



            // if (response.ok) {
            //     alert('User created successfully');
            //     setUsername('');
            //     setEmail('');
            //     setPassword('');
            //     setBio('');
            //     setHandicap('');
            // } else {
            //     const responseText = await response.text(); // Get the text response to show more detailed error
            //     alert(`Failed to create user: ${responseText}`);
            // }