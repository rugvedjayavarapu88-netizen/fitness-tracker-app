import { Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from '../pages/LandingPage';
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import Dashboard from '../pages/Dashboard';
import ForgotPassword from '../pages/ForgotPassword';
import ResetPassword from '../pages/ResetPassword';
import { useAuth } from '../context/AuthContext';

const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      <Route
        path="/dashboard"
        element={user ? <Dashboard /> : <Navigate to="/login" />}
      />
      <Route path="*" element={<Navigate to="/dashboard" />} />
      <Route path="/" element={<Navigate to="/dashboard" />} />

    </Routes>
  );
};

export default AppRoutes;
