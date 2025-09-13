import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      setIsAuthenticated(true);
      setUser(JSON.parse(userData));
    }
    
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    try {
      setLoading(true);
      
      // Try API login first
      try {
        const response = await authAPI.login(credentials);
        if (response.success) {
          localStorage.setItem('token', response.token);
          localStorage.setItem('user', JSON.stringify(response.user));
          setIsAuthenticated(true);
          setUser(response.user);
          return { success: true };
        }
      } catch (apiError) {
        console.warn('API login failed, trying mock login:', apiError);
      }

      // Fallback to mock login if API fails
      if (credentials.username === 'testuser' && credentials.password === 'password123') {
        const mockUser = { 
          id: 'mock-user-id',
          username: credentials.username,
          email: 'testuser@example.com'
        };
        
        localStorage.setItem('token', 'mock-jwt-token-' + Date.now());
        localStorage.setItem('user', JSON.stringify(mockUser));
        setIsAuthenticated(true);
        setUser(mockUser);
        return { success: true };
      }

      return { success: false, message: 'Invalid credentials' };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'Network error. Please try again.' };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
  };

  const value = {
    isAuthenticated,
    user,
    loading,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
