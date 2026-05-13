import { SlidersHorizontal, X } from "lucide-react";
import type { FiltersCatalog } from "../../types/dashboard";
import type { useFilterState } from "../../hooks/useFilterState";

type FilterState = ReturnType<typeof useFilterState>;

interface Props {
  catalog: FiltersCatalog | null;
  filterState: FilterState;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

interface CheckboxGroupProps {
  label: string;
  options: string[];
  selected: string[];
  onToggle: (value: string) => void;
}

function CheckboxGroup({ label, options, selected, onToggle }: CheckboxGroupProps) {
  if (!options.length) return null;
  return (
    <div>
      <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">{label}</p>
      <div className="max-h-36 space-y-1 overflow-y-auto pr-1">
        {options.map((opt) => (
          <label
            key={opt}
            className="flex cursor-pointer items-center gap-2 rounded-md px-1.5 py-1 transition-colors hover:bg-slate-50"
          >
            <input
              type="checkbox"
              checked={selected.includes(opt)}
              onChange={() => onToggle(opt)}
              className="h-3.5 w-3.5 rounded border-slate-300 text-blue-600 accent-blue-600"
            />
            <span className="text-sm text-slate-700">{opt}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function FilterPanel({ catalog, filterState }: Props) {
  const {
    uiState,
    activeCount,
    setYear,
    toggleSemester,
    toggleCourse,
    toggleTeacher,
    toggleSubject,
    toggleActivityLevel,
    setGradeMin,
    setGradeMax,
    clearAll,
  } = filterState;

  if (!catalog) {
    return (
      <div className="space-y-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-6 animate-pulse rounded bg-slate-100" />
        ))}
      </div>
    );
  }

  const semesterOptions = catalog.semesters.map(String);
  const selectedSemesterStrs = uiState.semesters.map(String);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-slate-600">
          <SlidersHorizontal className="h-4 w-4" />
          <span className="text-sm font-semibold">Filtros</span>
          {activeCount > 0 && (
            <span className="rounded-full bg-blue-600 px-1.5 py-0.5 text-[10px] font-bold text-white">
              {activeCount}
            </span>
          )}
        </div>
        {activeCount > 0 && (
          <button
            onClick={clearAll}
            className="flex items-center gap-1 rounded-md px-2 py-1 text-xs text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
          >
            <X className="h-3 w-3" />
            Limpiar
          </button>
        )}
      </div>

      {/* Year */}
      {catalog.years.length > 1 && (
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">Año</p>
          <select
            value={uiState.year ?? ""}
            onChange={(e) => setYear(e.target.value ? Number(e.target.value) : null)}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
          >
            <option value="">Todos los años</option>
            {catalog.years.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
      )}
      {catalog.years.length === 1 && (
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">Año</p>
          <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500">
            {catalog.years[0]} <span className="text-xs">(único)</span>
          </div>
        </div>
      )}

      {/* Semester */}
      <CheckboxGroup
        label="Semestre Estudiante"
        options={semesterOptions}
        selected={selectedSemesterStrs}
        onToggle={(v) => toggleSemester(Number(v))}
      />

      {/* Course */}
      <CheckboxGroup
        label="Curso"
        options={catalog.courses.map((c) => c.label)}
        selected={uiState.courseLabels}
        onToggle={toggleCourse}
      />

      {/* Activity level */}
      <CheckboxGroup
        label="Nivel Actividad Biblioteca"
        options={catalog.activityLevels}
        selected={uiState.activityLevels}
        onToggle={toggleActivityLevel}
      />

      {/* Grade range */}
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
          Rango Calificación
        </p>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            min={0}
            max={5}
            step={0.1}
            value={uiState.gradeMin}
            onChange={(e) => setGradeMin(e.target.value)}
            placeholder="Mín"
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 placeholder-slate-300 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
          />
          <input
            type="number"
            min={0}
            max={5}
            step={0.1}
            value={uiState.gradeMax}
            onChange={(e) => setGradeMax(e.target.value)}
            placeholder="Máx"
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 placeholder-slate-300 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
          />
        </div>
        <p className="mt-1 text-[11px] text-slate-400">Escala 0.0 – 5.0</p>
      </div>

      {/* Teacher */}
      <CheckboxGroup
        label="Docente"
        options={catalog.teachers}
        selected={uiState.teachers}
        onToggle={toggleTeacher}
      />

      {/* Subject */}
      <CheckboxGroup
        label="Asignatura"
        options={catalog.subjects}
        selected={uiState.subjects}
        onToggle={toggleSubject}
      />
    </div>
  );
}
