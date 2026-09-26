import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';
import AdminTIDashboard, { ADMIN_MENU } from './pages/AdminTIDashboard';
import ComingSoon from './pages/ComingSoon';
import LoginPage from './pages/LoginPage';
import SuperAdminDashboard from './pages/SuperAdminDashboard';

const ADMIN_PLACEHOLDERS = [
  { path: 'inventario',    title: 'Inventario' },
  { path: 'usuarios',      title: 'Usuarios' },
  { path: 'asignaciones',  title: 'Asignaciones' },
  { path: 'mantenimiento', title: 'Mantenimiento' },
  { path: 'ajustes',       title: 'Configuración' },
];

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginPage />} />

          <Route
            path="/super-admin"
            element={
              <ProtectedRoute roles={['super_admin']}>
                <SuperAdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* Panel del admin_ti */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute roles={['admin_ti']}>
                <AdminTIDashboard />
              </ProtectedRoute>
            }
          />

          {/* Sub-rutas placeholder hasta Sprint 2 */}
          {ADMIN_PLACEHOLDERS.map(({ path, title }) => (
            <Route
              key={path}
              path={`/admin/${path}`}
              element={
                <ProtectedRoute roles={['admin_ti']}>
                  <ComingSoon
                    items={ADMIN_MENU}
                    brandLabel="Administrador de TI"
                    title={title}
                  />
                </ProtectedRoute>
              }
            />
          ))}

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}