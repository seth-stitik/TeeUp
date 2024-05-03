import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './styles/App.css';  // Correctly point to the CSS file in the styles folder
import NavBar from './components/common/NavBar';  // Correct the path
import WelcomeMessage from './components/common/WelcomeMessage';  // Correct the path
import Signup from './components/auth/Signup';  // Correct the path
import Login from './components/auth/Login';  // Correct the path
import Profile from './components/profile/Profile';  // Correct the path
import PostsFeed from './components/posts/PostsFeed';  // Correct the path
import ProtectedRoute from './routes/ProtectedRoute';  // Correct the path

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
              <Profile />
            </ProtectedRoute>
          } />
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
