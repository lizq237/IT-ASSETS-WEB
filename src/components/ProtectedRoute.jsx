import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function ProtectedRoute({ children, roles }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-sysbase-gray">
        <p className="text-sysbase-dark">Cargando...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if(roles && !roles.includes(user.role)){
    if(user.role === 'super_admin') return <Navigate to="/super-admin" replace/>;
    if(user.role === 'admin_ti' || user.role === 'tecnico' || user.role === 'responsable'){
      return <Navigate to="/admin" replace/>;
    }
    return <Navigate to="/login" replace/>;
  }

  return children;
}