import { Activity } from "lucide-react";
import {
  Bar, BarChart, CartesianGrid, Cell,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import type { ActivityLevelPoint } from "../../types/dashboard";
import ChartCard from "./ChartCard";
import EmptyState from "./EmptyState";
import { AXIS_TICK, PALETTE, TOOLTIP_STYLE } from "../../utils/chartTheme";

interface Props { data: ActivityLevelPoint[] }

export default function ActivityLevelChart({ data }: Props) {
  if (!data.length) return (
    <ChartCard title="Nivel de Actividad Biblioteca" icon={Activity}>
      <EmptyState />
    </ChartCard>
  );

  return (
    <ChartCard title="Nivel de Actividad Biblioteca" icon={Activity}>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 36 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis
              dataKey="level"
              angle={-20}
              textAnchor="end"
              height={56}
              tick={AXIS_TICK}
              tickLine={false}
              axisLine={false}
            />
            <YAxis tick={AXIS_TICK} tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={TOOLTIP_STYLE}
              formatter={(v, _, p) => [
                `${v} estudiantes  ·  ${p.payload.interactions} interacciones`,
                p.payload.level,
              ]}
            />
            <Bar dataKey="students" radius={[4, 4, 0, 0]}>
              {data.map((_, i) => (
                <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}
