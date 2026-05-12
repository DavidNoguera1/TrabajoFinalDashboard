import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { TrendingUp } from 'lucide-react';

interface Props {
  data: any[];
}

function TrendLineChart({ data }: Props) {
  const formattedData = data.map((item) => ({
    mes: new Date(item.mes).toLocaleDateString("es-CO", {
      month: "short",
    }),

    asistencia: Number(item.porcentaje_asistencia),
  }));

  const avgAttendance = (formattedData.reduce((sum, item) => sum + item.asistencia, 0) / formattedData.length).toFixed(2);

  return (
    <div className="rounded-2xl bg-surface p-6 shadow-sm border border-slate-800">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-secondary" />
          <h2 className="text-xl font-bold text-text-main">
            Tendencia de Asistencia
          </h2>
        </div>
        <div className="text-right">
          <p className="text-xs text-text-muted">Promedio</p>
          <p className="text-2xl font-bold text-secondary">{avgAttendance}%</p>
        </div>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={formattedData} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />

            <XAxis 
              dataKey="mes"
              stroke="#94a3b8"
              tick={{ fill: '#94a3b8', fontSize: 12 }}
              tickLine={false}
              axisLine={false}
            />

            <YAxis 
              domain={[70, 100]}
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
              formatter={(value) =>
                typeof value === 'number' ? `${value.toFixed(2)}%` : String(value)
              }
              cursor={{ stroke: '#3b82f6', strokeWidth: 2 }}
            />

            <Line
              type="monotone"
              dataKey="asistencia"
              stroke="#10b981"
              strokeWidth={3}
              dot={{ fill: '#10b981', r: 5 }}
              activeDot={{ r: 7 }}
              animationDuration={1000}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default TrendLineChart;