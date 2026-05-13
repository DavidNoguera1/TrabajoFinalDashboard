import { Activity } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { ActivityLevelItem } from "../../types/dashboard";

interface Props {
  data: ActivityLevelItem[];
}

const palette = ["#2563eb", "#16a34a", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"];

function ActivityLevelChart({ data }: Props) {
  const chartData = data
    .map((item) => ({
      nivel: item.nivel,
      estudiantes: Number(item.total_estudiantes || 0),
      interacciones: Number(item.total_interacciones || 0),
      articulos: Number(item.total_articulos || 0),
    }))
    .sort((a, b) => b.estudiantes - a.estudiantes);

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center gap-2">
        <Activity className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-bold text-text-main">Nivel de Actividad Biblioteca</h2>
      </div>

      <div className="h-[340px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 8, right: 24, left: 0, bottom: 30 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
            <XAxis
              dataKey="nivel"
              angle={-20}
              textAnchor="end"
              height={60}
              stroke="#64748b"
              tick={{ fill: "#64748b", fontSize: 11 }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#64748b"
              tick={{ fill: "#64748b", fontSize: 12 }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#ffffff",
                borderColor: "#e2e8f0",
                borderRadius: "8px",
                color: "#1e293b",
              }}
              formatter={(value, name, payload) => {
                const row = payload?.payload;
                if (!row) return [value, name];
                return [
                  `${value} estudiantes`,
                  `Estudiantes (Interacciones: ${row.interacciones}, Artículos: ${row.articulos})`,
                ];
              }}
            />
            <Bar dataKey="estudiantes" radius={[4, 4, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`${entry.nivel}-${index}`} fill={palette[index % palette.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default ActivityLevelChart;
