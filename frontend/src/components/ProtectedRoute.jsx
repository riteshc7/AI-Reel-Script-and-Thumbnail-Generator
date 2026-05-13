import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { DashboardSkeleton } from './SkeletonCard';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <DashboardSkeleton />;
  if (!user) return <Navigate to="/login" replace />;

  return children;
}
