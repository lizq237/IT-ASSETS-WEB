import { Bell, ChevronDown, LogOut, Search } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

function initials(name = '') {
  return name
    .split(' ')
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

export default function Topbar({ pageTitle }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  async function handleLogout() {
    await logout();
    navigate('/login', { replace: true });
  }

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-6">
      <div className="w-full max-w-md">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar..."
            className="w-full rounded-lg border-none bg-slate-100 py-2 pl-10 pr-4 text-sm text-slate-600 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-300"
          />
        </div>
      </div>

      <div className="ml-4 flex items-center gap-4">
        <button
          type="button"
          className="relative rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-50 hover:text-slate-600"
          aria-label="Notificaciones"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full border border-white bg-red-500" />
        </button>

        <div className="h-6 w-px bg-slate-200" />

        <div className="relative">
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            className="flex items-center gap-2 rounded-lg p-1.5 transition-colors hover:bg-slate-50"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sysbase-dark text-xs font-bold text-white">
              {initials(user?.name)}
            </div>
            <span className="hidden text-sm font-medium text-slate-700 sm:block">
              {user?.name}
            </span>
            <ChevronDown className="h-3 w-3 text-slate-400" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 z-30 mt-2 w-48 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-lg">
              <div className="border-b border-slate-100 px-4 py-3">
                <p className="text-sm font-medium text-slate-800">{user?.name}</p>
                <p className="truncate text-xs text-slate-500">{user?.email}</p>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-slate-700 transition-colors hover:bg-slate-50 hover:text-sysbase-orange"
              >
                <LogOut className="h-4 w-4" />
                Cerrar sesión
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}