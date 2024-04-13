import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    token: localStorage.getItem('token'), // Retrieve the token from local storage
    isLoggedIn: !!localStorage.getItem('token'), // Determine if user is logged in based on the token
    userId: localStorage.getItem('userId'), // Retrieve the userId from local storage
  });

  useEffect(() => {
    localStorage.setItem('token', auth.token);
    localStorage.setItem('userId', auth.userId);
  }, [auth]);

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};