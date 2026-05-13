import { BookOpenCheck } from "lucide-react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import type { LibraryAvailabilityPoint } from "../../types/dashboard";
import ChartCard from "./ChartCard";
import EmptyState from "./EmptyState";
import { PALETTE, TOOLTIP_STYLE } from "../../utils/chartTheme";

interface Props { data: LibraryAvailabilityPoint[] }

export default function LibraryAvailabilityChart({ data }: Props) {
  if (!data.length) return (
    <ChartCard title="Disponibilidad de Recursos" icon={BookOpenCheck}>
      <EmptyState />
    </ChartCard>
  );

  const total = data.reduce((s, d) => s + d.total, 0);

  return (
    <ChartCard
      title="Disponibilidad de Recursos"
      icon={BookOpenCheck}
      badge={`${total.toLocaleString("es-CO")} registros`}
    >
      <div className="h-60">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="total"
              nameKey="label"
              cx="50%"
              cy="50%"
              innerRadius={48}
              outerRadius={90}
              label={({ percent }) => `${((percent ?? 0) * 100).toFixed(0)}%`}
              labelLine={false}
            >
              {data.map((_, i) => (
                <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={TOOLTIP_STYLE}
              formatter={(v, name) => [`${v} registros`, String(name)]}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-1.5">
        {data.map((item, i) => (
          <div key={i} className="flex items-center gap-2 rounded-md bg-slate-50 px-2.5 py-1.5">
            <span
              className="h-2.5 w-2.5 flex-shrink-0 rounded-full"
              style={{ backgroundColor: PALETTE[i % PALETTE.length] }}
            />
            <span className="truncate text-[11px] text-slate-600" title={`${item.label}: ${item.total}`}>
              {item.label}: {item.total}
            </span>
          </div>
        ))}
      </div>
    </ChartCard>
  );
}
