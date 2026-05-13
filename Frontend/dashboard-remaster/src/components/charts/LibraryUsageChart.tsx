import { Library } from "lucide-react";
import {
  Bar, BarChart, CartesianGrid, Cell,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import type { LibraryUsagePoint } from "../../types/dashboard";
import ChartCard from "./ChartCard";
import EmptyState from "./EmptyState";
import { AXIS_TICK, PALETTE, TOOLTIP_STYLE } from "../../utils/chartTheme";

interface Props { data: LibraryUsagePoint[] }

export default function LibraryUsageChart({ data }: Props) {
  if (!data.length) return (
    <ChartCard title="Uso de Recursos de Biblioteca" icon={Library}>
      <EmptyState />
    </ChartCard>
  );

  const top10 = data.slice(0, 10);

  return (
    <ChartCard
      title="Uso de Recursos de Biblioteca"
      icon={Library}
      badge={`${top10.length} categorías`}
    >
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={top10}
            layout="vertical"
            margin={{ top: 4, right: 48, left: 8, bottom: 4 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
            <XAxis type="number" tick={AXIS_TICK} tickLine={false} axisLine={false} />
            <YAxis
              type="category"
              dataKey="category"
              width={180}
              tick={AXIS_TICK}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              contentStyle={TOOLTIP_STYLE}
              formatter={(v, _, p) => [
                `${v} artículos (${p.payload.records} registros)`,
                "Total",
              ]}
            />
            <Bar dataKey="articles" radius={[0, 4, 4, 0]}
              label={{ position: "right", fill: "#94a3b8", fontSize: 11 }}
            >
              {top10.map((_, i) => (
                <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}
