import { Pencil, Tag, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import DashboardLayout from '../components/layout/DashboardLayout';
import api from '../services/api';
import { ADMIN_MENU } from './AdminTIDashboard';

const FORM_VACIO = { name: '', description: '' };

export default function AdminCategorias(){
    const [categorias, setCategorias] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [mostrarModal, setMostrarModal] = useState(false);
    const [categoriaEditando, setCategoriaEditando] = useState(null);
    const [formulario, setFormulario] = useState(FORM_VACIO);
    const [guardando, setGuardando] = useState(false);
    const [confirmandoId, setConfirmandoId] = useState(null);
    const [eliminandoId, setEliminandoId] = useState(null);

    async function cargarCategorias(){
        setCargando(true);
        try{
        const { data } = await api.get('/categories');
        setCategorias(data);
        }catch (error){
        toast.error('Error al cargar las categorías.');
        console.error(error);
        }finally{
        setCargando(false);
        }
    }

    useEffect(() => {
        cargarCategorias();
    }, []);

    function abrirModalCrear(){
        setFormulario(FORM_VACIO);
        setCategoriaEditando(null);
        setMostrarModal(true);
    }

    function abrirModalEditar(categoria){
        setFormulario({
        name: categoria.name ?? '',
        description: categoria.description ?? '',
        });
        setCategoriaEditando(categoria);
        setMostrarModal(true);
    }

    function cerrarModal(){
        setMostrarModal(false);
        setFormulario(FORM_VACIO);
        setCategoriaEditando(null);
    }

    async function manejarEnvio(e){
        e.preventDefault();
        setGuardando(true);

        try{
        if(categoriaEditando){
            await api.put(`/categories/${categoriaEditando.id}`, formulario);
            toast.success('Categoría actualizada correctamente.');
        }else{
            await api.post('/categories', formulario);
            toast.success('Categoría creada correctamente.');
        }
        cerrarModal();
        cargarCategorias();
        }catch (error){
        const mensaje =
            error.response?.data?.message ||
            (categoriaEditando
            ? 'Error al actualizar la categoría.'
            : 'Error al crear la categoría.');
        toast.error(mensaje);
        console.error(error);
        }finally{
        setGuardando(false);
        }
    }

    async function eliminarCategoria(categoria){
        setEliminandoId(categoria.id);
        try{
        await api.delete(`/categories/${categoria.id}`);
        toast.success('Categoría eliminada correctamente.');
        setConfirmandoId(null);
        cargarCategorias();
        }catch (error){
        toast.error(
            error.response?.data?.message || 'Error al eliminar la categoría.'
        );
        console.error(error);
        }finally{
        setEliminandoId(null);
        }
    }

    return(
        <DashboardLayout items={ADMIN_MENU} brandLabel="Administrador de TI" breadcrumb="Gestión de inventario" pageTitle="Categorías">
            <Toaster position="top-right" reverseOrder={false}/>

            {/*Encabezado con botón*/}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <p className="text-sm text-slate-500"> Las categorías agrupan los equipos de tu organización (laptops, monitores, routers, etc.).</p>
                <button onClick={abrirModalCrear} className="bg-orange-500 text-white px-5 py-2.5 rounded-lg hover:bg-orange-600 font-semibold transition-colors shadow-sm whitespace-nowrap">
                    + Nueva categoría
                </button>
            </div>

            {/*Modal crear/editar*/}
            {mostrarModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md relative">
                        <button onClick={cerrarModal} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 font-bold text-xl" aria-label="Cerrar">
                            &times;
                        </button>

                        <h2 className="text-xl font-bold mb-5 text-slate-800">
                            {categoriaEditando ? 'Editar categoría' : 'Nueva categoría'}
                        </h2>

                        <form onSubmit={manejarEnvio} className="flex flex-col gap-5">
                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-medium text-slate-700">
                                    Nombre:
                                </label>
                                <input type="text" required maxLength={255}
                                className="border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-orange-500"
                                value={formulario.name}
                                onChange={(e) => setFormulario({ ...formulario, name: e.target.value })} placeholder="Ej. Laptops"/>
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-medium text-slate-700">
                                    Descripción{' '}
                                    <span className="text-slate-400 font-normal">(opcional)</span>:
                                </label>
                                <textarea rows={3} maxLength={255} className="border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-orange-500 resize-none"
                                value={formulario.description} onChange={(e) => setFormulario({...formulario, description: e.target.value,})}
                                placeholder="Breve descripción de la categoría"/>
                            </div>

                            <button
                                type="submit"
                                disabled={guardando}
                                className="mt-2 bg-orange-500 text-white px-4 py-2.5 rounded-lg hover:bg-orange-600 font-semibold transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {guardando
                                ? 'Guardando...'
                                : categoriaEditando
                                ? 'Guardar cambios'
                                : 'Crear categoría'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/*Tabla*/}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-100">
                    <h3 className="text-lg font-semibold text-slate-800">
                        Categorías registradas
                    </h3>
                    <span className="bg-orange-50 text-orange-500 text-xs font-bold px-2.5 py-0.5 rounded-full border border-orange-100">
                        {categorias.length}
                    </span>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-500">
                        <thead className="bg-white border-b border-slate-100 text-xs uppercase tracking-wider text-slate-400 font-semibold">
                            <tr>
                                <th className="px-6 py-4">Nombre</th>
                                <th className="px-6 py-4">Descripción</th>
                                <th className="px-6 py-4 w-40" title="Se activará cuando se implemente el módulo de Equipos">Equipos asociados</th>
                                <th className="px-6 py-4 w-40 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                        {cargando && (
                            <tr>
                                <td colSpan={4} className="px-6 py-10 text-center text-sm text-slate-500">
                                    Cargando categorías...
                                </td>
                            </tr>
                        )}

                        {!cargando && categorias.length === 0 && (
                            <tr>
                                <td colSpan={4} className="px-6 py-12 text-center">
                                    <div className="flex flex-col items-center gap-3">
                                        <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center">
                                            <Tag className="w-6 h-6"/>
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-slate-700">No hay categorías registradas</p>
                                            <p className="text-xs text-slate-500 mt-1">Crea la primera categoría para clasificar los equipos de tu organización.</p>
                                        </div>
                                        <button onClick={abrirModalCrear} className="mt-2 text-sm text-orange-500 hover:text-orange-600 font-semibold">
                                            + Nueva categoría
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        )}

                        {!cargando &&
                            categorias.map((categoria) => {
                            const confirmando = confirmandoId === categoria.id;
                            const eliminando = eliminandoId === categoria.id;

                            return(
                                <tr key={categoria.id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4 font-semibold text-slate-700">
                                    {categoria.name}
                                </td>
                                <td className="px-6 py-4 text-slate-500">
                                    {categoria.description || (
                                    <span className="italic text-slate-400">
                                        Sin descripción
                                    </span>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-slate-600 font-medium">
                                    {categoria.assets_count || 0} equipos
                                </td>
                                <td className="px-6 py-4 text-right">
                                    {confirmando ? (
                                    <div className="flex items-center justify-end gap-2">
                                        <button onClick={() => eliminarCategoria(categoria)} disabled={eliminando} className="rounded-md bg-red-600 px-3 py-1 text-xs font-medium text-white hover:bg-red-700 disabled:opacity-60 disabled:cursor-not-allowed">
                                            {eliminando ? 'Eliminando...' : 'Sí, eliminar'}
                                        </button>
                                        <button onClick={() => setConfirmandoId(null)} disabled={eliminando} className="rounded-md border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-60 disabled:cursor-not-allowed">
                                            Cancelar
                                        </button>
                                    </div>
                                    ) : (
                                    <div className="flex items-center justify-end gap-2">
                                        <button onClick={() => abrirModalEditar(categoria)} className="text-slate-400 hover:text-orange-500 transition-colors p-1" title="Editar" aria-label={`Editar ${categoria.name}`}>
                                            <Pencil className="w-4 h-4"/>
                                        </button>
                                        <button onClick={() => setConfirmandoId(categoria.id)} className="text-slate-400 hover:text-red-600 transition-colors p-1" title="Eliminar" aria-label={`Eliminar ${categoria.name}`}>
                                            <Trash2 className="w-4 h-4"/>
                                        </button>
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