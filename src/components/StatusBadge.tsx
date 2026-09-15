import React from 'react';

interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs font-medium';

  let colorClasses = 'bg-slate-100 text-slate-700 border-slate-200';

  switch (status.toLowerCase()) {
    case 'scheduled':
    case 'active':
    case 'sent':
      colorClasses = 'bg-emerald-50 text-emerald-800 border-emerald-200';
      break;
    case 'completed':
      colorClasses = 'bg-blue-50 text-blue-800 border-blue-200';
      break;
    case 'cancelled':
    case 'high':
      colorClasses = 'bg-rose-50 text-rose-800 border-rose-200';
      break;
    case 'pending':
    case 'medium':
      colorClasses = 'bg-amber-50 text-amber-800 border-amber-200';
      break;
    case 'outpatient':
    case 'low':
      colorClasses = 'bg-sky-50 text-sky-800 border-sky-200';
      break;
    case 'discharged':
    case 'dismissed':
      colorClasses = 'bg-gray-100 text-gray-700 border-gray-200';
      break;

    // Academic incomplete module statuses
    case 'coming soon':
      colorClasses = 'bg-purple-50 text-purple-800 border-purple-200 font-semibold';
      break;
    case 'under development':
      colorClasses = 'bg-amber-50 text-amber-900 border-amber-300 font-semibold';
      break;
    case 'planned':
      colorClasses = 'bg-cyan-50 text-cyan-800 border-cyan-200 font-semibold';
      break;
    case 'future enhancement':
      colorClasses = 'bg-indigo-50 text-indigo-800 border-indigo-200 font-semibold';
      break;
    default:
      colorClasses = 'bg-slate-100 text-slate-700 border-slate-200';
  }

  return (
    <span
      className={`inline-flex items-center rounded-full border whitespace-nowrap ${sizeClasses} ${colorClasses}`}
    >
      <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-current opacity-70" />
      {status}
    </span>
  );
};
