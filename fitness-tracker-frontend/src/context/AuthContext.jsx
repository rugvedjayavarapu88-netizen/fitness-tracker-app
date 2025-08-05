import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      setUser({}); // Optionally fetch user info
    } else {
      setUser(null);
    }
  }, [token]);

  // Login
  const login = async (email, password) => {
    try {
      const res = await API.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      setToken(res.data.token);
      navigate('/dashboard');
    } catch (err) {
      alert(err.response?.data?.message || 'Login failed');
    }
  };

  // Signup
  const signup = async (email, password) => {
    try {
      await API.post('/auth/signup', { email, password });
      alert('Signup successful! Please log in.');
      navigate('/login');
    } catch (err) {
      alert(err.response?.data?.message || 'Signup failed');
    }
  };

  // Logout
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    navigate('/login');
  };

  // Forgot Password
  const forgotPassword = async (email) => {
    try {
      const res = await API.post('/auth/forgot-password', { email });
      alert(res.data.message || 'Check your email for reset instructions');
    } catch (err) {
      alert(err.response?.data?.message || 'Error sending reset email');
    }
  };

  // Reset Password
  const resetPassword = async (resetToken, newPassword) => {
    try {
      const res = await API.post(`/auth/reset-password/${resetToken}`, {
        password: newPassword,
      });
      alert(res.data.message || 'Password reset successful');
      navigate('/login');
    } catch (err) {
      alert(err.response?.data?.message || 'Reset failed');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        login,
        signup,
        logout,
        forgotPassword,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook for using auth context in any component
export const useAuth = () => useContext(AuthContext);
