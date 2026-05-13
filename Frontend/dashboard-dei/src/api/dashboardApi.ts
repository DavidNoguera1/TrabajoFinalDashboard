import axios from "axios";
import type {
  ActivityLevelItem,
  AttendanceSemesterItem,
  AttendanceTrendItem,
  AttendanceWeekdayItem,
  DashboardFiltersCatalog,
  DashboardOverview,
  DashboardQueryFilters,
  GradeDistributionItem,
  LibraryAvailabilityItem,
  LibraryUsageItem,
  PerformanceBySubject,
} from "../types/dashboard";

const api = axios.create({
  baseURL: "http://localhost:3003/api/dashboard",
});

const buildQueryParams = (filters?: DashboardQueryFilters): Record<string, string | number> => {
  if (!filters) return {};

  const params: Record<string, string | number> = {};

  if (typeof filters.year === "number") params.year = filters.year;
  if (typeof filters.semester === "number") params.semester = filters.semester;
  if (typeof filters.courseId === "number") params.courseId = filters.courseId;
  if (filters.teacher) params.teacher = filters.teacher;
  if (filters.subject) params.subject = filters.subject;
  if (filters.activityLevel) params.activityLevel = filters.activityLevel;
  if (typeof filters.gradeMin === "number") params.gradeMin = filters.gradeMin;
  if (typeof filters.gradeMax === "number") params.gradeMax = filters.gradeMax;

  return params;
};

export const getFilters = async (): Promise<DashboardFiltersCatalog> => {
  const response = await api.get<{ data: DashboardFiltersCatalog }>("/filters");
  return response.data.data;
};

export const getOverview = async (
  filters?: DashboardQueryFilters
): Promise<DashboardOverview> => {
  const response = await api.get<{ data: DashboardOverview }>("/overview", {
    params: buildQueryParams(filters),
  });
  return response.data.data;
};

export const getAcademicPerformance = async (
  filters?: DashboardQueryFilters
): Promise<PerformanceBySubject[]> => {
  const response = await api.get<{ data: PerformanceBySubject[] }>(
    "/academic/performance",
    { params: buildQueryParams(filters) }
  );
  return response.data.data;
};

export const getAttendanceTrend = async (
  filters?: DashboardQueryFilters
): Promise<AttendanceTrendItem[]> => {
  const response = await api.get<{ data: AttendanceTrendItem[] }>(
    "/academic/attendance-trend",
    { params: buildQueryParams(filters) }
  );
  return response.data.data;
};

export const getAttendanceByWeekday = async (
  filters?: DashboardQueryFilters
): Promise<AttendanceWeekdayItem[]> => {
  const response = await api.get<{ data: AttendanceWeekdayItem[] }>(
    "/academic/attendance-weekday",
    { params: buildQueryParams(filters) }
  );
  return response.data.data;
};

export const getAttendanceByStudentSemester = async (
  filters?: DashboardQueryFilters
): Promise<AttendanceSemesterItem[]> => {
  const response = await api.get<{ data: AttendanceSemesterItem[] }>(
    "/academic/attendance-by-student-semester",
    { params: buildQueryParams(filters) }
  );
  return response.data.data;
};

export const getAcademicGradeDistribution = async (
  filters?: DashboardQueryFilters
): Promise<GradeDistributionItem[]> => {
  const response = await api.get<{ data: GradeDistributionItem[] }>(
    "/academic/grade-distribution",
    { params: buildQueryParams(filters) }
  );
  return response.data.data;
};

export const getLibraryUsage = async (
  filters?: DashboardQueryFilters
): Promise<LibraryUsageItem[]> => {
  const response = await api.get<{ data: LibraryUsageItem[] }>(
    "/library/usage-by-type",
    { params: buildQueryParams(filters) }
  );
  return response.data.data;
};

export const getLibraryAvailability = async (
  filters?: DashboardQueryFilters
): Promise<LibraryAvailabilityItem[]> => {
  const response = await api.get<{ data: LibraryAvailabilityItem[] }>(
    "/library/availability",
    { params: buildQueryParams(filters) }
  );
  return response.data.data;
};

export const getLibraryActivityByLevel = async (
  filters?: DashboardQueryFilters
): Promise<ActivityLevelItem[]> => {
  const response = await api.get<{ data: ActivityLevelItem[] }>(
    "/library/activity-by-level",
    { params: buildQueryParams(filters) }
  );
  return response.data.data;
};

export default api;
