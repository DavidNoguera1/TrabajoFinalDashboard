// ─── Raw API response shapes ──────────────────────────────────────────────────

export interface RawOverview {
  total_estudiantes: number;
  total_asignaturas: number;
  total_registros_academicos: number;
  total_registros_biblioteca: number;
  promedio_nota_final: string | number;
  porcentaje_asistencia: string | number;
}

export interface RawPerformanceItem {
  codigo_asignatura: string;
  nombre_asignatura: string;
  total_registros: number;
  promedio_nota_final: string | number;
}

export interface RawAttendanceTrendItem {
  mes: string;
  total_clases: number;
  asistencias: number;
  porcentaje_asistencia: string | number;
}

export interface RawAttendanceWeekdayItem {
  dia_semana_num: number;
  dia_semana: string;
  total_clases: number;
  asistencias: number;
  porcentaje_asistencia: string | number;
}

export interface RawAttendanceSemesterItem {
  semestre_estudiante: number;
  total_clases: number;
  asistencias: number;
  porcentaje_asistencia: string | number;
}

export interface RawLibraryUsageItem {
  tipo_recurso: string;
  total_registros: number;
  total_articulos: number;
}

export interface RawLibraryAvailabilityItem {
  estado: string;
  total: number;
}

export interface RawGradeDistributionItem {
  rango: string;
  total_estudiantes: number;
}

export interface RawActivityLevelItem {
  nivel: string;
  total_estudiantes: number;
  total_interacciones: number;
  total_articulos: number;
}

export interface RawFiltersCatalog {
  years: number[];
  courses: { id: number; label: string }[];
  teachers: string[];
  subjects: string[];
  semesters: number[];
  activityLevels: string[];
}

// ─── Normalized / UI-ready shapes ─────────────────────────────────────────────

export interface Overview {
  totalStudents: number;
  totalSubjects: number;
  avgGrade: number;
  attendancePct: number;
  libraryRecords: number;
}

export interface PerformanceItem {
  code: string;
  name: string;
  shortName: string;
  avgGrade: number;
  records: number;
}

export interface AttendanceTrendPoint {
  label: string;           // "ago", "sep" ...
  pct: number;
  classes: number;
  absences: number;
}

export interface AttendanceWeekdayPoint {
  label: string;           // "Lun", "Mar" ...
  pct: number;
  classes: number;
}

export interface AttendanceSemesterPoint {
  label: string;           // "S1", "S2" ...
  semester: number;
  pct: number;
  classes: number;
}

export interface LibraryUsagePoint {
  category: string;       // prettified tipo_recurso
  rawKey: string;         // original tipo_recurso
  articles: number;
  records: number;
}

export interface LibraryAvailabilityPoint {
  label: string;
  total: number;
}

export interface GradeDistributionPoint {
  range: string;
  count: number;
}

export interface ActivityLevelPoint {
  level: string;
  students: number;
  interactions: number;
  articles: number;
}

// ─── Filter state ─────────────────────────────────────────────────────────────

export interface FiltersCatalog {
  years: number[];
  courses: { id: number; label: string }[];
  teachers: string[];
  subjects: string[];
  semesters: number[];
  activityLevels: string[];
}

/**
 * The single source of truth for all active filters.
 * All arrays are empty = "no filter applied" = show everything.
 */
export interface ActiveFilters {
  year: number | null;
  semesters: number[];
  courseIds: number[];
  teachers: string[];
  subjects: string[];
  activityLevels: string[];
  gradeMin: number | null;
  gradeMax: number | null;
}

/** Shape the API expects */
export interface ApiQueryParams {
  year?: number;
  semester?: number | number[];
  courseId?: number | number[];
  teacher?: string | string[];
  subject?: string | string[];
  activityLevel?: string | string[];
  gradeMin?: number;
  gradeMax?: number;
}
