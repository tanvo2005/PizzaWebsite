import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Component ProtectedRoute để bảo vệ routes
const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // Hoặc component loading
  }

  if (!user) {
    // Chưa đăng nhập, chuyển về login
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    // Không có quyền, chuyển về home
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;