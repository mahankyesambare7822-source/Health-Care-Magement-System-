import React from 'react';

interface SimpleChartsProps {
  stats: {
    scheduled: number;
    completed: number;
    cancelled: number;
    total: number;
  };
}

export const SimpleBarChart: React.FC<SimpleChartsProps> = ({ stats }) => {
  const maxVal = Math.max(stats.scheduled, stats.completed, stats.cancelled, 1);

  const items = [
    { label: 'Scheduled', count: stats.scheduled, color: 'bg-emerald-500', textColor: 'text-emerald-700' },
    { label: 'Completed', count: stats.completed, color: 'bg-blue-500', textColor: 'text-blue-700' },
    { label: 'Cancelled', count: stats.cancelled, color: 'bg-rose-500', textColor: 'text-rose-700' },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between h-44 pt-6 px-4 border-b border-slate-100 bg-slate-50/50 rounded-lg">
        {items.map((item) => {
          const heightPct = Math.round((item.count / maxVal) * 100);
          return (
            <div key={item.label} className="flex flex-col items-center flex-1 mx-2 h-full justify-end">
              <span className={`text-xs font-bold mb-1.5 ${item.textColor}`}>{item.count}</span>
              <div
                className={`w-full max-w-[48px] rounded-t-md ${item.color} transition-all duration-500`}
                style={{ height: `${Math.max(heightPct, 12)}%` }}
              />
              <span className="text-[11px] font-medium text-slate-500 mt-2 whitespace-nowrap">
                {item.label}
              </span>
            </div>
          );
        })}
      </div>
      <div className="grid grid-cols-3 gap-2 text-center text-xs">
        <div className="p-2 rounded bg-emerald-50/60 border border-emerald-100">
          <p className="text-slate-500 text-[11px]">Active Rate</p>
          <p className="font-bold text-emerald-800">
            {stats.total > 0 ? Math.round((stats.scheduled / stats.total) * 100) : 0}%
          </p>
        </div>
        <div className="p-2 rounded bg-blue-50/60 border border-blue-100">
          <p className="text-slate-500 text-[11px]">Completion</p>
          <p className="font-bold text-blue-800">
            {stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}%
          </p>
        </div>
        <div className="p-2 rounded bg-rose-50/60 border border-rose-100">
          <p className="text-slate-500 text-[11px]">Cancellation</p>
          <p className="font-bold text-rose-800">
            {stats.total > 0 ? Math.round((stats.cancelled / stats.total) * 100) : 0}%
          </p>
        </div>
      </div>
    </div>
  );
};

export const DepartmentVolumeChart: React.FC<{
  departments: { name: string; count: number; percentage: number; color: string }[];
}> = ({ departments }) => {
  return (
    <div className="space-y-3">
      {departments.map((dept) => (
        <div key={dept.name} className="space-y-1">
          <div className="flex items-center justify-between text-xs font-medium">
            <span className="text-slate-700">{dept.name}</span>
            <span className="text-slate-500">
              {dept.count} visits ({dept.percentage}%)
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
            <div
              className={`h-full rounded-full ${dept.color}`}
              style={{ width: `${dept.percentage}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export const WeeklyTrendLine: React.FC = () => {
  const days = [
    { day: 'Mon', count: 18, pct: 60 },
    { day: 'Tue', count: 24, pct: 80 },
    { day: 'Wed', count: 28, pct: 93 },
    { day: 'Thu', count: 22, pct: 73 },
    { day: 'Fri', count: 30, pct: 100 },
    { day: 'Sat', count: 12, pct: 40 },
    { day: 'Sun', count: 8, pct: 26 },
  ];

  return (
    <div>
      <div className="flex items-end justify-between h-36 pt-4 px-2 border-b border-slate-100">
        {days.map((item) => (
          <div key={item.day} className="flex flex-col items-center flex-1 h-full justify-end">
            <span className="text-[10px] font-semibold text-slate-600 mb-1">{item.count}</span>
            <div
              className="w-5 bg-indigo-500 rounded-t-sm transition-all duration-300 hover:bg-indigo-600"
              style={{ height: `${item.pct}%` }}
            />
            <span className="text-[10px] text-slate-400 mt-1.5">{item.day}</span>
          </div>
        ))}
      </div>
      <p className="text-[11px] text-slate-400 mt-2 text-right">
        Weekly Peak: Friday (30 patient encounters)
      </p>
    </div>
  );
};
