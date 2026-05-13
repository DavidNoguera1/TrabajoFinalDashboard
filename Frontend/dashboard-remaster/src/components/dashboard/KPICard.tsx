import type { LucideIcon } from "lucide-react";

interface KPICardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: LucideIcon;
  color?: "blue" | "green" | "purple" | "amber";
}

const COLOR_MAP = {
  blue:   { bg: "bg-blue-50",   icon: "text-blue-600",   border: "border-blue-100" },
  green:  { bg: "bg-green-50",  icon: "text-green-600",  border: "border-green-100" },
  purple: { bg: "bg-purple-50", icon: "text-purple-600", border: "border-purple-100" },
  amber:  { bg: "bg-amber-50",  icon: "text-amber-600",  border: "border-amber-100" },
};

export function KPICard({ title, value, subtitle, icon: Icon, color = "blue" }: KPICardProps) {
  const c = COLOR_MAP[color];
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
      <div className="mb-4 flex items-start justify-between">
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <div className={`rounded-lg p-2 ${c.bg} border ${c.border}`}>
          <Icon className={`h-5 w-5 ${c.icon}`} />
        </div>
      </div>
      <p className="text-3xl font-bold tracking-tight text-slate-800">{value}</p>
      {subtitle && <p className="mt-1 text-xs text-slate-400">{subtitle}</p>}
    </div>
  );
}
