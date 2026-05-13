/**
 * adapters/dashboard.ts
 *
 * Transforms raw backend responses into clean, UI-ready data.
 * This is the single place that knows about backend quirks:
 *  - string numbers ("3.75") → actual numbers
 *  - empty estado strings → "Sin estado"
 *  - ISO date strings → short month labels
 *  - duplicated/multiplied records handled by presenting
 *    what the backend provides without inflating further
 */

import type {
  RawOverview,
  RawPerformanceItem,
  RawAttendanceTrendItem,
  RawAttendanceWeekdayItem,
  RawAttendanceSemesterItem,
  RawLibraryUsageItem,
  RawLibraryAvailabilityItem,
  RawGradeDistributionItem,
  RawActivityLevelItem,
  Overview,
  PerformanceItem,
  AttendanceTrendPoint,
  AttendanceWeekdayPoint,
  AttendanceSemesterPoint,
  LibraryUsagePoint,
  LibraryAvailabilityPoint,
  GradeDistributionPoint,
  ActivityLevelPoint,
} from "../types/dashboard";

// ─── Helpers ─────────────────────────────────────────────────────────────────

const toNum = (v: string | number | null | undefined, fallback = 0): number => {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
};

const truncate = (s: string, max = 22): string =>
  s.length > max ? `${s.slice(0, max - 1)}…` : s;

/**
 * Prettify tipo_recurso keys like "prestamo_fisico:devuelto"
 * → "Préstamo Físico · Devuelto"
 */
export const prettifyResourceKey = (key: string): string => {
  if (!key || key.trim() === "") return "Sin categoría";
  const [type, subtype] = key.split(":");
  const fmt = (s: string) =>
    s.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  return subtype ? `${fmt(type)} · ${fmt(subtype)}` : fmt(type);
};

const WEEKDAY_LABELS: Record<number, string> = {
  0: "Dom", 1: "Lun", 2: "Mar", 3: "Mié",
  4: "Jue", 5: "Vie", 6: "Sáb",
};

const shortMonth = (isoDate: string): string => {
  try {
    return new Date(isoDate).toLocaleDateString("es-CO", { month: "short" });
  } catch {
    return isoDate;
  }
};

// ─── Overview ─────────────────────────────────────────────────────────────────

export const adaptOverview = (raw: RawOverview | null | undefined): Overview | null => {
  if (!raw) return null;
  return {
    totalStudents: toNum(raw.total_estudiantes),
    totalSubjects: toNum(raw.total_asignaturas),
    avgGrade: toNum(raw.promedio_nota_final),
    attendancePct: toNum(raw.porcentaje_asistencia),
    libraryRecords: toNum(raw.total_registros_biblioteca),
  };
};

// ─── Academic Performance ─────────────────────────────────────────────────────

export const adaptPerformance = (
  raw: RawPerformanceItem[] | null | undefined
): PerformanceItem[] => {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((item) => ({
      code: item.codigo_asignatura ?? "",
      name: item.nombre_asignatura ?? "",
      shortName: truncate(item.nombre_asignatura ?? "", 24),
      avgGrade: toNum(item.promedio_nota_final),
      records: toNum(item.total_registros),
    }))
    .filter((item) => Number.isFinite(item.avgGrade));
};

// ─── Attendance Trend ─────────────────────────────────────────────────────────

export const adaptAttendanceTrend = (
  raw: RawAttendanceTrendItem[] | null | undefined
): AttendanceTrendPoint[] => {
  if (!Array.isArray(raw)) return [];
  return [...raw]
    .sort((a, b) => new Date(a.mes).getTime() - new Date(b.mes).getTime())
    .map((item) => ({
      label: shortMonth(item.mes),
      pct: toNum(item.porcentaje_asistencia),
      classes: toNum(item.total_clases),
      absences: toNum(item.total_clases) - toNum(item.asistencias),
    }));
};

// ─── Attendance by Weekday ────────────────────────────────────────────────────

export const adaptAttendanceWeekday = (
  raw: RawAttendanceWeekdayItem[] | null | undefined
): AttendanceWeekdayPoint[] => {
  if (!Array.isArray(raw)) return [];
  return [...raw]
    .sort((a, b) => Number(a.dia_semana_num) - Number(b.dia_semana_num))
    .map((item) => ({
      label: WEEKDAY_LABELS[Number(item.dia_semana_num)] ?? item.dia_semana,
      pct: toNum(item.porcentaje_asistencia),
      classes: toNum(item.total_clases),
    }));
};

// ─── Attendance by Semester ───────────────────────────────────────────────────

export const adaptAttendanceSemester = (
  raw: RawAttendanceSemesterItem[] | null | undefined
): AttendanceSemesterPoint[] => {
  if (!Array.isArray(raw)) return [];
  return [...raw]
    .sort((a, b) => Number(a.semestre_estudiante) - Number(b.semestre_estudiante))
    .map((item) => ({
      label: `S${item.semestre_estudiante}`,
      semester: Number(item.semestre_estudiante),
      pct: toNum(item.porcentaje_asistencia),
      classes: toNum(item.total_clases),
    }));
};

// ─── Library Usage ────────────────────────────────────────────────────────────

export const adaptLibraryUsage = (
  raw: RawLibraryUsageItem[] | null | undefined
): LibraryUsagePoint[] => {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((item) => item.tipo_recurso && !item.tipo_recurso.startsWith("metrica_global"))
    .map((item) => ({
      rawKey: item.tipo_recurso,
      category: prettifyResourceKey(item.tipo_recurso),
      articles: toNum(item.total_articulos),
      records: toNum(item.total_registros),
    }))
    .sort((a, b) => b.articles - a.articles);
};

// ─── Library Availability ─────────────────────────────────────────────────────

export const adaptLibraryAvailability = (
  raw: RawLibraryAvailabilityItem[] | null | undefined
): LibraryAvailabilityPoint[] => {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((item) => ({
      label: item.estado?.trim() !== "" ? item.estado : "Sin clasificar",
      total: toNum(item.total),
    }))
    .filter((item) => item.total > 0)
    .sort((a, b) => b.total - a.total);
};

// ─── Grade Distribution ───────────────────────────────────────────────────────

export const adaptGradeDistribution = (
  raw: RawGradeDistributionItem[] | null | undefined
): GradeDistributionPoint[] => {
  if (!Array.isArray(raw)) return [];
  return raw.map((item) => ({
    range: item.rango ?? "",
    count: toNum(item.total_estudiantes),
  }));
};

// ─── Activity Level ───────────────────────────────────────────────────────────

export const adaptActivityLevel = (
  raw: RawActivityLevelItem[] | null | undefined
): ActivityLevelPoint[] => {
  if (!Array.isArray(raw)) return [];
  return [...raw]
    .map((item) => ({
      level: item.nivel ?? "",
      students: toNum(item.total_estudiantes),
      interactions: toNum(item.total_interacciones),
      articles: toNum(item.total_articulos),
    }))
    .sort((a, b) => b.students - a.students);
};
