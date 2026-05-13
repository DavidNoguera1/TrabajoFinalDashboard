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
import type { GradeDistributionItem } from "../../types/dashboard";

interface Props {
  data: GradeDistributionItem[];
}

function PerformanceDistributionChart({ data }: Props) {
  const palette = ["#ef4444", "#f97316", "#eab308", "#84cc16", "#22c55e"];
  const ranges = data.map((item) => ({
    range: item.rango,
    count: Number(item.total_estudiantes || 0),
  }));
  const totalStudents = ranges.reduce((sum, item) => sum + item.count, 0);

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between gap-3">
        <h2 className="text-xl font-bold text-text-main">Distribución de Notas (Estudiantes)</h2>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
          Total: {totalStudents}
        </span>
      </div>

      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={ranges} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
            <XAxis
              dataKey="range"
              stroke="#64748b"
              tick={{ fill: "#64748b", fontSize: 12 }}
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
              formatter={(value) => [`${value} estudiantes`, "Cantidad"]}
              cursor={{ fill: "#e2e8f0", opacity: 0.4 }}
            />
            <Bar
              dataKey="count"
              fill="#3b82f6"
              radius={[4, 4, 0, 0]}
              label={{ position: "top", fill: "#1e293b", fontSize: 12 }}
            >
              {ranges.map((entry, index) => (
                <Cell key={`${entry.range}-${index}`} fill={palette[index % palette.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default PerformanceDistributionChart;
