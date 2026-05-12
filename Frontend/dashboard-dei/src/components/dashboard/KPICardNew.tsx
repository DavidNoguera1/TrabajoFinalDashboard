import { TrendingUp, TrendingDown } from 'lucide-react';

interface Props{
    title: string;
    value: string;
    trend?: 'up' | 'down' | null;
    trendValue?: string;
    icon?: React.ReactNode;
}

export default function KPICard({ title, value, trend, trendValue, icon }: Props) {
  return (
    <div className="rounded-2xl bg-gradient-to-br from-surface to-slate-800 p-6 shadow-sm border border-slate-700 hover:border-blue-500/50 transition-all hover:shadow-lg hover:shadow-blue-500/10">
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-text-muted text-sm font-medium">{title}</h3>
          {icon && <div className="text-secondary">{icon}</div>}
        </div>
        <div className="flex items-end justify-between">
          <p className="text-4xl font-bold text-text-main">
              {value}
          </p>
          {trend && (
            <div className={`flex items-center gap-1 px-2 py-1 rounded ${
              trend === 'up' ? 'text-green-400' : 'text-red-400'
            }`}>
              {trend === 'up' ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
              <span className="text-xs font-medium">{trendValue}</span>
            </div>
          )}
        </div>
    </div>
  )
}
