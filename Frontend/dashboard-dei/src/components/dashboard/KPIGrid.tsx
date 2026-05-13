import { BarChart3, BookOpen, Library, Users } from "lucide-react";
import type { DashboardOverview } from "../../types/dashboard";
import KPICard from "./KPICardNew";

interface Props {
  data: DashboardOverview | null;
}

const formatNumber = (value: number): string => value.toLocaleString("es-CO");

const formatDecimal = (value: number): string => value.toFixed(2);

function KPIGrid({ data }: Props) {
  if (!data) return null;

  const totalStudents = Number(data.total_estudiantes || 0);
  const totalSubjects = Number(data.total_asignaturas || 0);
  const averageGrade = Number(data.promedio_nota_final || 0);
  const totalLibraryRecords = Number(data.total_registros_biblioteca || 0);

  return (
    <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
      <KPICard
        title="Estudiantes"
        value={formatNumber(totalStudents)}
        icon={<Users className="h-6 w-6" />}
      />

      <KPICard
        title="Asignaturas"
        value={formatNumber(totalSubjects)}
        icon={<BookOpen className="h-6 w-6" />}
      />

      <KPICard
        title="Promedio Nota Final"
        value={formatDecimal(averageGrade)}
        icon={<BarChart3 className="h-6 w-6" />}
      />

      <KPICard
        title="Registros Biblioteca"
        value={formatNumber(totalLibraryRecords)}
        icon={<Library className="h-6 w-6" />}
      />
    </div>
  );
}

export default KPIGrid;
