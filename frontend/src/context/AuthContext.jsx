import { useMemo, useState } from 'react';
import api from '../utils/api';
import { AuthContext } from './auth-context';

// Read the authenticated user from localStorage once on bootstrap.
// This keeps the app logged in after page refresh.
const getStoredUser = () => {
  const storedUser = localStorage.getItem('user');

  if (!storedUser) {
    return null;
  }

  try {
    return JSON.parse(storedUser);
  } catch (error) {
    console.error('Error parsing saved user data:', error);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getStoredUser);

  // login:
  // 1. Send credentials to backend.
  // 2. Persist token + user in localStorage.
  // 3. Update context state so the whole UI re-renders immediately.
  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, user: userData } = response.data.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);

      return { success: true, user: userData };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed'
      };
    }
  };

  // register follows the same persistence flow as login so the user
  // is authenticated immediately after creating an account.
  const register = async (name, email, password) => {
    try {
      const response = await api.post('/auth/register', { name, email, password });
      const { token, user: userData } = response.data.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);

      return { success: true, user: userData };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed'
      };
    }
  };

  // logout:
  // Remove auth data and set user = null.
  // Cart UI is cleared indirectly because CartContext derives its
  // visible cart from the currently authenticated user.
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const value = useMemo(() => ({
    user,
    isAuthenticated: Boolean(user),
    loading: false,
    login,
    register,
    logout
  }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
