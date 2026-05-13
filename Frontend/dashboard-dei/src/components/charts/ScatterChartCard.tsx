import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Zap } from 'lucide-react';

interface Props {
  data: any[];
}

function ScatterChartCard({ data }: Props) {
  const formattedData = data.map((item) => ({
    registros: Number(item.total_registros),
    promedio: Number(item.promedio_nota_final),
    asignatura: item.nombre_asignatura,
  }));

  return (
    <div className="rounded-xl bg-white p-6 shadow-sm border border-slate-200">
      <div className="flex items-center gap-2 mb-6">
        <Zap className="w-5 h-5 text-primary" />
        <h2 className="text-xl font-bold text-text-main">
          Rendimiento Académico por Asignatura
        </h2>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />

            <XAxis
              dataKey="registros"
              name="Records"
              stroke="#64748b"
              tick={{ fill: '#64748b', fontSize: 12 }}
              tickLine={false}
              axisLine={false}
            />

            <YAxis
              dataKey="promedio"
              name="Average Grade"
              domain={[0, 5]}
              stroke="#64748b"
              tick={{ fill: '#64748b', fontSize: 12 }}
              tickLine={false}
              axisLine={false}
            />

            <Tooltip
              contentStyle={{ 
                backgroundColor: '#ffffff', 
                borderColor: '#e2e8f0',
                borderRadius: '8px',
                color: '#1e293b'
              }}
              cursor={{ strokeDasharray: "3 3" }}
              formatter={(value) =>
                typeof value === 'number' ? value.toFixed(2) : String(value)
              }
            />

            <Scatter 
              name="Subjects" 
              data={formattedData}
              fill="#3b82f6"
            />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default ScatterChartCard;