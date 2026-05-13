import { ArrowUp, Award } from "lucide-react";
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
import type { PerformanceBySubject } from "../../types/dashboard";

interface Props {
  data: PerformanceBySubject[];
}

const truncateName = (value: string, max = 24): string =>
  value.length > max ? `${value.slice(0, max - 1)}…` : value;

function SubjectRankingChart({ data }: Props) {
  const sorted = [...data]
    .map((item) => ({
      ...item,
      promedio_nota_final: Number(item.promedio_nota_final),
    }))
    .filter((item) => Number.isFinite(item.promedio_nota_final))
    .sort((a, b) => b.promedio_nota_final - a.promedio_nota_final);

  const topPerformers = sorted.slice(0, 5).map((item) => ({
    ...item,
    shortName: truncateName(item.nombre_asignatura),
  }));

  const lowPerformers = sorted
    .slice(-5)
    .reverse()
    .map((item) => ({
      ...item,
      shortName: truncateName(item.nombre_asignatura),
    }));

  const chartData = [...topPerformers, ...lowPerformers];

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center gap-2">
        <Award className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-bold text-text-main">Ranking de Asignaturas</h2>
      </div>

      <div className="h-[360px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 8, right: 24, left: 16, bottom: 12 }}
            layout="vertical"
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
            <XAxis
              type="number"
              domain={[0, 5]}
              stroke="#64748b"
              tick={{ fill: "#64748b", fontSize: 12 }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              type="category"
              dataKey="shortName"
              stroke="#64748b"
              tick={{ fill: "#64748b", fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              width={180}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#ffffff",
                borderColor: "#e2e8f0",
                borderRadius: "8px",
                color: "#1e293b",
              }}
              cursor={{ fill: "#e2e8f0", opacity: 0.4 }}
              formatter={(value) =>
                typeof value === "number" ? value.toFixed(2) : String(value)
              }
            />
            <Bar
              dataKey="promedio_nota_final"
              fill="#3b82f6"
              radius={[0, 4, 4, 0]}
              label={{ position: "right", fill: "#1e293b", fontSize: 11 }}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`${entry.codigo_asignatura}-${index}`}
                  fill={index < topPerformers.length ? "#22c55e" : "#ef4444"}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="flex items-center gap-2 rounded-lg bg-slate-50 p-3">
          <ArrowUp className="h-5 w-5 text-green-600" />
          <div className="min-w-0">
            <p className="text-xs text-text-muted">Mejor desempeño</p>
            <p
              className="truncate text-xl font-bold text-green-600"
              title={topPerformers[0]?.nombre_asignatura || "Sin datos"}
            >
              {topPerformers[0]?.nombre_asignatura || "Sin datos"}
            </p>
          </div>
        </div>
        <div className="min-w-0 rounded-lg bg-slate-50 p-3">
          <p className="text-xs text-text-muted">Menor desempeño</p>
          <p
            className="truncate text-xl font-bold text-red-600"
            title={lowPerformers[0]?.nombre_asignatura || "Sin datos"}
          >
            {lowPerformers[0]?.nombre_asignatura || "Sin datos"}
          </p>
        </div>
      </div>
    </div>
  );
}

export default SubjectRankingChart;
