import React, { useState, useEffect } from 'react';

function WelcomeMessage() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Fetch the welcome message from the Express server
    fetch('http://localhost:5000/')
      .then(response => response.text())
      .then(data => {
        setMessage(data);
      })
      .catch(error => console.error('Error fetching welcome message:', error));
  }, []);

  return <div>{message ? message : 'Loading...'}</div>;
}

export default WelcomeMessage;
