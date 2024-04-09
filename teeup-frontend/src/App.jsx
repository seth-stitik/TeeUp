import React from 'react';
import './App.css';
import WelcomeMessage from './WelcomeMessage';
import Signup from './Signup';
import Login from './Login';

function App() {
  return (
    <div className="App">
      <WelcomeMessage />
      <Signup />
      <Login />
    </div>
  );
}

export default App;
