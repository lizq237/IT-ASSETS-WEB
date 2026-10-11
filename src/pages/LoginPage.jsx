import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LogoSysBase from '../components/LogoSysBase';
import { useAuth } from '../contexts/AuthContext';

function homeForRole(role) {
  if (role === 'super_admin') return '/super-admin';
  if (role === 'admin_ti') return '/admin';
  if (role === 'tecnico') return '/admin';
  return '/login';
}

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { user, login } = useAuth();
  const navigate = useNavigate();

  /* Si ya hay sesión activa, redirige según rol (evita visitar /login estando dentro). */
  useEffect(() => {
    if (user) {
      navigate(homeForRole(user.role), { replace: true });
    }
  }, [user, navigate]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      /* El useEffect detecta el cambio de "user" y navega. */
      setLoading(false);
    } catch (err) {
      if (err.response?.status === 401) {
        setError('Credenciales incorrectas.');
      } else if (err.response?.status === 422) {
        setError('Revisa el formato del correo y la contraseña.');
      } else {
        setError('No se pudo conectar con el servidor. Intenta más tarde.');
      }
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-sysbase-black via-sysbase-dark to-sysbase-dark px-4 py-8">
      <div className="w-full max-w-md">
        <div className="rounded-2xl bg-sysbase-white p-8 shadow-2xl sm:p-10">
          <div className="mb-6 flex justify-center">
            <LogoSysBase width={260} />
          </div>

          <h1 className="text-center text-2xl font-bold text-sysbase-dark">
            Iniciar sesión
          </h1>
          <p className="mb-8 mt-1 text-center text-sm text-sysbase-dark/60">
            Accede con tu cuenta SysBase
          </p>

          {error && (
            <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-center text-sm text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div>
              <label
                htmlFor="email"
                className="mb-1 block text-sm font-medium text-sysbase-dark"
              >
                Correo electrónico
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                placeholder="correo@correo.com"
                className="w-full rounded-lg border border-transparent bg-sysbase-gray px-4 py-3 text-sm text-sysbase-dark transition focus:border-sysbase-orange focus:bg-sysbase-white focus:outline-none focus:ring-4 focus:ring-sysbase-orange/15"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-1 block text-sm font-medium text-sysbase-dark"
              >
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                placeholder="••••••••"
                className="w-full rounded-lg border border-transparent bg-sysbase-gray px-4 py-3 text-sm text-sysbase-dark transition focus:border-sysbase-orange focus:bg-sysbase-white focus:outline-none focus:ring-4 focus:ring-sysbase-orange/15"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-sysbase-orange px-6 py-3 text-sm font-bold uppercase tracking-wide text-sysbase-white shadow-lg shadow-sysbase-orange/30 transition hover:bg-sysbase-orange-dark hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'Ingresando...' : 'Ingresar'}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-sysbase-dark/50">
            SysBase · Plataforma de gestión tecnológica
          </p>
        </div>
      </div>
    </div>
  );
}