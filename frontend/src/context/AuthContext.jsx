import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/client';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('cc_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem('cc_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleAuthExpired = () => {
      setUser(null);
      setToken(null);
    };

    window.addEventListener('auth:expired', handleAuthExpired);
    return () => window.removeEventListener('auth:expired', handleAuthExpired);
  }, []);

  useEffect(() => {
    const verifyToken = async () => {
      if (token) {
        try {
          const res = await api.get('/auth/me');
          if (res.data?.success && res.data.data) {
            const fetched = res.data.data;
            setUser((prev) => ({ ...prev, ...fetched }));
            localStorage.setItem('cc_user', JSON.stringify(fetched));
          }
        } catch {
          // Token invalid or expired
          logout();
        }
      }
      setLoading(false);
    };

    verifyToken();
  }, [token]);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    if (res.data?.success && res.data.data) {
      const data = res.data.data;
      const userData = {
        id: data.id,
        fullName: data.fullName,
        email: data.email,
        role: data.role,
        phone: data.phone,
      };
      setToken(data.token);
      setUser(userData);
      localStorage.setItem('cc_token', data.token);
      localStorage.setItem('cc_user', JSON.stringify(userData));
      return userData;
    }
    throw new Error(res.data?.message || 'Login failed');
  };

  const register = async (formData) => {
    const res = await api.post('/auth/register', formData);
    if (res.data?.success && res.data.data) {
      const data = res.data.data;
      const userData = {
        id: data.id,
        fullName: data.fullName,
        email: data.email,
        role: data.role,
        phone: data.phone,
      };
      setToken(data.token);
      setUser(userData);
      localStorage.setItem('cc_token', data.token);
      localStorage.setItem('cc_user', JSON.stringify(userData));
      return userData;
    }
    throw new Error(res.data?.message || 'Registration failed');
  };

  const updateProfile = async (formData) => {
    const res = await api.put('/auth/profile', formData);
    if (res.data?.success && res.data.data) {
      const updated = res.data.data;
      setUser((prev) => {
        const next = { ...prev, ...updated };
        localStorage.setItem('cc_user', JSON.stringify(next));
        return next;
      });
      return updated;
    }
    throw new Error(res.data?.message || 'Update failed');
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('cc_token');
    localStorage.removeItem('cc_user');
  };

  const isCustomer = user?.role === 'ROLE_CUSTOMER';
  const isStaff = user?.role === 'ROLE_STAFF';
  const isAdmin = user?.role === 'ROLE_ADMIN';
  const isStaffOrAdmin = isStaff || isAdmin;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        updateProfile,
        logout,
        isAuthenticated: !!token,
        isCustomer,
        isStaff,
        isAdmin,
        isStaffOrAdmin,
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
