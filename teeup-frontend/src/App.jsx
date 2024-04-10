import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import NavBar from './NavBar';
import WelcomeMessage from './WelcomeMessage';
import Signup from './Signup';
import Login from './Login';
import Profile from './Profile';
import ProtectedRoute from './ProtectedRoute.jsx';

function App() {
  return (
    <Router>
      <div className="App">
        <WelcomeMessage />
        <NavBar />
        <Routes>
          <Route path="/" element={<WelcomeMessage />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
              <Profile /> {/* This is your protected component, such as a user's profile */}
            </ProtectedRoute>
          }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
