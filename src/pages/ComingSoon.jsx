import { Clock } from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';

export default function ComingSoon({ items, brandLabel, title, sprint = 'Sprint 2' }) {
  return (
    <DashboardLayout
      items={items}
      brandLabel={brandLabel}
      breadcrumb="Módulo pendiente"
      pageTitle={title}
    >
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white py-20 text-center">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-orange-50 text-sysbase-orange">
          <Clock className="h-6 w-6" />
        </div>
        <h3 className="text-lg font-semibold text-slate-800">
          Disponible en {sprint}
        </h3>
        <p className="mt-2 max-w-md text-sm text-slate-500">
          Este módulo se activará cuando implementemos las tablas y endpoints
          correspondientes.
        </p>
      </div>
    </DashboardLayout>
  );
}