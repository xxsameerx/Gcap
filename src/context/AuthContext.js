import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

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
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check for stored auth token on app load
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('userData');
    
    if (token && userData) {
      setUser(JSON.parse(userData));
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  // Replace the login function in AuthContext.js
const login = async (email, password) => {
  try {
    setLoading(true);
    
    // Dummy credentials for testing
    const dummyCredentials = [
      {
        email: 'admin@econsultation.gov.in',
        password: 'admin123',
        user: {
          name: 'Admin User',
          email: 'admin@econsultation.gov.in',
          role: 'Government Official',
          organization: 'Ministry of Corporate Affairs'
        }
      },
      {
        email: 'test@gov.in',
        password: 'test123',
        user: {
          name: 'Test Officer',
          email: 'test@gov.in',
          role: 'Policy Analyst',
          organization: 'Department of Digital India'
        }
      },
      {
        email: 'demo@mca.gov.in',
        password: 'demo123',
        user: {
          name: 'Demo User',
          email: 'demo@mca.gov.in',
          role: 'Legal Advisor',
          organization: 'MCA India'
        }
      }
    ];

    // Check if credentials match dummy accounts
    const matchedUser = dummyCredentials.find(
      cred => cred.email === email && cred.password === password
    );

    if (matchedUser) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setUser(matchedUser.user);
      setIsAuthenticated(true);
      localStorage.setItem('authToken', 'dummy-token-' + Date.now());
      localStorage.setItem('userData', JSON.stringify(matchedUser.user));
      return { success: true };
    } else {
      return { success: false, error: 'Invalid credentials. Try: admin@econsultation.gov.in / admin123' };
    }
  } catch (error) {
    return { success: false, error: 'Login failed' };
  } finally {
    setLoading(false);
  }
};


  const signup = async (userData) => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      
      if (response.ok) {
        const data = await response.json();
        return { success: true, message: 'Registration successful' };
      } else {
        return { success: false, error: 'Registration failed' };
      }
    } catch (error) {
      return { success: false, error: 'Registration failed' };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    signup,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
