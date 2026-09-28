import { useState, useEffect } from 'react';

export default function App() {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'empleado',
    organization_id: 'org_main_01'
  });
  const [message, setMessage] = useState({ text: '', type: '' });

  const fetchUsers = async () => {
    try {
      const res = await fetch('http://127.0.0.1:8000/users?organization_id=org_main_01');
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
    } catch (err) {
      console.error('Error cargando usuarios:', err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ text: '', type: '' });

    try {
      const res = await fetch('http://127.0.0.1:8000/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (res.ok) {
        setMessage({ text: 'Usuario registrado con éxito', type: 'success' });
        setFormData({ name: '', email: '', password: '', role: 'empleado', organization_id: 'org_main_01' });
        fetchUsers();
      } else {
        setMessage({ text: data.message || 'Error al crear usuario', type: 'error' });
      }
    } catch (err) {
      setMessage({ text: 'Error al conectar con el servidor', type: 'error' });
    }
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'admin_ti':
        return <span className="bg-orange-950/80 text-orange-400 text-xs font-semibold px-2.5 py-0.5 rounded border border-orange-500/40">Admin TI</span>;
      case 'tecnico':
        return <span className="bg-zinc-800 text-amber-300 text-xs font-semibold px-2.5 py-0.5 rounded border border-amber-500/30">Técnico</span>;
      default:
        return <span className="bg-zinc-800 text-zinc-300 text-xs font-semibold px-2.5 py-0.5 rounded border border-zinc-600">Empleado</span>;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-10 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <header className="border-b border-orange-500/30 pb-5">
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Gestión de Accesos y Roles <span className="text-orange-500 text-lg font-normal"></span>
          </h1>
          <p className="text-zinc-400 text-sm mt-1">
            Módulo de administración para asignación de permisos y control de usuarios por organización.
          </p>
        </header>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Formulario */}
          <div className="bg-zinc-900 border border-orange-500/30 rounded-xl p-6 shadow-2xl shadow-orange-950/20">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span>
              Crear Nuevo Usuario
            </h2>

            {message.text && (
              <div className={`p-3 text-sm rounded-lg mb-4 font-medium ${
                message.type === 'success' 
                  ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800' 
                  : 'bg-rose-950/80 text-rose-300 border border-rose-800'
              }`}>
                {message.text}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">Nombre Completo</label>
                <input 
                  type="text" 
                  name="name" 
                  placeholder="Ej. Alexis Araujo" 
                  value={formData.name} 
                  onChange={handleChange} 
                  required 
                  className="w-full bg-black border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">Correo Electrónico</label>
                <input 
                  type="email" 
                  name="email" 
                  placeholder="tu@correo.com" 
                  value={formData.email} 
                  onChange={handleChange} 
                  required 
                  className="w-full bg-black border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">Contraseña</label>
                <input 
                  type="password" 
                  name="password" 
                  placeholder="••••••••" 
                  value={formData.password} 
                  onChange={handleChange} 
                  required 
                  className="w-full bg-black border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">Rol Asignado</label>
                <select 
                  name="role" 
                  value={formData.role} 
                  onChange={handleChange}
                  className="w-full bg-black border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-orange-500 transition"
                >
                  <option value="admin_ti">Administrador de TI</option>
                  <option value="tecnico">Técnico</option>
                  <option value="empleado">Empleado</option>
                </select>
              </div>

              <button 
                type="submit" 
                className="w-full bg-orange-600 hover:bg-orange-500 text-white font-semibold py-2.5 rounded-lg text-sm transition shadow-lg shadow-orange-600/30 active:scale-[0.99] mt-2"
              >
                Registrar Usuario
              </button>
            </form>
          </div>

          {/* Listado */}
          <div className="bg-zinc-900 border border-orange-500/30 rounded-xl p-6 shadow-2xl flex flex-col">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center justify-between">
              <span>Usuarios Registrados</span>
              <span className="text-xs bg-orange-950/60 text-orange-400 border border-orange-500/30 px-2.5 py-0.5 rounded-full font-normal">
                {users.length} {users.length === 1 ? 'usuario' : 'usuarios'}
              </span>
            </h2>

            <div className="flex-1 overflow-y-auto max-h-[400px] pr-1 space-y-3">
              {users.length === 0 ? (
                <div className="h-full flex items-center justify-center text-zinc-500 text-sm py-10">
                  No hay usuarios registrados en esta organización.
                </div>
              ) : (
                users.map((u) => (
                  <div key={u.id || u._id} className="bg-black border border-zinc-800 p-3.5 rounded-lg flex items-center justify-between hover:border-orange-500/50 transition">
                    <div>
                      <p className="font-semibold text-white text-sm">{u.name}</p>
                      <p className="text-xs text-zinc-400">{u.email}</p>
                    </div>
                    <div>
                      {getRoleBadge(u.role)}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}