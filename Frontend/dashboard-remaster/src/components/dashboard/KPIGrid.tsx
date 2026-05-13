import { BarChart3, BookOpen, Library, Users } from "lucide-react";
import type { Overview } from "../../types/dashboard";
import { KPICard } from "./KPICard";

interface Props {
  data: Overview | null;
  loading: boolean;
}

const fmt = (n: number) => n.toLocaleString("es-CO");
const fmtPct = (n: number) => `${n.toFixed(1)}%`;
const fmtGrade = (n: number) => n.toFixed(2);

export default function KPIGrid({ data, loading }: Props) {
  if (loading && !data) {
    return (
      <div className="mb-8 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-32 animate-pulse rounded-xl border border-slate-100 bg-slate-50" />
        ))}
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="mb-8 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
      <KPICard
        title="Estudiantes"
        value={fmt(data.totalStudents)}
        subtitle="Registrados en el sistema"
        icon={Users}
        color="blue"
      />
      <KPICard
        title="Asignaturas"
        value={fmt(data.totalSubjects)}
        subtitle="Activas este período"
        icon={BookOpen}
        color="purple"
      />
      <KPICard
        title="Promedio General"
        value={fmtGrade(data.avgGrade)}
        subtitle="Nota final / escala 0–5"
        icon={BarChart3}
        color="green"
      />
      <KPICard
        title="Asistencia"
        value={fmtPct(data.attendancePct)}
        subtitle={`${fmt(data.libraryRecords)} reg. biblioteca`}
        icon={Library}
        color="amber"
      />
    </div>
  );
}
