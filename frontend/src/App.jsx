import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import ScriptGenerator from './pages/ScriptGenerator';
import ScriptDetail from './pages/ScriptDetail';
import ThumbnailGenerator from './pages/ThumbnailGenerator';
import Folders from './pages/Folders';
import Ideas from './pages/Ideas';
import LoadingSpinner from './components/LoadingSpinner';

export default function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading..." />
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <Login />} />
      <Route path="/signup" element={user ? <Navigate to="/dashboard" replace /> : <Signup />} />

      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/generate" element={<ScriptGenerator />} />
        <Route path="/scripts/:id" element={<ScriptDetail />} />
        <Route path="/thumbnails" element={<ThumbnailGenerator />} />
        <Route path="/folders" element={<Folders />} />
        <Route path="/ideas" element={<Ideas />} />
      </Route>

      <Route path="*" element={<Navigate to={user ? '/dashboard' : '/login'} replace />} />
    </Routes>
  );
}
