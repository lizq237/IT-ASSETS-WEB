//se añadio lo de brands y locations 
import { Layers, MapPin, MonitorSmartphone, Pencil, Tag, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import DashboardLayout from '../components/layout/DashboardLayout';
import api from '../services/api';
import { ADMIN_MENU } from './AdminTIDashboard';

const FORM_VACIO = { name: '', description: '' };

const TABS = [
  { id: 'categorias', label: 'Categorías', endpoint: '/categories', icon: Layers, desc: 'Agrupa el tipo de hardware (Laptops, Monitores, etc.)' },
  { id: 'marcas', label: 'Marcas', endpoint: '/brands', icon: MonitorSmartphone, desc: 'Fabricantes del hardware (HP, Dell, Apple, etc.)' },
  { id: 'ubicaciones', label: 'Ubicaciones', endpoint: '/locations', icon: MapPin, desc: 'Aulas, laboratorios o áreas físicas de la organización' }
];

export default function AdminCatalogos(){
    const [tabActiva, setTabActiva] = useState(TABS[0]);
    const [registros, setRegistros] = useState([]);
    const [cargando, setCargando] = useState(true);
    
    // Modal y Formularios
    const [mostrarModal, setMostrarModal] = useState(false);
    const [registroEditando, setRegistroEditando] = useState(null);
    const [formulario, setFormulario] = useState(FORM_VACIO);
    const [guardando, setGuardando] = useState(false);
    
    // Eliminación
    const [confirmandoId, setConfirmandoId] = useState(null);
    const [eliminandoId, setEliminandoId] = useState(null);

    async function cargarDatos(){
        setCargando(true);
        try{
            const { data } = await api.get(tabActiva.endpoint);
            setRegistros(Array.isArray(data) ? data : (data?.data || []));
        } catch (error){
            toast.error(`Error al cargar ${tabActiva.label.toLowerCase()}.`);
        } finally{
            setCargando(false);
        }
    }

    useEffect(() => {
        cargarDatos();
        setConfirmandoId(null);
    }, [tabActiva]);

    function abrirModalCrear(){
        setFormulario(FORM_VACIO);
        setRegistroEditando(null);
        setMostrarModal(true);
    }

    function abrirModalEditar(registro){
        setFormulario({
            name: registro.name ?? '',
            description: registro.description ?? '',
        });
        setRegistroEditando(registro);
        setMostrarModal(true);
    }

    function cerrarModal(){
        setMostrarModal(false);
        setFormulario(FORM_VACIO);
        setRegistroEditando(null);
    }

    async function manejarEnvio(e){
        e.preventDefault();
        setGuardando(true);

        const payload = { ...formulario };
        if (tabActiva.id !== 'categorias') {
            delete payload.description;
        }

        try{
            if(registroEditando){
                await api.put(`${tabActiva.endpoint}/${registroEditando.id}`, payload);
                toast.success(`${tabActiva.label.slice(0, -1)} actualizada.`);
            }else{
                await api.post(tabActiva.endpoint, payload);
                toast.success(`${tabActiva.label.slice(0, -1)} creada.`);
            }
            cerrarModal();
            cargarDatos();
        }catch (error){
            toast.error(error.response?.data?.message || 'Error al guardar.');
        }finally{
            setGuardando(false);
        }
    }

    async function eliminarRegistro(registro){
        setEliminandoId(registro.id);
        try{
            await api.delete(`${tabActiva.endpoint}/${registro.id}`);
            toast.success('Registro eliminado correctamente.');
            setConfirmandoId(null);
            cargarDatos();
        }catch (error){
            toast.error(error.response?.data?.message || 'Error al eliminar.');
        }finally{
            setEliminandoId(null);
        }
    }

    return(
        <DashboardLayout items={ADMIN_MENU} brandLabel="Administrador de TI" breadcrumb="Configuración" pageTitle="Gestión de Catálogos">
            <Toaster position="top-right" reverseOrder={false}/>

            {/* Pestañas de navegación */}
            <div className="flex space-x-1 bg-slate-100/50 p-1 rounded-xl mb-6 overflow-x-auto">
                {TABS.map((tab) => {
                    const Icono = tab.icon;
                    const isActive = tabActiva.id === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setTabActiva(tab)}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                                isActive 
                                ? 'bg-white text-orange-500 shadow-sm border border-slate-200' 
                                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
                            }`}
                        >
                            <Icono className="w-4 h-4" />
                            {tab.label}
                        </button>
                    );
                })}
            </div>

            {/*Encabezado con botón*/}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <p className="text-sm text-slate-500">{tabActiva.desc}</p>
                <button onClick={abrirModalCrear} className="bg-orange-500 text-white px-5 py-2.5 rounded-lg hover:bg-orange-600 font-semibold transition-colors shadow-sm whitespace-nowrap">
                    + Nueva {tabActiva.label.slice(0, -1).toLowerCase()}
                </button>
            </div>

            {/*Modal crear/editar*/}
            {mostrarModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md relative">
                        <button onClick={cerrarModal} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 font-bold text-xl">&times;</button>
                        <h2 className="text-xl font-bold mb-5 text-slate-800">
                            {registroEditando ? 'Editar' : 'Nueva'} {tabActiva.label.slice(0, -1).toLowerCase()}
                        </h2>

                        <form onSubmit={manejarEnvio} className="flex flex-col gap-5">
                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-medium text-slate-700">Nombre:</label>
                                <input type="text" required maxLength={255}
                                className="border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-orange-500"
                                value={formulario.name}
                                onChange={(e) => setFormulario({ ...formulario, name: e.target.value })} placeholder="Escribe el nombre..."/>
                            </div>

                            {/* Solo mostramos la descripción si estamos en la pestaña de Categorías */}
                            {tabActiva.id === 'categorias' && (
                                <div className="flex flex-col gap-1">
                                    <label className="text-sm font-medium text-slate-700">Descripción <span className="text-slate-400 font-normal">(opcional)</span>:</label>
                                    <textarea rows={3} maxLength={255} className="border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-orange-500 resize-none"
                                    value={formulario.description} onChange={(e) => setFormulario({...formulario, description: e.target.value})}
                                    placeholder="Breve descripción"/>
                                </div>
                            )}

                            <button type="submit" disabled={guardando} className="mt-2 bg-orange-500 text-white px-4 py-2.5 rounded-lg hover:bg-orange-600 font-semibold transition-colors disabled:opacity-60 disabled:cursor-not-allowed">
                                {guardando ? 'Guardando...' : 'Guardar cambios'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/*Tabla*/}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-100">
                    <h3 className="text-lg font-semibold text-slate-800">{tabActiva.label} registradas</h3>
                    <span className="bg-orange-50 text-orange-500 text-xs font-bold px-2.5 py-0.5 rounded-full border border-orange-100">
                        {registros.length}
                    </span>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-500">
                        <thead className="bg-white border-b border-slate-100 text-xs uppercase tracking-wider text-slate-400 font-semibold">
                            <tr>
                                <th className="px-6 py-4">Nombre</th>
                                {tabActiva.id === 'categorias' && <th className="px-6 py-4">Descripción</th>}
                                <th className="px-6 py-4 w-40 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                        {cargando && (
                            <tr><td colSpan={3} className="px-6 py-10 text-center text-sm text-slate-500">Cargando datos...</td></tr>
                        )}

                        {!cargando && registros.length === 0 && (
                            <tr>
                                <td colSpan={3} className="px-6 py-12 text-center">
                                    <div className="flex flex-col items-center gap-3">
                                        <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center">
                                            <Tag className="w-6 h-6"/>
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-slate-700">No hay registros</p>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        )}

                        {!cargando && registros.map((registro) => {
                            const confirmando = confirmandoId === registro.id;
                            const eliminando = eliminandoId === registro.id;

                            return(
                                <tr key={registro.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4 font-semibold text-slate-700">{registro.name}</td>
                                    
                                    {tabActiva.id === 'categorias' && (
                                        <td className="px-6 py-4 text-slate-500">
                                            {registro.description || <span className="italic text-slate-400">Sin descripción</span>}
                                        </td>
                                    )}
                                    
                                    <td className="px-6 py-4 text-right">
                                        {confirmando ? (
                                        <div className="flex items-center justify-end gap-2">
                                            <button onClick={() => eliminarRegistro(registro)} disabled={eliminando} className="rounded-md bg-red-600 px-3 py-1 text-xs font-medium text-white hover:bg-red-700 disabled:opacity-60">
                                                {eliminando ? 'Eliminando...' : 'Sí, eliminar'}
                                            </button>
                                            <button onClick={() => setConfirmandoId(null)} disabled={eliminando} className="rounded-md border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600 hover:bg-slate-50">Cancelar</button>
                                        </div>
                                        ) : (
                                        <div className="flex items-center justify-end gap-2">
                                            <button onClick={() => abrirModalEditar(registro)} className="text-slate-400 hover:text-orange-500 transition-colors p-1" title="Editar"><Pencil className="w-4 h-4"/></button>
                                            <button onClick={() => setConfirmandoId(registro.id)} className="text-slate-400 hover:text-red-600 transition-colors p-1" title="Eliminar"><Trash2 className="w-4 h-4"/></button>
                                        </div>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                        </tbody>
                    </table>
                </div>
            </div>
        </DashboardLayout>
    );
}