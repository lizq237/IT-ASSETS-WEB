import {
    AlertTriangle,
    CheckCircle2,
    ClipboardCheck,
    ClipboardList,
    LayoutDashboard,
    Package,
    RefreshCw,
    Settings,
    Tag,
    Trash2,
    Users,
    Wrench,
} from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import StatCard from '../components/layout/StatCard';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

export const ADMIN_MENU = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true, roles: ['admin_ti', 'tecnico', 'responsable'] },
  { to: '/admin/inventario', label: 'Inventario', icon: Package, roles: ['admin_ti', 'tecnico', 'responsable'] },
  { to: '/admin/categorias', label: 'Categorías', icon: Tag, roles: ['admin_ti', 'tecnico', 'responsable'] },
  { to: '/admin/usuarios', label: 'Usuarios', icon: Users, roles: ['admin_ti'] },
  { to: '/admin/asignaciones', label: 'Asignaciones', icon: ClipboardCheck, roles: ['admin_ti', 'tecnico'] },
  { to: '/admin/mantenimiento', label: 'Mantenimiento', icon: Wrench, roles: ['admin_ti', 'tecnico'] },
  { to: '/admin/ajustes', label: 'Configuración', icon: Settings, roles: ['admin_ti'] },
];

export default function AdminTIDashboard(){
  const { user } = useAuth();
  const [summary, setSummary] = useState(null);
  const [equiposRecientes, setEquiposRecientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDashboardData = useCallback(async (signal) => {
    setLoading(true);
    setError('');
    try{
      const [resumenRes, assetsRes] = await Promise.all([
        api.get('/dashboard/resumen', { signal }),
        api.get('/assets', { signal }),
      ]);
      setSummary(resumenRes.data.data);
      setEquiposRecientes(assetsRes.data.data.slice(0, 5));
    }catch (err){
      if(err.name !== 'CanceledError' && err.name !== 'AbortError'){
        setError('No se pudo cargar la información del panel.');
      }
    }finally{
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    fetchDashboardData(controller.signal);
    return () => controller.abort();
  }, [fetchDashboardData]);

  const equipos = summary?.equipos ?? { total: 0, disponibles: 0, mantenimiento: 0, baja: 0 };
  const usuarios = summary?.usuarios ?? { total: 0, responsables: 0, tecnicos: 0 };

  return (
    <DashboardLayout items={ADMIN_MENU} brandLabel={user?.role === 'admin_ti' ? 'Administrador de TI' : 'Panel Operativo'} breadcrumb="Panel del cliente" pageTitle={`Bienvenido, ${user?.name || 'Usuario'}`}>
      
      {/*Banner de error general con opción de reintentar*/}
      {error && (
        <div className="mb-6 flex items-center justify-between rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
          <div className="flex items-center gap-2 text-sm font-medium">
            <AlertTriangle className="h-5 w-5 text-red-500"/>
            <span>{error}</span>
          </div>
          <button type="button" onClick={() => fetchDashboardData()} className="inline-flex items-center gap-1.5 rounded-md bg-red-100 px-3 py-1.5 text-xs font-semibold text-red-800 transition hover:bg-red-200">
            <RefreshCw className="h-3.5 w-3.5"/> Reintentar
          </button>
        </div>
      )}

      {/*Stats de equipos*/}
      <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total de equipos" value={loading ? "..." : equipos.total} caption="registrados en la organización" Icon={Package} accent="orange" />
        <StatCard label="Disponibles" value={loading ? "..." : equipos.disponibles} caption="listos para usarse" Icon={CheckCircle2} accent="emerald" />
        <StatCard label="En mantenimiento" value={loading ? "..." : equipos.mantenimiento} caption="fuera de servicio" Icon={Wrench} />
        <StatCard label="Dados de baja" value={loading ? "..." : equipos.baja} caption="en desuso" Icon={Trash2} accent="slate" />
      </div>

      {/*Stats de usuarios (solo en adminti)*/}
      {user?.role === 'admin_ti' && (
        <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-3">
          <StatCard label="Usuarios totales" value={loading ? "..." : usuarios.total} caption="en esta organización" Icon={Users} accent="blue" />
          <StatCard label="Responsables" value={loading ? "..." : usuarios.responsables} caption="reportan incidencias" Icon={Users} />
          <StatCard label="Técnicos" value={loading ? "..." : usuarios.tecnicos} caption="atienden tickets" Icon={Wrench} />
        </div>
      )}

      {/*Tabla de equipos recientes*/}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 p-5">
          <div className="flex items-center gap-3">
            <h3 className="font-semibold text-slate-800">Equipos recientes</h3>
            <span className="rounded-full border border-orange-100 bg-orange-50 px-2 py-0.5 text-[11px] font-bold text-sysbase-orange">
              Últimos 5
            </span>
          </div>
          <Link to="/admin/inventario" className="text-sm text-sysbase-orange hover:underline font-medium">
            Ver todo el inventario
          </Link>
        </div>

        {/*Estado de Carga*/}
        {loading && (
          <div className="flex items-center justify-center gap-2 px-6 py-12 text-sm text-slate-500">
            <RefreshCw className="h-4 w-4 animate-spin text-slate-400"/>
            <span>Cargando información...</span>
          </div>
        )}

        {/*estado sin datos*/}
        {!loading && !error && equiposRecientes.length === 0 && (
          <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
              <ClipboardList className="h-6 w-6"/>
            </div>
            <h4 className="text-sm font-semibold text-slate-700">Aún no hay equipos registrados</h4>
            <p className="mt-1 max-w-sm text-xs text-slate-500">Ve a la sección de Inventario para dar de alta tu primer activo.</p>
          </div>
        )}

        {/*Render de equipos recientes*/}
        {!loading && !error && equiposRecientes.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-100 text-xs uppercase text-slate-400">
                <tr>
                  <th className="px-6 py-3 font-semibold">Código</th>
                  <th className="px-6 py-3 font-semibold">Marca / Modelo</th>
                  <th className="px-6 py-3 font-semibold">Estado</th>
                  <th className="px-6 py-3 font-semibold">Asignado a</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {equiposRecientes.map((eq) => (
                  <tr key={eq.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-800">{eq.code}</td>
                    <td className="px-6 py-4">{eq.brand || '—'} / {eq.model}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize border ${
                        eq.status === 'activo' 
                          ? 'bg-green-50 text-green-700 border-green-100' 
                          : eq.status === 'mantenimiento' 
                          ? 'bg-orange-50 text-orange-700 border-orange-100' 
                          : 'bg-slate-100 text-slate-700 border-slate-200'
                      }`}>
                        {eq.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {eq.assigned_user 
                        ? eq.assigned_user.name 
                        : <span className="text-slate-400 italic">Sin asignar</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}