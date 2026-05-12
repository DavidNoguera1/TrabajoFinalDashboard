import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { Library } from 'lucide-react';

interface Props {
  data: any[];
}

function ResourceBarChart({ data }: Props) {
  const formattedData = data.map((item) => ({
    tipo: item.tipo_recurso.replace(/[_:]/g, ' ').substring(0, 20),
    articulos: Number(item.total_articulos),
  })).sort((a, b) => b.articulos - a.articulos).slice(0, 8);

  return (
    <div className="rounded-2xl bg-surface p-6 shadow-sm border border-slate-800">
      <div className="flex items-center gap-2 mb-6">
        <Library className="w-5 h-5 text-secondary" />
        <h2 className="text-xl font-bold text-text-main">
          Library Resource Usage (Top 8)
        </h2>
      </div>

      <div className="h-75">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={formattedData} margin={{ top: 10, right: 30, left: 0, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />

            <XAxis 
              dataKey="tipo"
              stroke="#94a3b8"
              tick={{ fill: '#94a3b8', fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              angle={-45}
              textAnchor="end"
              height={80}
            />

            <YAxis 
              stroke="#94a3b8"
              tick={{ fill: '#94a3b8', fontSize: 12 }}
              tickLine={false}
              axisLine={false}
            />

            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1e293b', 
                borderColor: '#334155',
                borderRadius: '8px',
                color: '#f8fafc'
              }}
              cursor={{ fill: '#334155', opacity: 0.4 }}
            />

            <Bar 
              dataKey="articulos"
              fill="#06b6d4"
              radius={[4, 4, 0, 0]}
              label={{
                position: 'top',
                fill: '#f8fafc',
                fontSize: 11
              }}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default ResourceBarChart;