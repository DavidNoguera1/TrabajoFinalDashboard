import { X } from "lucide-react";
import type { ActiveFilters } from "../../types/dashboard";

interface Props {
  filters: ActiveFilters;
  onClear: () => void;
}

function pill(label: string, onRemove?: () => void) {
  return (
    <span
      key={label}
      className="flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700"
    >
      {label}
      {onRemove && (
        <button onClick={onRemove} className="text-blue-400 hover:text-blue-700">
          <X className="h-3 w-3" />
        </button>
      )}
    </span>
  );
}

export default function ActiveFiltersBar({ filters, onClear }: Props) {
  const pills: JSX.Element[] = [];

  if (filters.year) pills.push(pill(`Año: ${filters.year}`));
  filters.semesters.forEach((s) => pills.push(pill(`Semestre ${s}`)));
  filters.teachers.forEach((t) => pills.push(pill(`Doc: ${t}`)));
  filters.subjects.forEach((s) => pills.push(pill(`Asig: ${s}`)));
  filters.activityLevels.forEach((a) => pills.push(pill(`Actividad: ${a}`)));
  if (filters.gradeMin !== null) pills.push(pill(`Nota ≥ ${filters.gradeMin}`));
  if (filters.gradeMax !== null) pills.push(pill(`Nota ≤ ${filters.gradeMax}`));

  if (!pills.length) return null;

  return (
    <div className="mb-5 flex flex-wrap items-center gap-2">
      <span className="text-xs text-slate-400">Filtros activos:</span>
      {pills}
      <button
        onClick={onClear}
        className="ml-auto text-xs text-slate-400 underline hover:text-slate-600"
      >
        Limpiar todos
      </button>
    </div>
  );
}
