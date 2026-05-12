import KPICard from "./KPICardNew";
import { Users, BookOpen, BarChart3, Users2 } from 'lucide-react';

interface Props {
  data: any;
  filteredPerformance?: any[];
  selectedSemester?: string | null;
}

function KPIGrid({ data, filteredPerformance = [], selectedSemester = null }: Props) {
  if (!data) return null;

  // Calcular métricas basadas en filtro
  let estudiantes = data.total_estudiantes;
  let asignaturas = data.total_asignaturas;
  let promedio = parseFloat(data.promedio_nota_final);
  let asistencia = parseFloat(data.porcentaje_asistencia);

  if (selectedSemester && filteredPerformance.length > 0) {
    // Cuando hay filtro activo, recalcular las métricas
    asignaturas = filteredPerformance.length;
    
    // Calcular promedio de notas del semestre filtrado
    const totalNotas = filteredPerformance.reduce((sum: number, item: any) => 
      sum + Number(item.promedio_nota_final), 0
    );
    promedio = parseFloat((totalNotas / filteredPerformance.length).toFixed(2));

    // Estudiantes se mantiene proporcional (estimado)
    estudiantes = Math.round(data.total_estudiantes * (filteredPerformance.length / data.total_asignaturas));
  }

  const trend_estudiantes = estudiantes > 120 ? 'up' : 'down';
  const trend_asistencia = asistencia > 80 ? 'up' : 'down';

  return (
    <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
      <KPICard
        title={selectedSemester ? `Estudiantes (Semestre)` : "Students"}
        value={String(estudiantes)}
        icon={<Users className="w-6 h-6" />}
        trend={trend_estudiantes}
        trendValue={trend_estudiantes === 'up' ? '+5%' : '-2%'}
      />

      <KPICard
        title={selectedSemester ? `Asignaturas (Filtrado)` : "Subjects"}
        value={String(asignaturas)}
        icon={<BookOpen className="w-6 h-6" />}
        trend="up"
        trendValue={selectedSemester ? 'Filtrado' : '+2'}
      />

      <KPICard
        title={selectedSemester ? `Promedio Semestre` : "Average Grade"}
        value={String(promedio)}
        icon={<BarChart3 className="w-6 h-6" />}
        trend={promedio > 3.7 ? 'up' : 'down'}
        trendValue={promedio > 3.7 ? '+0.1' : '-0.1'}
      />

      <KPICard
        title="Attendance"
        value={`${asistencia}%`}
        icon={<Users2 className="w-6 h-6" />}
        trend={trend_asistencia}
        trendValue={trend_asistencia === 'up' ? '+1.2%' : '-0.8%'}
      />
    </div>
  );
}

export default KPIGrid;