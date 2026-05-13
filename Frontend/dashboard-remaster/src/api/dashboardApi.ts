/**
 * api/dashboardApi.ts
 *
 * Thin HTTP layer. Only concerns: URLs, serialization, error handling.
 * No data transformation here — that belongs in adapters/.
 */

import type {
  ApiQueryParams,
  RawActivityLevelItem,
  RawAttendanceSemesterItem,
  RawAttendanceTrendItem,
  RawAttendanceWeekdayItem,
  RawFiltersCatalog,
  RawGradeDistributionItem,
  RawLibraryAvailabilityItem,
  RawLibraryUsageItem,
  RawOverview,
  RawPerformanceItem,
} from "../types/dashboard";

const BASE_URL = "http://localhost:3003/api/dashboard";

// ─── Serializer: arrays → repeated params (?semester=1&semester=2) ────────────

const serializeParams = (params: ApiQueryParams): string => {
  const sp = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null) continue;
    if (Array.isArray(value)) {
      value.forEach((v) => sp.append(key, String(v)));
    } else {
      sp.append(key, String(value));
    }
  }
  return sp.toString();
};

// ─── Active filters → API params ──────────────────────────────────────────────

import type { ActiveFilters } from "../types/dashboard";

export const filtersToParams = (filters: ActiveFilters): ApiQueryParams => {
  const params: ApiQueryParams = {};
  if (filters.year !== null) params.year = filters.year;
  if (filters.semesters.length > 0)
    params.semester = filters.semesters.length === 1 ? filters.semesters[0] : filters.semesters;
  if (filters.courseIds.length > 0)
    params.courseId = filters.courseIds.length === 1 ? filters.courseIds[0] : filters.courseIds;
  if (filters.teachers.length > 0)
    params.teacher = filters.teachers.length === 1 ? filters.teachers[0] : filters.teachers;
  if (filters.subjects.length > 0)
    params.subject = filters.subjects.length === 1 ? filters.subjects[0] : filters.subjects;
  if (filters.activityLevels.length > 0)
    params.activityLevel =
      filters.activityLevels.length === 1 ? filters.activityLevels[0] : filters.activityLevels;
  if (filters.gradeMin !== null) params.gradeMin = filters.gradeMin;
  if (filters.gradeMax !== null) params.gradeMax = filters.gradeMax;
  return params;
};

// ─── HTTP util ────────────────────────────────────────────────────────────────

async function get<T>(path: string, params?: ApiQueryParams): Promise<T> {
  const qs = params ? serializeParams(params) : "";
  const url = `${BASE_URL}${path}${qs ? `?${qs}` : ""}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} — ${path}`);
  const body = await res.json();
  if (!body.success) throw new Error(`API error — ${path}: ${JSON.stringify(body)}`);
  return body.data as T;
}

// ─── Endpoint functions ───────────────────────────────────────────────────────

export const fetchFilters = (): Promise<RawFiltersCatalog> =>
  get<RawFiltersCatalog>("/filters");

export const fetchOverview = (params?: ApiQueryParams): Promise<RawOverview> =>
  get<RawOverview>("/overview", params);

export const fetchPerformance = (params?: ApiQueryParams): Promise<RawPerformanceItem[]> =>
  get<RawPerformanceItem[]>("/academic/performance", params);

export const fetchAttendanceTrend = (params?: ApiQueryParams): Promise<RawAttendanceTrendItem[]> =>
  get<RawAttendanceTrendItem[]>("/academic/attendance-trend", params);

export const fetchAttendanceWeekday = (
  params?: ApiQueryParams
): Promise<RawAttendanceWeekdayItem[]> =>
  get<RawAttendanceWeekdayItem[]>("/academic/attendance-weekday", params);

export const fetchAttendanceSemester = (
  params?: ApiQueryParams
): Promise<RawAttendanceSemesterItem[]> =>
  get<RawAttendanceSemesterItem[]>("/academic/attendance-by-student-semester", params);

export const fetchGradeDistribution = (
  params?: ApiQueryParams
): Promise<RawGradeDistributionItem[]> =>
  get<RawGradeDistributionItem[]>("/academic/grade-distribution", params);

export const fetchLibraryUsage = (params?: ApiQueryParams): Promise<RawLibraryUsageItem[]> =>
  get<RawLibraryUsageItem[]>("/library/usage-by-type", params);

export const fetchLibraryAvailability = (
  params?: ApiQueryParams
): Promise<RawLibraryAvailabilityItem[]> =>
  get<RawLibraryAvailabilityItem[]>("/library/availability", params);

export const fetchActivityLevel = (params?: ApiQueryParams): Promise<RawActivityLevelItem[]> =>
  get<RawActivityLevelItem[]>("/library/activity-by-level", params);
