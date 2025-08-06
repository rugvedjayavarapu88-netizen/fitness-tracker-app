import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/api';

const LandingPage = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleLogin = async () => {
    try {
      const res = await axios.post('/api/auth/login', { email, password });

      // Store token
      localStorage.setItem('token', res.data.token);

      // Redirect to dashboard
      navigate('/dashboard');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Login failed. Try again.');
    }
  };

  const handleSignup = async () => {
    try {
      const res = await axios.post('/api/auth/signup', { email, password });

      localStorage.setItem('token', res.data.token); // Optional
      navigate('/dashboard');
    } catch (err) {
      const msg = err.response?.data?.message;
      if (msg && msg.includes('already exists')) {
        setMessage('User already registered. Please login.');
      } else {
        setMessage(msg || 'Signup failed.');
      }
    }
  };

  const handleForgotPasswordRedirect = () => {
    navigate('/forgot-password');
  };

  return (
    <div className="flex items-center justify-center min-h-screen w-screen bg-gradient-to-br from-purple-400 to-purple-600">
      <div className="bg-white p-10 rounded-lg shadow-xl w-full max-w-md text-center">
        <h1 className="text-3xl font-bold text-purple-700 mb-4">Welcome to Fitness Tracker 🏋️</h1>
        <p className="text-gray-600 mb-6">Track your workouts, stay healthy, and reach your goals!</p>

        {/* Message */}
        {message && <p className="text-red-500 text-sm mb-4">{message}</p>}

        {/* Inputs */}
        <input
          type="email"
          placeholder="Enter email"
          className="w-full px-4 py-2 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Enter password"
          className="w-full px-4 py-2 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {/* Buttons */}
        <div className="flex flex-col gap-3">
          <button
            onClick={handleLogin}
            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 rounded-md transition"
          >
            Login
          </button>
          <button
            onClick={handleSignup}
            className="bg-gray-100 hover:bg-gray-200 text-purple-700 font-semibold py-2 rounded-md transition"
          >
            Sign Up
          </button>
        </div>

        <button
          onClick={handleForgotPasswordRedirect}
          className="mt-4 text-sm text-purple-600 hover:underline"
        >
          Forgot Password?
        </button>
      </div>
    </div>
  );
};

export default LandingPage;
