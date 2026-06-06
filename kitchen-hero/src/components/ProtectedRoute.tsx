import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; 

export default function ProtectedRoute() {
  const { session, loading, isDemoMode } = useAuth();

  if (loading) return <div>Loading...</div>;

  
  if (session || isDemoMode) {
    return <Outlet />;
  }

  return <Navigate to="/auth" replace />;
}
