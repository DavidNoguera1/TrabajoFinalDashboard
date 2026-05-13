import { TrendingUp } from "lucide-react";
import {
  CartesianGrid, Line, LineChart,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import type { AttendanceTrendPoint } from "../../types/dashboard";
import ChartCard from "./ChartCard";
import EmptyState from "./EmptyState";
import { AXIS_TICK, TOOLTIP_STYLE } from "../../utils/chartTheme";

interface Props { data: AttendanceTrendPoint[] }

export default function TrendLineChart({ data }: Props) {
  if (!data.length) return (
    <ChartCard title="Tendencia de Asistencia" icon={TrendingUp}>
      <EmptyState />
    </ChartCard>
  );

  const avg = (data.reduce((s, d) => s + d.pct, 0) / data.length).toFixed(1);

  return (
    <ChartCard
      title="Tendencia de Asistencia"
      icon={TrendingUp}
      badge={`Promedio: ${avg}%`}
    >
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 8, right: 24, left: 0, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis dataKey="label" tick={AXIS_TICK} tickLine={false} axisLine={false} />
            <YAxis domain={[70, 100]} tick={AXIS_TICK} tickLine={false} axisLine={false}
              tickFormatter={(v) => `${v}%`} />
            <Tooltip
              contentStyle={TOOLTIP_STYLE}
              formatter={(v, _, p) => [
                `${Number(v).toFixed(1)}%`,
                `Asistencia (${p.payload.classes} clases)`,
              ]}
            />
            <Line
              type="monotone"
              dataKey="pct"
              stroke="#2563eb"
              strokeWidth={2.5}
              dot={{ fill: "#2563eb", r: 4, strokeWidth: 0 }}
              activeDot={{ r: 6, strokeWidth: 0 }}
              animationDuration={800}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}
