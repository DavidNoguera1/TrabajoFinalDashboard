import { Award } from "lucide-react";
import {
  Bar, BarChart, CartesianGrid, Cell,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import type { PerformanceItem } from "../../types/dashboard";
import ChartCard from "./ChartCard";
import EmptyState from "./EmptyState";
import { AXIS_TICK, TOOLTIP_STYLE } from "../../utils/chartTheme";

interface Props { data: PerformanceItem[] }

export default function SubjectRankingChart({ data }: Props) {
  if (!data.length) return (
    <ChartCard title="Ranking de Asignaturas" icon={Award}>
      <EmptyState />
    </ChartCard>
  );

  const sorted = [...data].sort((a, b) => b.avgGrade - a.avgGrade);
  const top5 = sorted.slice(0, 5);
  const bottom5 = sorted.slice(-5).reverse();
  const chartData = [...top5, ...bottom5];
  const topCount = top5.length;

  return (
    <ChartCard title="Ranking de Asignaturas" icon={Award} badge="Top 5 · Bottom 5">
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 4, right: 48, left: 8, bottom: 4 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
            <XAxis type="number" domain={[0, 5]} tick={AXIS_TICK} tickLine={false} axisLine={false} />
            <YAxis
              type="category"
              dataKey="shortName"
              width={168}
              tick={AXIS_TICK}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              contentStyle={TOOLTIP_STYLE}
              formatter={(v) => [Number(v).toFixed(2), "Promedio"]}
            />
            <Bar dataKey="avgGrade" radius={[0, 4, 4, 0]}
              label={{ position: "right", fill: "#94a3b8", fontSize: 11 }}
            >
              {chartData.map((_, i) => (
                <Cell key={i} fill={i < topCount ? "#22c55e" : "#ef4444"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-lg bg-green-50 p-3">
          <p className="mb-0.5 text-[11px] text-green-600">Mejor desempeño</p>
          <p className="truncate text-sm font-semibold text-green-700" title={top5[0]?.name}>
            {top5[0]?.name ?? "—"}
          </p>
          <p className="text-xs text-green-500">{top5[0]?.avgGrade.toFixed(2)}</p>
        </div>
        <div className="rounded-lg bg-red-50 p-3">
          <p className="mb-0.5 text-[11px] text-red-500">Menor desempeño</p>
          <p className="truncate text-sm font-semibold text-red-700" title={bottom5[0]?.name}>
            {bottom5[0]?.name ?? "—"}
          </p>
          <p className="text-xs text-red-400">{bottom5[0]?.avgGrade.toFixed(2)}</p>
        </div>
      </div>
    </ChartCard>
  );
}
