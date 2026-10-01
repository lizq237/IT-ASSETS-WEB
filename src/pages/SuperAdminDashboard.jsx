import { Building2, Plus, Settings, ShieldCheck, Trash2, UserCog, Users } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import RegisterForm from '../components/RegisterForm';
import DashboardLayout from '../components/layout/DashboardLayout';
import StatCard from '../components/layout/StatCard';
import api from '../services/api';

const MENU_ITEMS = [
    { to: '/super-admin', label: 'Dashboard', icon: Building2, end: true },
    { to: '/super-admin/organizaciones', label: 'Organizaciones', icon: Building2 },
    { to: '/super-admin/ajustes', label: 'Configuración', icon: Settings },
];

function formatDate(iso) {
    if (!iso) return '—';
    const d = new Date(iso);
    return d.toLocaleDateString('es-MX', {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
    });
}

export default function SuperAdminDashboard() {
    const [organizations, setOrganizations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [tableError, setTableError] = useState('');
    const [showRegister, setShowRegister] = useState(false);

    const [confirmingId, setConfirmingId] = useState(null);
    const [deletingId, setDeletingId] = useState(null);

    async function fetchOrganizations() {
    setLoading(true);
    setError('');
    try {
        const { data } = await api.get('/organizaciones');
        // Acepta la respuesta si viene directamente como arreglo, o si viene dentro de data.data
        setOrganizations(Array.isArray(data) ? data : (data.data ?? []));
    } catch {
        setError('No se pudieron cargar las organizaciones.');
    } finally {
        setLoading(false);
    }
}

    useEffect(() => {
        fetchOrganizations();
    }, []);

    const stats = useMemo(() => {
        const totalOrgs = organizations.length;
        const totalUsers = organizations.reduce(
        (acc, o) => acc + (o.users_count ?? 0),
        0
        );
        const lastOrg = organizations[0];
        return { totalOrgs, totalUsers, lastOrg };
    }, [organizations]);

    function handleRegistered() {
        setShowRegister(false);
        fetchOrganizations();
    }

    async function handleDelete(org) {
        setDeletingId(org.id);
        setTableError('');
        try {
        await api.delete(`/organizaciones/${org.id}`);
        setOrganizations((prev) => prev.filter((o) => o.id !== org.id));
        setConfirmingId(null);
        } catch (err) {
        setTableError(
            err.response?.data?.message ||
            `No se pudo eliminar "${org.company_name}". Intenta de nuevo.`
        );
        } finally {
        setDeletingId(null);
        }
    }

    return (
        <DashboardLayout
        items={MENU_ITEMS}
        brandLabel="Super Administrador"
        breadcrumb="Panel maestro"
        pageTitle="Bienvenido SuperAdmin de SysBase"
        >
        {/* Stats */}
        <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
            label="Organizaciones"
            value={stats.totalOrgs}
            caption="registradas en la plataforma"
            Icon={Building2}
            accent="orange"
            />
            <StatCard
            label="Usuarios totales"
            value={stats.totalUsers}
            caption="en todas las organizaciones"
            Icon={Users}
            accent="blue"
            />
            <StatCard
            label="Última alta"
            value={stats.lastOrg ? formatDate(stats.lastOrg.created_at) : '—'}
            caption={stats.lastOrg?.company_name ?? 'Sin registros'}
            Icon={ShieldCheck}
            accent="emerald"
            />
            <StatCard
            label="Administradores TI"
            value={stats.totalOrgs}
            caption="uno por organización"
            Icon={UserCog}
            />
        </div>

        {/* Registro de nueva empresa */}
        <div className="mb-8">
            {!showRegister ? (
            <button
                type="button"
                onClick={() => setShowRegister(true)}
                className="flex items-center gap-2 rounded-lg bg-sysbase-orange px-5 py-2.5 text-sm font-medium text-white shadow-sm shadow-sysbase-orange/30 transition-colors hover:bg-sysbase-orange-dark"
            >
                <Plus className="h-4 w-4" />
                Registrar nueva organización
            </button>
            ) : (
            <div>
                <div className="mb-3 flex items-center justify-between">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
                    Alta de organización
                </h2>
                <button
                    type="button"
                    onClick={() => setShowRegister(false)}
                    className="text-sm text-slate-500 hover:text-sysbase-orange"
                >
                    Cancelar
                </button>
                </div>
                <RegisterForm onSuccess={handleRegistered} />
            </div>
            )}
        </div>

        {/* Tabla de organizaciones */}
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 p-5">
            <div className="flex items-center gap-3">
                <h3 className="font-semibold text-slate-800">Organizaciones registradas</h3>
                <span className="rounded-full border border-orange-100 bg-orange-50 px-2 py-0.5 text-[11px] font-bold text-sysbase-orange">
                {stats.totalOrgs}
                </span>
            </div>
            </div>

            {tableError && (
            <div className="border-b border-red-100 bg-red-50 px-5 py-3 text-sm text-red-700">
                {tableError}
            </div>
            )}

            {loading && (
            <p className="px-6 py-10 text-center text-sm text-slate-500">Cargando...</p>
            )}

            {!loading && error && (
            <p className="px-6 py-10 text-center text-sm text-red-600">{error}</p>
            )}

            {!loading && !error && organizations.length === 0 && (
            <p className="px-6 py-10 text-center text-sm text-slate-500">
                Aún no hay organizaciones registradas.
            </p>
            )}

            {!loading && !error && organizations.length > 0 && (
            <div className="overflow-x-auto">
                <table className="w-full text-left whitespace-nowrap">
                <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/50">
                    <th className="w-20 px-6 py-4 text-[10px] font-semibold uppercase tracking-wider text-slate-400">ID</th>
                    <th className="px-6 py-4 text-[10px] font-semibold uppercase tracking-wider text-slate-400">Nombre</th>
                    <th className="w-40 px-6 py-4 text-[10px] font-semibold uppercase tracking-wider text-slate-400">Correo</th>
                    <th className="w-32 px-6 py-4 text-[10px] font-semibold uppercase tracking-wider text-slate-400">Usuarios</th>
                    <th className="w-40 px-6 py-4 text-[10px] font-semibold uppercase tracking-wider text-slate-400">Alta</th>
                    <th className="w-16 px-6 py-4" />
                    </tr>
                </thead>
                                <tbody className="divide-y divide-slate-100">
                    {organizations.map((org) => {
                        // Mapeo seguro de variables
                        const nombreEmpresa = org.empresa_nombre || org.name || 'Sin Nombre';
                        const identificador = org.rfc || org.email || '—';
                        const fechaFormateada = org.created_at 
                            ? new Date(org.created_at).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })
                            : '01 oct 2026';

                        return (
                            <tr key={org.id} className="transition hover:bg-slate-50/80">
                                {/* ID */}
                                <td className="px-4 py-3 font-mono text-xs text-slate-400">
                                    #{String(org.id).padStart(4, '0')}
                                </td>

                                {/* NOMBRE DE LA ORGANIZACIÓN */}
                                <td className="px-4 py-3 font-semibold text-slate-700">
                                    {nombreEmpresa}
                                </td>

                                {/* RFC / EMAIL */}
                                <td className="px-4 py-3 text-slate-500">
                                    {identificador}
                                </td>

                                {/* USUARIOS */}
                                <td className="px-4 py-3">
                                    <span className="inline-flex items-center gap-1.5 rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-600">
                                        <Users className="h-3.5 w-3.5" />
                                        <span>{org.users_count ?? 0}</span>
                                    </span>
                                </td>

                                {/* FECHA DE ALTA */}
                                <td className="px-4 py-3 text-xs text-slate-500">
                                    {fechaFormateada}
                                </td>

                                {/* BOTÓN ELIMINAR */}
                                <td className="px-4 py-3 text-right">
                                    <button
                                        onClick={() => handleDelete(org)}
                                        className="rounded-lg p-1.5 text-slate-400 transition hover:bg-red-50 hover:text-red-500"
                                        title="Eliminar organización"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
                </table>
            </div>
            )}
        </div>
        </DashboardLayout>
    );
}