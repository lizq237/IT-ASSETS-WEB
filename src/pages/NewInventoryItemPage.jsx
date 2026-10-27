import { es } from 'date-fns/locale';
import { ArrowLeft, Calendar, Hash, Laptop, MapPin, Save, Tag as TagIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import DatePicker, { registerLocale } from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import CustomSelect from '../components/CustomSelect';
import DashboardLayout from '../components/layout/DashboardLayout';
import api from '../services/api';
import { ADMIN_MENU } from './AdminTIDashboard';

// Registrar español para el calendario
registerLocale('es', es);

export default function NewInventoryItemPage(){
  const navigate = useNavigate();
  const [categorias, setCategorias] = useState([]);
  const [guardando, setGuardando] = useState(false);
  const [errores, setErrores] = useState({});
  const [marcas, setMarcas] = useState([]);
  const [ubicaciones, setUbicaciones] = useState([]);

  const [form, setForm] = useState({
    category_id: '',
    code: '',
    serial_number: '',
    brand_id: '',
    model: '',
    location_id: '',
    status: 'activo',
    purchase_date: null,
  });

  useEffect(() => {
    Promise.all([
    api.get('/categories'),
    api.get('/brands'),
    api.get('/locations')
    ])
    .then(([resCat, resBrand, resLoc]) => {
      setCategorias(Array.isArray(resCat.data) ? resCat.data : resCat.data?.data || []);
      setMarcas(Array.isArray(resBrand.data) ? resBrand.data : resBrand.data?.data || []);
      setUbicaciones(Array.isArray(resLoc.data) ? resLoc.data : resLoc.data?.data || []);
    })
    .catch(() => toast.error('Error al cargar los catálogos'));
  }, []);
      

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if(errores[e.target.name]) setErrores({ ...errores, [e.target.name]: null });
  };

  const handleCustomChange = (name, value) => {
    setForm({ ...form, [name]: value });
    if(errores[name]) setErrores({ ...errores, [name]: null });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGuardando(true);
    setErrores({});

    // Formatear fecha antes de enviar
    const payload = { ...form };
    if(payload.purchase_date){
      // Conviertemos Date object a string YYYY-MM-DD
      payload.purchase_date = payload.purchase_date.toISOString().split('T')[0];
    }

    try{
      await api.post('/assets', payload);
      toast.success('Equipo registrado exitosamente.');
      navigate('/admin/inventario');
    }catch(error){
      if(error.response?.status === 422){
        setErrores(error.response.data.errors);
        toast.error('Revisa los errores en el formulario.');
      }else{
        toast.error(error.response?.data?.message || 'Error al registrar el equipo.');
      }
    }finally{
      setGuardando(false);
    }
  };

  const inputBase = "w-full bg-white border border-slate-300 text-slate-700 text-sm rounded-lg focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 block pl-10 p-2.5 outline-none transition-all";
  const labelBase = "text-sm font-semibold text-slate-700 mb-1.5 flex items-center gap-2";
  const iconBase = "absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400";

  // Opciones para los selects
  const opcionesCategoria = categorias.map(c => ({ value: c.id, label: c.name }));
  const opcionesMarca = marcas.map(m => ({ value: m.id, label: m.name }));
  const opcionesUbicacion = ubicaciones.map(u => ({ value: u.id, label: u.name }));

  return(
    <DashboardLayout items={ADMIN_MENU} brandLabel="Administrador de TI" breadcrumb="Gestión de inventario" pageTitle="Registrar equipo">
      <Toaster position="top-right" reverseOrder={false} />
      
      <div className="max-w-4xl mx-auto">
        <button onClick={() => navigate('/admin/inventario')} className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-orange-500 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4"/> Volver al inventario
        </button>

        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
          <div className="bg-slate-50/50 border-b border-slate-100 p-6 sm:p-8">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <Laptop className="w-6 h-6 text-orange-500"/>
              Información del equipo
            </h2>
            <p className="text-sm text-slate-500 mt-2">
              Ingresa los detalles del nuevo activo. Los campos con <span className="text-red-500 font-bold">*</span> son obligatorios.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 sm:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              {/*Categoría*/}
              <div>
                <label className={labelBase}><TagIcon className="w-4 h-4 text-slate-400"/> Categoría <span className="text-red-500">*</span></label>
                <CustomSelect options={opcionesCategoria} value={form.category_id} onChange={(val) => handleCustomChange('category_id', val)} placeholder="Selecciona una categoría" Icon={TagIcon}
                />
                {errores.category_id && <p className="text-xs font-medium text-red-500 mt-1.5">{errores.category_id[0]}</p>}
              </div>

              {/*Código del equipo*/}
              <div>
                <label className={labelBase}><Hash className="w-4 h-4 text-slate-400"/> Código del equipo <span className="text-red-500">*</span></label>
                <div className="relative">
                  <div className={iconBase}><Hash className="w-4 h-4"/></div>
                  <input type="text" name="code" value={form.code} onChange={handleChange} className={inputBase} placeholder="Ej. LAP-001" required />
                </div>
                {errores.code && <p className="text-xs font-medium text-red-500 mt-1.5">{errores.code[0]}</p>}
              </div>

              {/*Número de serie*/}
              <div>
                <label className={labelBase}>Número de serie</label>
                <div className="relative">
                  <div className={iconBase}><Hash className="w-4 h-4"/></div>
                  <input type="text" name="serial_number" value={form.serial_number} onChange={handleChange} className={inputBase} placeholder="Ej. 45G-XXXX" />
                </div>
                {errores.serial_number && <p className="text-xs font-medium text-red-500 mt-1.5">{errores.serial_number[0]}</p>}
              </div>

              {/*Marca (Actualizado)*/}
              <div>
                <label className={labelBase}><TagIcon className="w-4 h-4 text-slate-400" /> Marca</label>
                <CustomSelect options={opcionesMarca} value={form.brand_id} onChange={(val) => handleCustomChange('brand_id', val)} placeholder="Selecciona una marca" Icon={TagIcon} />
                {errores.brand_id && <p className="text-xs font-medium text-red-500 mt-1.5">{errores.brand_id[0]}</p>}
              </div>

              {/*Modelo*/}
              <div>
                <label className={labelBase}><Laptop className="w-4 h-4 text-slate-400"/> Modelo <span className="text-red-500">*</span></label>
                <div className="relative">
                  <div className={iconBase}><Laptop className="w-4 h-4"/></div>
                  <input type="text" name="model" value={form.model} onChange={handleChange} className={inputBase} placeholder="Ej. EliteBook 840" required />
                </div>
                {errores.model && <p className="text-xs font-medium text-red-500 mt-1.5">{errores.model[0]}</p>}
              </div>

              {/*Ubicación (Actualizado)*/}
              <div>
                <label className={labelBase}><MapPin className="w-4 h-4 text-slate-400"/> Ubicación / Aula</label>
                <CustomSelect options={opcionesUbicacion} value={form.location_id} onChange={(val) => handleCustomChange('location_id', val)} placeholder="Selecciona una ubicación" Icon={MapPin} />
                {errores.location_id && <p className="text-xs font-medium text-red-500 mt-1.5">{errores.location_id[0]}</p>}
              </div>

              {/*Fecha*/}
              <div>
                <label className={labelBase}><Calendar className="w-4 h-4 text-slate-400"/> Fecha de compra</label>
                <div className="relative custom-datepicker">
                  <div className={iconBase}><Calendar className="w-4 h-4"/></div>
                  <DatePicker selected={form.purchase_date} onChange={(date) => handleCustomChange('purchase_date', date)} locale="es" dateFormat="dd/MM/yyyy" className={inputBase} placeholderText="dd/mm/aaaa" showPopperArrow={false} isClearable/>
                </div>
                {errores.purchase_date && <p className="text-xs font-medium text-red-500 mt-1.5">{errores.purchase_date[0]}</p>}
              </div>

            </div>

            <div className="flex justify-end gap-3 mt-10 pt-6 border-t border-slate-100">
              <button type="button" onClick={() => navigate('/admin/inventario')} className="px-5 py-2.5 rounded-lg text-sm font-semibold text-slate-600 bg-white border border-slate-300 hover:bg-slate-50 transition-colors">
                Cancelar
              </button>
              <button type="submit" disabled={guardando} className="flex items-center gap-2 bg-orange-500 text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-orange-600 transition-colors disabled:opacity-60 shadow-md shadow-orange-500/20">
                <Save className="w-4 h-4"/>
                {guardando ? 'Guardando...' : 'Guardar equipo'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}