import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';
import AdminCategorias from './pages/AdminCategorias';
import AdminTIDashboard, { ADMIN_MENU } from './pages/AdminTIDashboard';
import AdminUsuarios from './pages/AdminUsuarios';
import ComingSoon from './pages/ComingSoon';
import LoginPage from './pages/LoginPage';
import SuperAdminDashboard from './pages/SuperAdminDashboard';

const ADMIN_PLACEHOLDERS = [
  { path: 'inventario',    title: 'Inventario',      roles: ['admin_ti', 'tecnico'] },
  { path: 'asignaciones',  title: 'Asignaciones',    roles: ['admin_ti', 'tecnico'] },
  { path: 'mantenimiento', title: 'Mantenimiento',   roles: ['admin_ti', 'tecnico'] },
  { path: 'ajustes',       title: 'Configuración',   roles: ['admin_ti'] },
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
              <ProtectedRoute roles={['admin_ti', 'tecnico']}>
                <AdminTIDashboard />
              </ProtectedRoute>
            }
          />

          {ADMIN_PLACEHOLDERS.map(({ path, title, roles }) => (
            <Route
              key={path}
              path={`/admin/${path}`}
              element={
                <ProtectedRoute roles={roles}>
                  <ComingSoon
                    items={ADMIN_MENU}
                    brandLabel="Administrador de TI"
                    title={title}
                  />
                </ProtectedRoute>
              }
            />
          ))}

          <Route
            path="/admin/usuarios"
            element={
              <ProtectedRoute roles={['admin_ti']}>
                <AdminUsuarios />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/categorias"
            element={
              <ProtectedRoute roles={['admin_ti', 'tecnico']}>
                <AdminCategorias />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}