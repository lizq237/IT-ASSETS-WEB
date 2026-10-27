import { AlertTriangle, Search, SlidersHorizontal, Trash2, UserPlus, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { Link, useLocation } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import { obtenerEquipos } from '../services/inventory';
import { ADMIN_MENU } from './AdminTIDashboard';

export default function InventoryPage() {
  const { user } = useAuth();
  const location = useLocation();
  const [equipos, setEquipos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [busqueda, setBusqueda] = useState('');
  const [orden, setOrden] = useState('reciente');
  
  //Modales
  const [modalAbierto, setModalAbierto] = useState(false);
  const [equipoSeleccionado, setEquipoSeleccionado] = useState(null);
  const [usuarios, setUsuarios] = useState([]);
  const [usuarioAsignar, setUsuarioAsignar] = useState('');
  const [asignando, setAsignando] = useState(false);
  const [modalEstadoAbierto, setModalEstadoAbierto] = useState(false);
  const [nuevoEstado, setNuevoEstado] = useState('');
  const [actualizandoEstado, setActualizandoEstado] = useState(false);
  const [equipoAEliminar, setEquipoAEliminar] = useState(null);
  const [eliminando, setEliminando] = useState(false);

  const cargarEquipos = () => {
    setCargando(true);
    obtenerEquipos()
      .then((data) => setEquipos(Array.isArray(data) ? data : (data?.data || [])))
      .catch(() => setError('No se pudieron cargar los equipos.'))
      .finally(() => setCargando(false));
  };

  useEffect(() => { cargarEquipos(); }, []);

  const equiposFiltrados = useMemo(() => {
    let res = equipos.filter(eq => 
      eq.code?.toLowerCase().includes(busqueda.toLowerCase()) || 
      eq.serial_number?.toLowerCase().includes(busqueda.toLowerCase()) || 
      eq.brand?.name?.toLowerCase().includes(busqueda.toLowerCase()) ||
      eq.model?.toLowerCase().includes(busqueda.toLowerCase())
    );
    if (orden === 'codigo_asc') res.sort((a, b) => a.code.localeCompare(b.code));
    if (orden === 'codigo_desc') res.sort((a, b) => b.code.localeCompare(a.code));
    return res;
  }, [equipos, busqueda, orden]);

  const abrirModalAsignar = async (equipo) => {
    setEquipoSeleccionado(equipo); setModalAbierto(true); setUsuarioAsignar(equipo.assigned_user_id || '');
    try {
      const { data } = await api.get('/users');
      setUsuarios((data.data || data).filter(u => u.role === 'tecnico' || u.role === 'responsable'));
    } catch { toast.error('Error al cargar la lista de empleados.'); }
  };

  const manejarAsignacion = async (e) => {
    e.preventDefault(); if (!usuarioAsignar) return toast.error('Selecciona un usuario.');
    setAsignando(true);
    try {
      await api.post(`/assets/${equipoSeleccionado.id}/assign`, { user_id: usuarioAsignar });
      toast.success(equipoSeleccionado.assigned_user_id ? 'Transferencia exitosa.' : 'Equipo asignado correctamente.');
      setModalAbierto(false); cargarEquipos();
    } catch (err) { toast.error(err.response?.data?.message || 'Error al asignar.'); } finally { setAsignando(false); }
  };

  const abrirModalEstado = (equipo) => {
    setEquipoSeleccionado(equipo); setNuevoEstado(equipo.status); setModalEstadoAbierto(true);
  };

  const manejarCambioEstado = async (e) => {
    e.preventDefault(); setActualizandoEstado(true);
    try {
      await api.patch(`/assets/${equipoSeleccionado.id}/status`, { status: nuevoEstado });
      toast.success('Estado actualizado correctamente.'); setModalEstadoAbierto(false); cargarEquipos();
    } catch (err) { toast.error(err.response?.data?.message || 'Error al actualizar.'); } finally { setActualizandoEstado(false); }
  };

  const confirmarEliminacion = async () => {
    if (!equipoAEliminar) return; setEliminando(true);
    try {
      await api.delete(`/assets/${equipoAEliminar.id}`);
      toast.success('Equipo eliminado correctamente.'); setEquipoAEliminar(null); cargarEquipos();
    } catch { toast.error('Error al eliminar el equipo.'); } finally { setEliminando(false); }
  };
//estado para saber si se está actualizando el estado de un equipo específico
  const [actualizandoEstadoId, setActualizandoEstadoId] = useState(null);
  const actualizarEstadoInline = async (equipo, nuevoEstado) => {
    if (equipo.status === nuevoEstado) return; // Si el estado es el mismo, no hacemos nada
    
    setActualizandoEstadoId(equipo.id);
    try {
      await api.patch(`/assets/${equipo.id}/status`, { status: nuevoEstado });
      toast.success('Estado actualizado correctamente.');
      
      // Actualizamos el estado localmente para que cambie de color al instante
      setEquipos(equipos.map(eq => 
        eq.id === equipo.id ? { ...eq, status: nuevoEstado } : eq
      ));
    } catch (err) { 
      toast.error(err.response?.data?.message || 'Error al actualizar el estado.'); 
    } finally { 
      setActualizandoEstadoId(null); 
    }
  };

  return(
    <DashboardLayout items={ADMIN_MENU} brandLabel="Administrador de TI" breadcrumb="Gestión de activos" pageTitle="Inventario de equipos">
      <Toaster position="top-right" reverseOrder={false}/>
      
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 p-5">
          <div><h2 className="text-lg font-semibold text-slate-800">Equipos registrados</h2><p className="text-sm text-slate-500">Consulta los activos de tu organización.</p></div>
          {user?.role === 'admin_ti' && <Link to="/admin/inventario/nuevo" className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600">+ Registrar equipo</Link>}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 p-5 bg-slate-50/50 border-b border-slate-100">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 text-slate-400 w-4 h-4"/>
            <input type="text" placeholder="Buscar por código, marca, modelo o serie..." className="w-full pl-10 pr-4 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:border-orange-500 outline-none transition-all" value={busqueda} onChange={(e) => setBusqueda(e.target.value)}/>
          </div>
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="text-slate-400 w-4 h-4"/>
            <select className="bg-white border border-slate-300 rounded-lg px-4 py-2 text-sm text-slate-700 outline-none focus:border-orange-500 cursor-pointer" value={orden} onChange={(e) => setOrden(e.target.value)}>
              <option value="reciente">Más recientes</option><option value="codigo_asc">Código (A-Z)</option><option value="codigo_desc">Código (Z-A)</option>
            </select>
          </div>
        </div>

        {location.state?.mensaje && <div className="m-5 rounded-lg bg-green-50 p-3 text-sm text-green-700">{location.state.mensaje}</div>}
        {cargando && <p className="p-6 text-center text-sm text-slate-500">Cargando equipos...</p>}
        {!cargando && error && <p className="p-6 text-center text-sm text-red-600">{error}</p>}
        {!cargando && !error && equiposFiltrados.length === 0 && <div className="p-10 text-center"><p className="font-medium text-slate-700">No se encontraron equipos.</p><p className="mt-2 text-sm text-slate-500">Prueba con otros términos de búsqueda.</p></div>}

        {!cargando && !error && equiposFiltrados.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-100">
                <tr>
                  <th className="px-5 py-3 text-xs uppercase tracking-wider">Código</th><th className="px-5 py-3 text-xs uppercase tracking-wider">Marca / Modelo</th>
                  <th className="px-5 py-3 text-xs uppercase tracking-wider">Serie</th><th className="px-5 py-3 text-xs uppercase tracking-wider text-center">Estado</th>
                  <th className="px-5 py-3 text-xs uppercase tracking-wider">Asignado a</th><th className="px-5 py-3 text-xs uppercase tracking-wider text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-600">
                {equiposFiltrados.map((equipo) => (
                  <tr key={equipo.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-3 font-medium text-slate-800">{equipo.code}</td>
                    <td className="px-5 py-3">{equipo.brand?.name || '—'} / {equipo.model}</td>
                    <td className="px-5 py-3">{equipo.serial_number || '—'}</td>
                    
                
                    <td className="px-5 py-3 text-center">
                      {(user?.role === 'admin_ti' || (user?.role === 'tecnico' && equipo.assigned_user_id === user?.id)) ? (
                        <select
                          value={equipo.status}
                          onChange={(e) => actualizarEstadoInline(equipo, e.target.value)}
                          disabled={actualizandoEstadoId === equipo.id}
                          className={`border text-xs font-medium rounded-full px-3 py-1 outline-none cursor-pointer transition-colors appearance-none text-center
                            ${equipo.status === 'activo' ? 'bg-green-50 text-green-700 border-green-200 focus:border-green-500' : 
                              equipo.status === 'mantenimiento' ? 'bg-orange-50 text-orange-700 border-orange-200 focus:border-orange-500' : 
                              'bg-slate-100 text-slate-700 border-slate-200 focus:border-slate-500'
                            } ${actualizandoEstadoId === equipo.id ? 'opacity-50 cursor-wait' : ''}`}
                        >
                          <option value="activo">Activo</option>
                          <option value="mantenimiento">Mantenimiento</option>
                          <option value="baja">Dado de Baja</option>
                        </select>
                      ) : (
                        <span className={`rounded-full px-3 py-1 text-xs font-medium capitalize border cursor-not-allowed
                          ${equipo.status === 'activo' ? 'bg-green-50 text-green-700 border-green-100' : 
                            equipo.status === 'mantenimiento' ? 'bg-orange-50 text-orange-700 border-orange-100' : 
                            'bg-slate-100 text-slate-700 border-slate-200'}`}>
                          {equipo.status}
                        </span>
                      )}
                    </td>

                    <td className="px-5 py-3">{equipo.assigned_user ? <span className="font-medium text-slate-700">{equipo.assigned_user.name}</span> : <span className="italic text-slate-400">Sin asignar</span>}</td>
                    <td className="px-5 py-3 text-right">
                      <div className="flex items-center justify-end gap-3">
                        {user?.role === 'admin_ti' && (
                          <>
                            {equipo.status === 'activo' && (
                              <button onClick={() => abrirModalAsignar(equipo)} className={`inline-flex items-center gap-1 text-sm font-medium ${equipo.assigned_user_id ? 'text-blue-500 hover:text-blue-700' : 'text-orange-500 hover:text-orange-700'}`}><UserPlus className="w-4 h-4" />{equipo.assigned_user_id ? 'Transferir' : 'Asignar'}</button>
                            )}
                            <button onClick={() => setEquipoAEliminar(equipo)} className="text-slate-300 hover:text-red-600 transition-colors p-1" title="Eliminar equipo"><Trash2 className="w-4 h-4" /></button>
                          </>
                        )}
                        {user?.role === 'responsable' && <span className="text-slate-300 font-medium">—</span>}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal de asignar */}
      {modalAbierto && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md relative">
            <button onClick={() => setModalAbierto(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
            <h2 className="text-xl font-bold mb-2 text-slate-800">{equipoSeleccionado?.assigned_user_id ? 'Transferir Equipo' : 'Asignar Equipo'}</h2>
            <p className="text-sm text-slate-500 mb-5">Equipo: <strong>{equipoSeleccionado?.code} - {equipoSeleccionado?.model}</strong></p>
            <form onSubmit={manejarAsignacion} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-slate-700">Selecciona un empleado o técnico:</label>
                <select required className="border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-orange-500" value={usuarioAsignar} onChange={(e) => setUsuarioAsignar(e.target.value)}>
                  <option value="">-- Seleccionar --</option>
                  {usuarios.map(u => <option key={u.id} value={u.id}>{u.name} ({u.role})</option>)}
                </select>
              </div>
              <button type="submit" disabled={asignando} className="mt-2 bg-orange-500 text-white px-4 py-2.5 rounded-lg hover:bg-orange-600 font-semibold disabled:opacity-60 shadow-sm">{asignando ? 'Procesando...' : 'Confirmar Asignación'}</button>
            </form>
          </div>
        </div>
      )}

      {/* Modal de eliminar */}
      {equipoAEliminar && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md relative text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4"><AlertTriangle className="h-6 w-6 text-red-600"/></div>
            <h2 className="text-xl font-bold text-slate-800 mb-2">Eliminar Equipo</h2>
            <p className="text-sm text-slate-500 mb-6">¿Estás seguro de que deseas eliminar el equipo <strong>{equipoAEliminar.code}</strong>? Esta acción no se puede deshacer.</p>
            <div className="flex justify-center gap-3">
              <button onClick={() => setEquipoAEliminar(null)} disabled={eliminando} className="px-5 py-2.5 rounded-lg text-sm font-semibold text-slate-600 bg-white border border-slate-300 hover:bg-slate-50 transition-colors">Cancelar</button>
              <button onClick={confirmarEliminacion} disabled={eliminando} className="px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors shadow-sm disabled:opacity-60">{eliminando ? 'Eliminando...' : 'Sí, eliminar'}</button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}