import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './styles/App.css';
import NavBar from './components/NavBar';
import WelcomeMessage from './components/WelcomeMessage';
import Signup from './components/Signup';
import Login from './components/Login';
import Profile from './components/Profile';
import PostsFeed from './components/PostsFeed';
import ProtectedRoute from './components/ProtectedRoute.jsx';


function App() {
  return (
    <Router>
      <div className="App">
        <NavBar />
        <Routes>
          <Route path="/" element={<WelcomeMessage />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile /> {/* This is your protected component, such as a user's profile */}
            </ProtectedRoute>
          } />
          {/* Make the feed accessible as a protected route if it should be visible only to logged-in users */}
          <Route path="/feed" element={
            <ProtectedRoute>
              <PostsFeed />
            </ProtectedRoute>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
