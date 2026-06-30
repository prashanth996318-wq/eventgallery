import React, { createContext, useState, useEffect, useContext } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load user profile if token is present
  useEffect(() => {
    const bootstrapAuth = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const data = await authService.getMe();
        if (data.success) {
          setUser({
            id: data._id,
            name: data.name,
            email: data.email,
            role: data.role,
            linkedStudents: data.linkedStudents || [],
          });
        } else {
          localStorage.removeItem('token');
        }
      } catch (err) {
        console.error('Failed to load user profile on startup:', err.message);
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };

    bootstrapAuth();
  }, []);

  // Login handler
  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const data = await authService.login(email, password);
      if (data.success) {
        localStorage.setItem('token', data.token);
        const loggedUser = {
          id: data._id,
          name: data.name,
          email: data.email,
          role: data.role,
          linkedStudents: data.linkedStudents || [],
        };
        setUser(loggedUser);
        setLoading(false);
        return loggedUser;
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed. Please check credentials.';
      setError(msg);
      setLoading(false);
      throw new Error(msg);
    }
  };

  // Register handler
  const register = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const data = await authService.register(userData);
      if (data.success) {
        localStorage.setItem('token', data.token);
        const registeredUser = {
          id: data._id,
          name: data.name,
          email: data.email,
          role: data.role,
          linkedStudents: data.linkedStudent ? [data.linkedStudent] : [],
        };
        setUser(registeredUser);
        setLoading(false);
        return registeredUser;
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed. Please check fields.';
      setError(msg);
      setLoading(false);
      throw new Error(msg);
    }
  };

  // Logout handler
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        isTeacher: user?.role === 'teacher',
        isParent: user?.role === 'parent',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
