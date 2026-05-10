export default function StatusBadge({ status }) {
  const variants = {
    Open: 'bg-slate-700 text-slate-100',
    Assigned: 'bg-sky-700 text-white',
    'In Progress': 'bg-blue-600 text-white',
    Escalated: 'bg-orange-500 text-white',
    Resolved: 'bg-emerald-500 text-slate-950',
    Closed: 'bg-green-700 text-white',
  };
  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${variants[status] || 'bg-slate-700 text-slate-100'}`}>
      {status}
    </span>
  );
}
