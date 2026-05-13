import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { BookOpen } from 'lucide-react';

interface Props {
  data: any[];
}

function LibraryResourcesChart({ data }: Props) {
  const COLORS = [
    '#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', 
    '#10b981', '#06b6d4', '#f97316', '#6366f1',
    '#14b8a6', '#f43f5e'
  ];

  const chartData = data.map((item) => ({
    name: item.tipo_recurso.replace(/[_:]/g, ' ').substring(0, 20),
    value: item.total_articulos,
    fullName: item.tipo_recurso,
  })).sort((a, b) => b.value - a.value).slice(0, 8);

  return (
    <div className="rounded-xl bg-white p-6 shadow-sm border border-slate-200">
      <div className="flex items-center gap-2 mb-6">
        <BookOpen className="w-5 h-5 text-primary" />
        <h2 className="text-xl font-bold text-text-main">
          Recursos de Biblioteca (Top 8)
        </h2>
      </div>

      <div className="h-75">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={(entry) => `${entry.value}`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#ffffff', 
                borderColor: '#e2e8f0',
                borderRadius: '8px',
                color: '#1e293b'
              }}
              formatter={(value) => `${value} artículos`}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2">
        {chartData.map((item, idx) => (
          <div key={idx} className="flex items-center gap-2 p-2 bg-slate-50 rounded">
            <div 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: COLORS[idx % COLORS.length] }}
            />
            <span className="text-xs text-text-muted truncate">{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default LibraryResourcesChart;
