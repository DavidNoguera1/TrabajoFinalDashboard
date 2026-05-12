import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface Props {
  data: any[];
}

function PerformanceDistributionChart({ data }: Props) {
  // Crear rangos de notas (0-1, 1-2, 2-3, 3-4, 4-5)
  const ranges = [
    { range: '0.0 - 1.9', count: 0, color: '#ef4444' },
    { range: '2.0 - 2.9', count: 0, color: '#f97316' },
    { range: '3.0 - 3.9', count: 0, color: '#eab308' },
    { range: '4.0 - 4.5', count: 0, color: '#84cc16' },
    { range: '4.6 - 5.0', count: 0, color: '#22c55e' },
  ];

  data.forEach(item => {
    const nota = Number(item.promedio_nota_final);
    if (nota < 2) ranges[0].count++;
    else if (nota < 3) ranges[1].count++;
    else if (nota < 4) ranges[2].count++;
    else if (nota < 4.6) ranges[3].count++;
    else ranges[4].count++;
  });

  return (
    <div className="rounded-2xl bg-surface p-6 shadow-sm border border-slate-800">
      <h2 className="mb-6 text-xl font-bold text-text-main">
        Distribución de Notas
      </h2>

      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={ranges} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
            <XAxis 
              dataKey="range"
              stroke="#94a3b8"
              tick={{ fill: '#94a3b8', fontSize: 12 }}
              tickLine={false}
              axisLine={false}
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
              dataKey="count"
              fill="#3b82f6"
              radius={[4, 4, 0, 0]}
              label={{
                position: 'top',
                fill: '#f8fafc',
                fontSize: 12
              }}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default PerformanceDistributionChart;
