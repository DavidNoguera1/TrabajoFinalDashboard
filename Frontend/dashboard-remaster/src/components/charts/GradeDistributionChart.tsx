import { BarChart2 } from "lucide-react";
import {
  Bar, BarChart, CartesianGrid, Cell,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import type { GradeDistributionPoint } from "../../types/dashboard";
import ChartCard from "./ChartCard";
import EmptyState from "./EmptyState";
import { AXIS_TICK, TOOLTIP_STYLE } from "../../utils/chartTheme";

interface Props { data: GradeDistributionPoint[] }

const GRADE_COLORS = ["#ef4444", "#f97316", "#eab308", "#84cc16", "#22c55e"];

export default function GradeDistributionChart({ data }: Props) {
  const total = data.reduce((s, d) => s + d.count, 0);

  if (!data.length) return (
    <ChartCard title="Distribución de Notas" icon={BarChart2}>
      <EmptyState />
    </ChartCard>
  );

  return (
    <ChartCard
      title="Distribución de Notas"
      icon={BarChart2}
      badge={`Total: ${total.toLocaleString("es-CO")}`}
    >
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 16, right: 16, left: 0, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis dataKey="range" tick={AXIS_TICK} tickLine={false} axisLine={false} />
            <YAxis tick={AXIS_TICK} tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={TOOLTIP_STYLE}
              formatter={(v) => [`${v} registros`, "Cantidad"]}
              cursor={{ fill: "#f8fafc" }}
            />
            <Bar dataKey="count" radius={[4, 4, 0, 0]}
              label={{ position: "top", fill: "#94a3b8", fontSize: 11 }}
            >
              {data.map((_, i) => (
                <Cell key={i} fill={GRADE_COLORS[i % GRADE_COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <p className="mt-2 text-[11px] text-slate-400">
        Nota: los registros incluyen todas las evaluaciones del período filtrado.
      </p>
    </ChartCard>
  );
}
