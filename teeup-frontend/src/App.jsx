import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import WelcomeMessage from './WelcomeMessage';
import Signup from './Signup';
import Login from './Login';

function App() {
  return (
    <Router>
      <div className="App">
        <WelcomeMessage />
        <nav>
          <Link to="/signup">Signup</Link>
          <Link to="/login">Login</Link>
        </nav>
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
