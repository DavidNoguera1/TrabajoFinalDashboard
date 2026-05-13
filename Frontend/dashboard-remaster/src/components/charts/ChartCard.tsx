import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

interface Props {
  title: string;
  icon: LucideIcon;
  badge?: string;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
}

export default function ChartCard({ title, icon: Icon, badge, children, footer, className = "" }: Props) {
  return (
    <div className={`rounded-xl border border-slate-200 bg-white p-6 shadow-sm ${className}`}>
      <div className="mb-5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Icon className="h-5 w-5 text-blue-600" />
          <h2 className="text-base font-semibold text-slate-800">{title}</h2>
        </div>
        {badge && (
          <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600">
            {badge}
          </span>
        )}
      </div>
      {children}
      {footer && <div className="mt-4">{footer}</div>}
    </div>
  );
}
