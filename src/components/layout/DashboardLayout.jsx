import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

export default function DashboardLayout({
  items,
  brandLabel = 'Menú',
  pageTitle,
  breadcrumb,
  children,
}) {
  const [collapsed, setCollapsed] = useState(false);
  const { user } = useAuth();

  /* Filtra los items según el rol del usuario. Si un item no declara
     `roles`, se asumir que es visible para todos. */
  const visibleItems = items.filter((item) => {
    if (!item.roles) return true;
    return item.roles.includes(user?.role);
  });

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 text-slate-800">
      <Sidebar
        items={visibleItems}
        collapsed={collapsed}
        onToggle={() => setCollapsed((v) => !v)}
        brandLabel={brandLabel}
      />

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <Topbar pageTitle={pageTitle} />

        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          {breadcrumb && (
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              {breadcrumb}
            </p>
          )}
          {pageTitle && (
            <h1 className="mb-6 text-2xl font-bold text-slate-800">{pageTitle}</h1>
          )}
          {children}
        </main>
      </div>
    </div>
  );
}