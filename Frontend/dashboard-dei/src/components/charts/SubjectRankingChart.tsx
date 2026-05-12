import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ArrowUp, Award } from 'lucide-react';

interface Props {
  data: any[];
}

function SubjectRankingChart({ data }: Props) {
  // Top 5 mejores y top 5 peores
  const sorted = [...data].sort((a, b) => 
    Number(b.promedio_nota_final) - Number(a.promedio_nota_final)
  );
  
  const topPerformers = sorted.slice(0, 5).map((item, idx) => ({
    ...item,
    promedio_nota_final: Number(item.promedio_nota_final),
    nombre: item.nombre_asignatura.substring(0, 15),
    rank: idx + 1,
    type: 'Mejor'
  }));

  const worstPerformers = sorted.slice(-5).reverse().map((item, idx) => ({
    ...item,
    promedio_nota_final: Number(item.promedio_nota_final),
    nombre: item.nombre_asignatura.substring(0, 15),
    rank: idx + 1,
    type: 'Menor'
  }));

  const chartData = [...topPerformers, ...worstPerformers];

  return (
    <div className="rounded-2xl bg-surface p-6 shadow-sm border border-slate-800">
      <div className="flex items-center gap-2 mb-6">
        <Award className="w-5 h-5 text-secondary" />
        <h2 className="text-xl font-bold text-text-main">
          Ranking de Asignaturas
        </h2>
      </div>

      <div className="h-75">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart 
            data={chartData}
            margin={{ top: 10, right: 30, left: 150, bottom: 20 }}
            layout="vertical"
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
            <XAxis 
              type="number"
              domain={[0, 5]}
              stroke="#94a3b8"
              tick={{ fill: '#94a3b8', fontSize: 12 }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              type="category"
              dataKey="nombre"
              stroke="#94a3b8"
              tick={{ fill: '#94a3b8', fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              width={140}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1e293b', 
                borderColor: '#334155',
                borderRadius: '8px',
                color: '#f8fafc'
              }}
              cursor={{ fill: '#334155', opacity: 0.4 }}
              formatter={(value) =>
                typeof value === 'number' ? value.toFixed(2) : String(value)
              }
            />
            <Bar 
              dataKey="promedio_nota_final"
              fill="#8b5cf6"
              radius={[0, 4, 4, 0]}
              label={{
                position: 'right',
                fill: '#f8fafc',
                fontSize: 11
              }}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="flex items-center gap-2 p-3 bg-slate-800/50 rounded-lg">
          <ArrowUp className="w-5 h-5 text-green-400" />
          <div>
            <p className="text-xs text-text-muted">Mejor Desempeño</p>
            <p className="text-lg font-bold text-green-400">
              {topPerformers[0]?.nombre}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 p-3 bg-slate-800/50 rounded-lg">
          <span className="text-xs text-text-muted">Menor Desempeño</span>
          <p className="text-lg font-bold text-red-400">
            {worstPerformers[0]?.nombre}
          </p>
        </div>
      </div>
    </div>
  );
}

export default SubjectRankingChart;
