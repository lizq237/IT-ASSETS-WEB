export default function StatCard({ label, value, caption, Icon, accent = 'slate' }) {
  const accents = {
    slate:   'bg-slate-50 text-slate-500',
    orange:  'bg-orange-50 text-sysbase-orange',
    blue:    'bg-blue-50 text-blue-500',
    emerald: 'bg-emerald-50 text-emerald-500',
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            {label}
          </h3>
          <div className="text-3xl font-bold text-slate-800">{value}</div>
          {caption && <p className="mt-1 text-xs text-slate-400">{caption}</p>}
        </div>
        <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${accents[accent]}`}>
          <Icon className="h-4 w-4" />
        </div>
      </div>
    </div>
  );
}