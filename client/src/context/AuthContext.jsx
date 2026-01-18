import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { authAPI } from '../utils/api';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Check if user is authenticated on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      setLoading(true);
      const response = await authAPI.getProfile();
      if (response.data) {
        setUser({
          id: response.data._id,
          userName: response.data.userName,
          email: response.data.email,
        });
      }
    } catch {
      // User is not authenticated
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setError(null);
      setLoading(true);
      const response = await authAPI.login({ email, password });
      
      if (response && response.status === 200) {
        // Fetch user profile after successful login
        await checkAuth();
        navigate('/dashboard');
        return { success: true };
      }
      // If status is not 200, return error
      return { success: false, error: 'Login failed. Please try again.' };
    } catch (err) {
      const errorMessage = err.message || 'Login failed. Please try again.';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userName, email, password) => {
    try {
      setError(null);
      setLoading(true);
      const response = await authAPI.register({ userName, email, password });
      
      if (response && response.status === 201) {
        // After registration, login the user
        const loginResponse = await login(email, password);
        // Ensure loginResponse is always defined
        return loginResponse || { success: false, error: 'Registration successful but login failed.' };
      }
      // If status is not 201, extract error from response data
      const errorMessage = response?.data?.message || 'Registration failed. Please try again.';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } catch (err) {
      // Extract error message from the error object
      const errorMessage = err.message || 'Registration failed. Please try again.';
      console.error('Registration error:', err);
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    // Clear cookies by making a request (or just clear state)
    // Since backend uses cookies, we can't directly delete them from frontend
    // But we can clear the user state
    navigate('/');
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    checkAuth,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
