import { FilterIcon } from 'lucide-react';

interface FilterProps {
  selectedSemester: string | null;
  onSemesterChange: (semester: string | null) => void;
}

export default function Filter({ selectedSemester, onSemesterChange }: FilterProps) {
  const semesters = [
    { value: '100', label: 'Semestre I' },
    { value: '200', label: 'Semestre II' },
    { value: '300', label: 'Semestre III' },
    { value: '400', label: 'Semestre IV' },
    { value: '600', label: 'Semestre VI' },
    { value: '700', label: 'Semestre VII' },
    { value: '800', label: 'Semestre VIII' },
    { value: '900', label: 'Semestre IX' },
  ];

  return (
    <div className="mb-6 p-4 bg-surface rounded-lg border border-slate-800 max-w-sm">
      <div className="flex items-start gap-3 mb-4">
        <FilterIcon className="w-5 h-5 text-primary mt-1" />
        <div>
          <p className="text-text-main font-medium">Filtrar por semestre</p>
          <p className="text-sm text-text-muted">Selecciona un semestre para filtrar los datos.</p>
        </div>
      </div>

      <select
        value={selectedSemester ?? ""}
        onChange={(event) => onSemesterChange(event.target.value || null)}
        className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-text-main transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
      >
        <option value="">Todos</option>
        {semesters.map((sem) => (
          <option key={sem.value} value={sem.value}>
            {sem.label}
          </option>
        ))}
      </select>
    </div>
  );
}
