import { ChevronLeft, ChevronRight } from 'lucide-react';
import { NavLink } from 'react-router-dom';

export default function Sidebar({ items, collapsed, onToggle, brandLabel }){
  return (
    <aside
      className={`relative flex h-full flex-col bg-sysbase-dark text-slate-300 transition-all duration-300 ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Marca */}
      <div
        className={`flex h-16 items-center ${
          collapsed ? 'justify-center' : 'px-6'
        } mt-2`}
      >
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sysbase-orange text-white">
            <span className="text-sm font-bold">S</span>
          </div>
          {!collapsed && (
            <span className="text-xl font-bold tracking-wide text-white">
              SysBase
            </span>
          )}
        </div>
      </div>

      {/* Menú */}
      <nav className="mt-8 flex-1 overflow-y-auto px-3">
        {!collapsed && (
          <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
            {brandLabel}
          </p>
        )}
        <ul className="space-y-1">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                      collapsed ? 'justify-center' : ''
                    } ${
                      isActive
                        ? 'bg-sysbase-orange text-white shadow-sm'
                        : 'hover:bg-white/5 hover:text-white'
                    }`
                  }
                  title={collapsed ? item.label : undefined}
                >
                  <Icon className="h-4 w-4 shrink-0"/>
                  {!collapsed && <span>{item.label}</span>}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {/*Botón colapsar — pegado a la orilla derecha del sidebar*/}
      <button type="button" onClick={onToggle} className="absolute -right-3 top-20 flex h-7 w-7 items-center justify-center rounded-full border border-slate-600 bg-sysbase-dark text-slate-300 shadow-lg transition-colors hover:bg-sysbase-orange hover:text-white" aria-label={collapsed ? 'Expandir menú' : 'Colapsar menú'}>
        {collapsed ? (
          <ChevronRight className="h-4 w-4" />
        ) : (
          <ChevronLeft className="h-4 w-4" />
        )}
      </button>
    </aside>
  );
}