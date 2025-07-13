import React, { createContext, useState, useEffect, useCallback } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  // Fetch user profile
  const fetchProfile = useCallback(async () => {
    if (token) {
      setLoading(true);
      try {
        const res = await fetch('/api/auth/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success) setUser(data.user);
        else logout();
      } catch (err) {
        logout();
      }
      setLoading(false);
    } else {
      setUser(null);
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchProfile();
  }, [token, fetchProfile]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (data.success && data.token) {
        setToken(data.token);
        localStorage.setItem('token', data.token);
        setUser(data.user);
        setLoading(false);
        return { success: true };
      }
      setLoading(false);
      return { success: false, message: data.message || 'Login failed' };
    } catch {
      setLoading(false);
      return { success: false, message: 'Network error' };
    }
  };

  const signup = async (name, email, password) => {
    setLoading(true);
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      const data = await res.json();
      if (data.success && data.token) {
        setToken(data.token);
        localStorage.setItem('token', data.token);
        setUser(data.user);
        setLoading(false);
        return { success: true };
      }
      setLoading(false);
      return { success: false, message: data.message || 'Signup failed' };
    } catch {
      setLoading(false);
      return { success: false, message: 'Network error' };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    // Do not clear all storage to avoid removing unrelated data
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      login,
      signup,
      logout,
      loading,
      refreshProfile: fetchProfile // expose method to manually refresh profile
    }}>
      {children}
    </AuthContext.Provider>
  );
};
