import { BookOpenCheck } from "lucide-react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import type { LibraryAvailabilityItem } from "../../types/dashboard";

interface Props {
  data: LibraryAvailabilityItem[];
}

const COLORS = [
  "#2563eb",
  "#0ea5e9",
  "#14b8a6",
  "#22c55e",
  "#84cc16",
  "#f59e0b",
  "#f97316",
  "#ef4444",
  "#ec4899",
  "#8b5cf6",
  "#6366f1",
];

const prettify = (value: string): string =>
  value
    .replace(/[_:]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

function LibraryAvailabilityChart({ data }: Props) {
  const ranked = data
    .map((item) => ({
      estado: prettify(item.estado || "sin_estado"),
      total: Number(item.total || 0),
    }))
    .sort((a, b) => b.total - a.total);

  const topStates = ranked.slice(0, 10);
  const othersTotal = ranked.slice(10).reduce((sum, item) => sum + item.total, 0);
  const chartData = othersTotal > 0 ? [...topStates, { estado: "Otros", total: othersTotal }] : topStates;
  const totalRecords = chartData.reduce((sum, item) => sum + item.total, 0);

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <BookOpenCheck className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-bold text-text-main">Disponibilidad de Recursos</h2>
        </div>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
          Top 10 + Otros
        </span>
      </div>

      <div className="h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={52}
              outerRadius={100}
              dataKey="total"
              nameKey="estado"
              label={({ percent }) => `${((percent || 0) * 100).toFixed(0)}%`}
              labelLine={false}
            >
              {chartData.map((entry, index) => (
                <Cell key={`${entry.estado}-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value, name) => [`${value} registros`, String(name)]}
              contentStyle={{
                backgroundColor: "#ffffff",
                borderColor: "#e2e8f0",
                borderRadius: "8px",
                color: "#1e293b",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <p className="mb-3 text-sm text-text-muted">Total: {totalRecords} registros</p>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {chartData.map((item, index) => (
          <div key={`${item.estado}-${index}`} className="flex items-center gap-2 rounded bg-slate-50 p-2">
            <span
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
            />
            <span className="truncate text-xs text-text-muted" title={`${item.estado}: ${item.total}`}>
              {item.estado}: {item.total}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default LibraryAvailabilityChart;
