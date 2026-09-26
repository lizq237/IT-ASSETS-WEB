import { useState } from 'react';
import api from '../services/api';

const EMPTY = {
    empresa_nombre: '',
    rfc: '',
    admin_nombre: '',
    email: '',
    password: '',
};

export default function RegisterForm({onSuccess}) {
    const [form, setForm] = useState(EMPTY);
    const [errors, setErrors] = useState({});
    const [generalError, setGeneralError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
}

async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    setGeneralError('');
    setSuccess('');

    try {
        const { data } = await api.post('/register-tenant', form);
        setSuccess(`Empresa "${data.organization.company_name}" registrada correctamente.`);
        setForm(EMPTY);
        onSuccess?.(data);
    } catch (err) {
        const status = err.response?.status;
        const payload = err.response?.data;

    if (status === 422 && payload?.errors) {
        setErrors(payload.errors);
    } else if (status === 401 || status === 403) {
        setGeneralError('No tienes permisos para registrar empresas.');
    } else {
        setGeneralError(
        payload?.message || 'Ocurrió un error al registrar la empresa.'
        );
    }
    } finally {
        setLoading(false);
    }
}

function fieldError(name) {
    return errors[name]?.[0];
}

const inputClass =
    'w-full rounded-lg border border-transparent bg-sysbase-gray px-4 py-3 text-sm text-sysbase-dark transition focus:border-sysbase-orange focus:bg-sysbase-white focus:outline-none focus:ring-4 focus:ring-sysbase-orange/15';
const labelClass = 'mb-1 block text-sm font-medium text-sysbase-dark';
const errorClass = 'mt-1 text-xs text-red-600';

return (
    <div className="rounded-2xl bg-sysbase-white p-8 shadow-sm">
        <h2 className="text-xl font-bold text-sysbase-dark">
            Registrar nueva empresa
        </h2>
        <p className="mb-6 mt-1 text-sm text-sysbase-dark/60">
            Da de alta una nueva organización y su administrador principal.
        </p>

        {success && (
            <div className="mb-5 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            {success}
            </div>
        )}

        {generalError && (
            <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {generalError}
            </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div>
                <label htmlFor="empresa_nombre" className={labelClass}>
                    Nombre de la empresa / institución
                </label>
                <input
                    id="empresa_nombre"
                    name="empresa_nombre"
                    type="text"
                    value={form.empresa_nombre}
                    onChange={handleChange}
                    required
                    maxLength={255}
                    className={inputClass}
                    placeholder="Ej. Facultad de Informática Culiacán"
                />
                {fieldError('empresa_nombre') && (
                    <p className={errorClass}>{fieldError('empresa_nombre')}</p>
                )}
            </div>

            <div>
                <label htmlFor="rfc" className={labelClass}>
                    RFC <span className="text-sysbase-dark/40">(opcional)</span>
                </label>
                <input
                    id="rfc"
                    name="rfc"
                    type="text"
                    value={form.rfc}
                    onChange={handleChange}
                    maxLength={13}
                    className={inputClass}
                    placeholder="XAXX010101000"
                />
                {fieldError('rfc') && (
                    <p className={errorClass}>{fieldError('rfc')}</p>
                )}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
                <div>
                    <label htmlFor="admin_nombre" className={labelClass}>
                    Nombre del administrador
                    </label>
                    <input
                        id="admin_nombre"
                        name="admin_nombre"
                        type="text"
                        value={form.admin_nombre}
                        onChange={handleChange}
                        required
                        maxLength={255}
                        className={inputClass}
                        placeholder="Juan Pérez"
                    />
                    {fieldError('admin_nombre') && (
                        <p className={errorClass}>{fieldError('admin_nombre')}</p>
                    )}
                </div>

                <div>
                    <label htmlFor="email" className={labelClass}>
                        Correo del administrador
                    </label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                        autoComplete="off"
                        className={inputClass}
                        placeholder="admin@empresa.com"
                    />
                    {fieldError('email') && (
                        <p className={errorClass}>{fieldError('email')}</p>
                    )}
                </div>
            </div>

            <div>
                <label htmlFor="password" className={labelClass}>
                Contraseña del administrador
                </label>
                <input
                    id="password"
                    name="password"
                    type="password"
                    value={form.password}
                    onChange={handleChange}
                    required
                    minLength={8}
                    autoComplete="new-password"
                    className={inputClass}
                    placeholder="Mínimo 8 caracteres"
                />
                {fieldError('password') && (
                    <p className={errorClass}>{fieldError('password')}</p>
                )}
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full rounded-full bg-sysbase-orange px-6 py-3 text-sm font-bold uppercase tracking-wide text-sysbase-white shadow-lg shadow-sysbase-orange/30 transition hover:bg-sysbase-orange-dark disabled:cursor-not-allowed disabled:opacity-60"
            >
                {loading ? 'Registrando...' : 'Registrar empresa'}
            </button>
        </form>
    </div>
  );
}