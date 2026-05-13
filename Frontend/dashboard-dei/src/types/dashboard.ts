export interface DashboardQueryFilters {
  year?: number;
  semester?: number;
  courseId?: number;
  teacher?: string;
  subject?: string;
  gradeMin?: number;
  gradeMax?: number;
  activityLevel?: string;
}

export interface CourseFilterOption {
  id: number;
  label: string;
}

export interface DashboardFiltersCatalog {
  years: number[];
  courses: CourseFilterOption[];
  teachers: string[];
  subjects: string[];
  semesters: number[];
  activityLevels: string[];
}

export interface DashboardOverview {
  total_estudiantes: number;
  total_asignaturas: number;
  total_registros_academicos: number;
  total_registros_biblioteca: number;
  promedio_nota_final: number | string;
  porcentaje_asistencia: number | string;
}

export interface PerformanceBySubject {
  codigo_asignatura: string;
  nombre_asignatura: string;
  total_registros: number;
  promedio_nota_final: number | string;
}

export interface AttendanceTrendItem {
  mes: string;
  total_clases: number;
  asistencias: number;
  porcentaje_asistencia: number | string;
}

export interface AttendanceWeekdayItem {
  dia_semana_num: number;
  dia_semana: string;
  total_clases: number;
  asistencias: number;
  porcentaje_asistencia: number | string;
}

export interface AttendanceSemesterItem {
  semestre_estudiante: number;
  total_clases: number;
  asistencias: number;
  porcentaje_asistencia: number | string;
}

export interface LibraryUsageItem {
  tipo_recurso: string;
  total_registros: number;
  total_articulos: number;
}

export interface LibraryAvailabilityItem {
  estado: string;
  total: number;
}

export interface GradeDistributionItem {
  rango: string;
  total_estudiantes: number;
}

export interface ActivityLevelItem {
  nivel: string;
  total_estudiantes: number;
  total_interacciones: number;
  total_articulos: number;
}
