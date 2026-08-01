import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { getProfile, login as loginRequest, register as registerRequest, logout as logoutRequest } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initialize = async () => {
      const token = localStorage.getItem('bookstore_token');
      const storedUser = localStorage.getItem('bookstore_user');
      if (token && storedUser) {
        setUser(JSON.parse(storedUser));
        try {
          const response = await getProfile();
          setUser(response.data.user);
          localStorage.setItem('bookstore_user', JSON.stringify(response.data.user));
        } catch {
          localStorage.removeItem('bookstore_token');
          localStorage.removeItem('bookstore_user');
          setUser(null);
        }
      }
      setLoading(false);
    };

    initialize();
  }, []);

  const handleAuthResponse = response => {
    localStorage.setItem('bookstore_token', response.data.token);
    localStorage.setItem('bookstore_user', JSON.stringify(response.data.user));
    setUser(response.data.user);
  };

  const login = async credentials => {
    const response = await loginRequest(credentials);
    handleAuthResponse(response);
    return response.data;
  };

  const register = async details => {
    const response = await registerRequest(details);
    handleAuthResponse(response);
    return response.data;
  };

  const logout = async () => {
    try {
      await logoutRequest();
    } finally {
      localStorage.removeItem('bookstore_token');
      localStorage.removeItem('bookstore_user');
      localStorage.removeItem('bookstore_cart');
      setUser(null);
    }
  };

  const value = useMemo(() => ({ user, loading, login, register, logout }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
