
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import { ADMIN_MENU } from './AdminTIDashboard';
import { useAuth } from '../contexts/AuthContext';
import { obtenerEquipos } from '../services/inventory';

export default function InventoryPage() {
  const { user } = useAuth();
  const location = useLocation();

  const [equipos, setEquipos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    obtenerEquipos()
      .then((data) => {
        const lista = Array.isArray(data)
          ? data
          : Array.isArray(data?.data)
            ? data.data
            : [];

        setEquipos(lista);
      })
      .catch(() => {
        setError('No se pudieron cargar los equipos.');
      })
      .finally(() => {
        setCargando(false);
      });
  }, []);

  return (
    <DashboardLayout
      items={ADMIN_MENU}
      brandLabel="Administrador de TI"
      breadcrumb="Gestión de activos"
      pageTitle="Inventario de equipos"
    >
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 p-5">
          <div>
            <h2 className="text-lg font-semibold text-slate-800">
              Equipos registrados
            </h2>
            <p className="text-sm text-slate-500">
              Consulta los activos de tu organización.
            </p>
          </div>

          {user?.role === 'admin_ti' && (
            <Link
              to="/admin/inventario/nuevo"
              className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600"
            >
              + Registrar equipo
            </Link>
          )}
        </div>

        {location.state?.mensaje && (
          <div className="m-5 rounded-lg bg-green-50 p-3 text-sm text-green-700">
            {location.state.mensaje}
          </div>
        )}

        {cargando && (
          <p className="p-6 text-center text-sm text-slate-500">
            Cargando equipos...
          </p>
        )}

        {!cargando && error && (
          <p className="p-6 text-center text-sm text-red-600">
            {error}
          </p>
        )}

        {!cargando && !error && equipos.length === 0 && (
          <div className="p-10 text-center">
            <p className="font-medium text-slate-700">
              Aún no hay equipos registrados.
            </p>
            <p className="mt-2 text-sm text-slate-500">
              Los equipos que registres aparecerán aquí.
            </p>
          </div>
        )}

        {!cargando && !error && equipos.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="px-5 py-3">Código</th>
                  <th className="px-5 py-3">Marca</th>
                  <th className="px-5 py-3">Modelo</th>
                  <th className="px-5 py-3">Serie</th>
                  <th className="px-5 py-3">Ubicación</th>
                  <th className="px-5 py-3">Estado</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {equipos.map((equipo) => (
                  <tr key={equipo.id} className="hover:bg-slate-50">
                    <td className="px-5 py-3 font-medium">
                      {equipo.code}
                    </td>
                    <td className="px-5 py-3">
                      {equipo.brand || '—'}
                    </td>
                    <td className="px-5 py-3">
                      {equipo.model}
                    </td>
                    <td className="px-5 py-3">
                      {equipo.serial_number || '—'}
                    </td>
                    <td className="px-5 py-3">
                      {equipo.location || '—'}
                    </td>
                    <td className="px-5 py-3">
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium capitalize text-slate-700">
                        {equipo.status}
                      </span>
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
