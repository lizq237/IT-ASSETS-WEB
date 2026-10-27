import { Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import DashboardLayout from '../components/layout/DashboardLayout';
import api from '../services/api';
import { ADMIN_MENU } from './AdminTIDashboard';

export default function AdminUsuarios() {
    const [formulario, setFormulario] = useState({
        nombre: '', 
        correo: '', 
        contraseña: '', 
        rol: 'tecnico', 
    });

    const manejarEnvioFormulario = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/users', {
                name: formulario.nombre,
                email: formulario.correo,
                password: formulario.contraseña,
                role: formulario.rol
            });
            toast.success('Usuario registrado correctamente.');
            setFormulario({ nombre: '', correo: '', contraseña: '', rol: 'tecnico' });
            cargarUsuarios();
            setMostrarModalUsuarios(false);
            
        }catch (error){
            toast.error('Error al registrar usuario.');
            setFormulario({ nombre: '', correo: '', contraseña: '', rol: 'tecnico' });
            cargarUsuarios();
            setMostrarModalUsuarios(false);
        }
    };

    const [listaUsuarios, setListaUsuarios] = useState([]);

    const cargarUsuarios = async () => {
        try {
            const response = await api.get('/users');
            console.log('Datos de usuarios:', response.data);
            setListaUsuarios(response.data);
        } catch (error) {
            toast.error('Error al cargar usuarios.');
            console.error('Error al cargar la tabla:', error);
        }
    }

    useEffect(() => {
        cargarUsuarios();
    }, []);

    const [mostrarModalUsuarios, setMostrarModalUsuarios] = useState(false);

    const eliminarUsuario = async (id) => {
        const confirmacion = window.confirm('¿Estás seguro de que deseas eliminar este usuario?');
        if (!confirmacion) return;

        try {
            await api.delete(`/users/${id}`);
            toast.success('Usuario eliminado correctamente.');
            cargarUsuarios(); // recargar lista de usuarios
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error al eliminar usuario.');
            console.error('Error al eliminar usuario:', error);
        }
    };

    return(
        <DashboardLayout items={ADMIN_MENU} brandLabel="Administrador de TI" breadcrumb="Gestión de personal" pageTitle="Usuarios">
            <Toaster position="top-right" reverseOrder={false}/>
            <div className="flex justify-end mb-6">
                <button onClick={() => setMostrarModalUsuarios(true)} className="bg-orange-500 text-white px-5 py-2.5 rounded-lg hover:bg-orange-600 font-semibold transition-colors shadow-sm">
                    + Crear usuario
                </button>
            </div>

            {mostrarModalUsuarios && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md relative">
                        
                        <button onClick={() => setMostrarModalUsuarios(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 font-bold text-xl">
                            &times;
                        </button>
                        
                        <h2 className="text-xl font-bold mb-5 text-slate-800">Registrar nuevo usuario</h2>

                        <form onSubmit={manejarEnvioFormulario} className="flex flex-col gap-5">
                            
                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-medium text-slate-700">Nombre:</label>
                                <input type="text" className="border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-orange-500" value={formulario.nombre} onChange={(e) => setFormulario({...formulario, nombre: e.target.value})}/>
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-medium text-slate-700">Correo:</label>
                                <input type="email" className="border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-orange-500" value={formulario.correo} onChange={(e) => setFormulario({...formulario, correo: e.target.value})}/>
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-medium text-slate-700">Contraseña:</label>
                                <input type="password" className="border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-orange-500" value={formulario.contraseña} onChange={(e) => setFormulario({...formulario, contraseña: e.target.value})}/>
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-medium text-slate-700">Rol:</label>
                                <select className="border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-orange-500" value={formulario.rol} onChange={(e) => setFormulario({...formulario, rol: e.target.value})}>
                                    <option value="tecnico">Técnico</option>
                                    <option value="responsable">Responsable</option>
                                </select>
                            </div>

                            <button
                                type="submit"
                                className="mt-2 bg-orange-500 text-white px-4 py-2.5 rounded-lg hover:bg-orange-600 font-semibold transition-colors"
                            >
                                Registrar usuario
                            </button>
                        </form>
                    </div>
                </div>
            )}

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-100">
                    <h3 className="text-lg font-semibold text-slate-800">Usuarios registrados</h3>
                    <span className="bg-orange-50 text-orange-500 text-xs font-bold px-2.5 py-0.5 rounded-full border border-orange-100">
                        {listaUsuarios?.length || 0}
                    </span>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-500">
                        <thead className="bg-white border-b border-slate-100 text-xs uppercase tracking-wider text-slate-400 font-semibold">
                            <tr>
                                <th className="px-6 py-4">Nombre</th>
                                <th className="px-6 py-4">Correo</th>
                                <th className="px-6 py-4">Rol</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {listaUsuarios?.map((usuario) => (
                                <tr key={usuario.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4 font-semibold text-slate-700">{usuario.name}</td>
                                    <td className="px-6 py-4">{usuario.email}</td>
                                    <td className="px-6 py-4 capitalize">{usuario.role}</td>
                                    <td className="px-6 py-4">
                                        <button onClick={() => eliminarUsuario(usuario.id)} className="text-red-500 hover:text-red-700">
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {listaUsuarios?.length === 0 && (
                        <div className="p-8 text-center text-sm text-slate-500">
                            No hay usuarios registrados aún.
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}