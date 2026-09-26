import {
    CheckCircle2,
    ClipboardCheck,
    ClipboardList,
    LayoutDashboard,
    Package,
    PackageCheck,
    Settings,
    Users,
    Wrench,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import StatCard from '../components/layout/StatCard';
import api from '../services/api';

/* Menú compartido con ComingSoon */
export const ADMIN_MENU = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/inventario', label: 'Inventario', icon: Package },
  { to: '/admin/usuarios', label: 'Usuarios', icon: Users },
  { to: '/admin/asignaciones', label: 'Asignaciones', icon: ClipboardCheck },
  { to: '/admin/mantenimiento', label: 'Mantenimiento', icon: Wrench },
  { to: '/admin/ajustes', label: 'Configuración', icon: Settings },
];

export default function AdminTIDashboard() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get('/dashboard/resumen')
      .then(({ data }) => setSummary(data.data))
      .catch(() => setError('No se pudo cargar la información del panel.'))
      .finally(() => setLoading(false));
  }, []);

  const equipos = summary?.equipos ?? { total: 0, asignados: 0, disponibles: 0, mantenimiento: 0 };
  const usuarios = summary?.usuarios ?? { total: 0, responsables: 0, tecnicos: 0 };

  return (
    <DashboardLayout
      items={ADMIN_MENU}
      brandLabel="Administrador de TI"
      breadcrumb="Panel del cliente"
      pageTitle="Bienvenido Administrador de TI"
    >
      {/* Aviso de alcance */}
      <div className="mb-6 rounded-xl border border-orange-100 bg-orange-50 px-4 py-3 text-sm text-sysbase-orange">
        Los módulos de inventario y tickets se activan en Sprint 2. Los
        contadores en cero ya están cableados al backend.
      </div>

      {/* Stats de equipos */}
      <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total de equipos"
          value={equipos.total}
          caption="registrados en la organización"
          Icon={Package}
          accent="orange"
        />
        <StatCard
          label="Asignados"
          value={equipos.asignados}
          caption="con responsable directo"
          Icon={PackageCheck}
          accent="blue"
        />
        <StatCard
          label="Disponibles"
          value={equipos.disponibles}
          caption="listos para asignar"
          Icon={CheckCircle2}
          accent="emerald"
        />
        <StatCard
          label="En mantenimiento"
          value={equipos.mantenimiento}
          caption="fuera de servicio"
          Icon={Wrench}
        />
      </div>

      {/* Usuarios reales de la organización */}
      <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-3">
        <StatCard
          label="Usuarios totales"
          value={usuarios.total}
          caption="en esta organización"
          Icon={Users}
          accent="blue"
        />
        <StatCard
          label="Responsables"
          value={usuarios.responsables}
          caption="reportan incidencias"
          Icon={Users}
        />
        <StatCard
          label="Técnicos"
          value={usuarios.tecnicos}
          caption="atienden tickets"
          Icon={Wrench}
        />
      </div>

      {/* Tabla de equipos recientes */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 p-5">
          <div className="flex items-center gap-3">
            <h3 className="font-semibold text-slate-800">Equipos recientes</h3>
            <span className="rounded-full border border-orange-100 bg-orange-50 px-2 py-0.5 text-[11px] font-bold text-sysbase-orange">
              {equipos.total}
            </span>
          </div>
          <button
            type="button"
            disabled
            title="Disponible en Sprint 2"
            className="cursor-not-allowed rounded-lg bg-slate-200 px-4 py-1.5 text-sm font-medium text-slate-500"
          >
            + Registrar equipo
          </button>
        </div>

        {loading && (
          <p className="px-6 py-10 text-center text-sm text-slate-500">Cargando...</p>
        )}

        {!loading && error && (
          <p className="px-6 py-10 text-center text-sm text-red-600">{error}</p>
        )}

        {!loading && !error && equipos.total === 0 && (
          <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
              <ClipboardList className="h-6 w-6" />
            </div>
            <h4 className="text-sm font-semibold text-slate-700">
              Aún no hay equipos registrados
            </h4>
            <p className="mt-1 max-w-sm text-xs text-slate-500">
              En el Sprint 2 podrás dar de alta laptops, monitores, routers y
              otros activos de tu organización.
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}