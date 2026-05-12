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
    <div className="rounded-2xl bg-linear-to-br from-surface to-slate-800 p-6 shadow-sm border border-slate-800">
      <div className="flex items-center gap-2 mb-6">
        <Zap className="w-5 h-5 text-secondary" />
        <h2 className="text-xl font-bold text-text-main">
          Academic Performance by Subject
        </h2>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />

            <XAxis
              dataKey="registros"
              name="Records"
              stroke="#94a3b8"
              tick={{ fill: '#94a3b8', fontSize: 12 }}
              tickLine={false}
              axisLine={false}
            />

            <YAxis
              dataKey="promedio"
              name="Average Grade"
              domain={[0, 5]}
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
              cursor={{ strokeDasharray: "3 3" }}
              formatter={(value) =>
                typeof value === 'number' ? value.toFixed(2) : String(value)
              }
            />

            <Scatter 
              name="Subjects" 
              data={formattedData}
              fill="#ec4899"
            />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default ScatterChartCard;