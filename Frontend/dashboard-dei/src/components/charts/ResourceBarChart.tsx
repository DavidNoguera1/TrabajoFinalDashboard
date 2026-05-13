import { Library } from "lucide-react";
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
import type { LibraryUsageItem } from "../../types/dashboard";

interface Props {
  data: LibraryUsageItem[];
}

const palette = [
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

function ResourceBarChart({ data }: Props) {
  const ranked = data
    .map((item) => ({
      tipo: prettify(item.tipo_recurso),
      articulos: Number(item.total_articulos || 0),
    }))
    .sort((a, b) => b.articulos - a.articulos);

  const topItems = ranked.slice(0, 10);
  const othersTotal = ranked.slice(10).reduce((sum, item) => sum + item.articulos, 0);

  const chartData = othersTotal > 0 ? [...topItems, { tipo: "Otros", articulos: othersTotal }] : topItems;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Library className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-bold text-text-main">Uso de Recursos (Top 10 + Otros)</h2>
        </div>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
          Categorías: {chartData.length}
        </span>
      </div>

      <div className="h-[360px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 8, right: 32, left: 16, bottom: 8 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
            <XAxis
              type="number"
              stroke="#64748b"
              tick={{ fill: "#64748b", fontSize: 12 }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              type="category"
              dataKey="tipo"
              width={170}
              stroke="#64748b"
              tick={{ fill: "#64748b", fontSize: 11 }}
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
              formatter={(value) => [`${value} artículos`, "Total"]}
            />
            <Bar
              dataKey="articulos"
              radius={[0, 4, 4, 0]}
              label={{ position: "right", fill: "#1e293b", fontSize: 11 }}
            >
              {chartData.map((entry, index) => (
                <Cell key={`${entry.tipo}-${index}`} fill={palette[index % palette.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default ResourceBarChart;
