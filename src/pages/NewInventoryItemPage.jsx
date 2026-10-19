
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import { ADMIN_MENU } from './AdminTIDashboard';
import {
  obtenerCategorias,
  registrarEquipo,
} from '../services/inventory';

const inicial = {
  category_id: '',
  code: '',
  serial_number: '',
  brand: '',
  model: '',
  location: '',
  status: 'activo',
  purchase_date: '',
};

export default function NewInventoryItemPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState(inicial);
  const [categorias, setCategorias] = useState([]);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    obtenerCategorias()
      .then((data) => {
        setCategorias(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        setError('No se pudieron cargar las categorías.');
      });
  }, []);

  function cambiar(event) {
    const { name, value } = event.target;
    setForm((actual) => ({
      ...actual,
      [name]: value,
    }));
  }

  async function guardar(event) {
    event.preventDefault();
    setError('');
    setGuardando(true);

    try {
      const datos = {
        category_id: Number(form.category_id),
        code: form.code.trim(),
        serial_number: form.serial_number.trim() || null,
        brand: form.brand.trim() || null,
        model: form.model.trim(),
        location: form.location.trim() || null,
        status: form.status,
        purchase_date: form.purchase_date || null,
      };

      await registrarEquipo(datos);
      navigate('/admin/inventario', {
        state: { mensaje: 'Equipo registrado correctamente.' },
      });
    } catch (err) {
      const errores = err.response?.data?.errors;
      const primerError = errores
        ? Object.values(errores).flat()[0]
        : null;

      setError(
        primerError ||
        err.response?.data?.message ||
        'No se pudo registrar el equipo.'
      );
    } finally {
      setGuardando(false);
    }
  }

  const inputClass =
    'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm';

  return (
    <DashboardLayout
      items={ADMIN_MENU}
      brandLabel="Administrador de TI"
      breadcrumb="Gestión de inventario"
      pageTitle="Registrar equipo"
    >
      <div className="mx-auto max-w-3xl rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="mb-6 text-sm text-slate-500">
          Ingresa la información del nuevo equipo de tu organización.
        </p>

        {error && (
          <div className="mb-5 rounded-lg bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={guardar} className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <label className="text-sm">
            Categoría *
            <select
              name="category_id"
              value={form.category_id}
              onChange={cambiar}
              required
              className={inputClass}
            >
              <option value="">Selecciona una categoría</option>
              {categorias.map((categoria) => (
                <option key={categoria.id} value={categoria.id}>
                  {categoria.name}
                </option>
              ))}
            </select>
          </label>

          <label className="text-sm">
            Código del equipo *
            <input
              name="code"
              value={form.code}
              onChange={cambiar}
              required
              className={inputClass}
            />
          </label>

          <label className="text-sm">
            Número de serie
            <input
              name="serial_number"
              value={form.serial_number}
              onChange={cambiar}
              className={inputClass}
            />
          </label>

          <label className="text-sm">
            Marca
            <input
              name="brand"
              value={form.brand}
              onChange={cambiar}
              className={inputClass}
            />
          </label>

          <label className="text-sm">
            Modelo *
            <input
              name="model"
              value={form.model}
              onChange={cambiar}
              required
              className={inputClass}
            />
          </label>

          <label className="text-sm">
            Ubicación
            <input
              name="location"
              value={form.location}
              onChange={cambiar}
              className={inputClass}
            />
          </label>

          <label className="text-sm">
            Estado *
            <select
              name="status"
              value={form.status}
              onChange={cambiar}
              required
              className={inputClass}
            >
              <option value="activo">Activo</option>
              <option value="mantenimiento">Mantenimiento</option>
              <option value="baja">Baja</option>
            </select>
          </label>

          <label className="text-sm">
            Fecha de compra
            <input
              type="date"
              name="purchase_date"
              value={form.purchase_date}
              onChange={cambiar}
              className={inputClass}
            />
          </label>

          <div className="flex justify-end gap-3 border-t border-slate-100 pt-5 sm:col-span-2">
            <Link
              to="/admin/inventario"
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm"
            >
              Cancelar
            </Link>

            <button
              type="submit"
              disabled={guardando}
              className="rounded-lg bg-orange-500 px-5 py-2 text-sm font-semibold text-white disabled:opacity-50"
            >
              {guardando ? 'Guardando...' : 'Registrar equipo'}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
