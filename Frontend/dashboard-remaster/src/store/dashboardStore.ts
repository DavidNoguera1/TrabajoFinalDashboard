/**
 * store/dashboardStore.ts
 *
 * Responsible ONLY for:
 *  1. Remote data (overview, charts, etc.)
 *  2. Loading / error state
 *  3. Filter catalog (options from backend)
 *
 * Active filter state lives in useFilterState hook.
 * This keeps the store focused and prevents filter bleed.
 */

import { create } from "zustand";
import {
  fetchActivityLevel,
  fetchAttendanceTrend,
  fetchFilters,
  fetchGradeDistribution,
  fetchLibraryAvailability,
  fetchLibraryUsage,
  fetchOverview,
  fetchPerformance,
  filtersToParams,
} from "../api/dashboardApi";
import {
  adaptActivityLevel,
  adaptAttendanceTrend,
  adaptGradeDistribution,
  adaptLibraryAvailability,
  adaptLibraryUsage,
  adaptOverview,
  adaptPerformance,
} from "../adapters/dashboard";
import type {
  ActiveFilters,
  ActivityLevelPoint,
  AttendanceTrendPoint,
  FiltersCatalog,
  GradeDistributionPoint,
  LibraryAvailabilityPoint,
  LibraryUsagePoint,
  Overview,
  PerformanceItem,
} from "../types/dashboard";

interface DashboardStore {
  // Catalog
  catalog: FiltersCatalog | null;
  catalogLoading: boolean;

  // Data
  overview: Overview | null;
  performance: PerformanceItem[];
  trend: AttendanceTrendPoint[];
  gradeDistribution: GradeDistributionPoint[];
  libraryUsage: LibraryUsagePoint[];
  libraryAvailability: LibraryAvailabilityPoint[];
  activityLevel: ActivityLevelPoint[];

  // Status
  loading: boolean;
  error: string | null;

  // Actions
  loadCatalog: () => Promise<void>;
  loadData: (filters: ActiveFilters) => Promise<void>;
}

export const useDashboardStore = create<DashboardStore>((set) => ({
  catalog: null,
  catalogLoading: false,
  overview: null,
  performance: [],
  trend: [],
  gradeDistribution: [],
  libraryUsage: [],
  libraryAvailability: [],
  activityLevel: [],
  loading: false,
  error: null,

  loadCatalog: async () => {
    set({ catalogLoading: true });
    try {
      const raw = await fetchFilters();
      // Defensively normalize catalog
      const catalog: FiltersCatalog = {
        years: Array.isArray(raw?.years) ? raw.years : [],
        courses: Array.isArray(raw?.courses) ? raw.courses : [],
        teachers: Array.isArray(raw?.teachers) ? raw.teachers : [],
        subjects: Array.isArray(raw?.subjects) ? raw.subjects : [],
        semesters: Array.isArray(raw?.semesters) ? raw.semesters : [],
        activityLevels: Array.isArray(raw?.activityLevels) ? raw.activityLevels : [],
      };
      set({ catalog });
    } catch (err) {
      console.error("[dashboard] loadCatalog failed:", err);
    } finally {
      set({ catalogLoading: false });
    }
  },

  loadData: async (filters) => {
    set({ loading: true, error: null });
    const params = filtersToParams(filters);
    try {
      const [
        rawOverview,
        rawPerformance,
        rawTrend,
        rawGradeDist,
        rawLibUsage,
        rawLibAvail,
        rawActivity,
      ] = await Promise.allSettled([
        fetchOverview(params),
        fetchPerformance(params),
        fetchAttendanceTrend(params),
        fetchGradeDistribution(params),
        fetchLibraryUsage(params),
        fetchLibraryAvailability(params),
        fetchActivityLevel(params),
      ]);

      // Extract values safely — failed requests fall back to null/[]
      const val = <T>(result: PromiseSettledResult<T>): T | null =>
        result.status === "fulfilled" ? result.value : null;

      set({
        overview: adaptOverview(val(rawOverview) ?? undefined),
        performance: adaptPerformance(val(rawPerformance) ?? undefined),
        trend: adaptAttendanceTrend(val(rawTrend) ?? undefined),
        gradeDistribution: adaptGradeDistribution(val(rawGradeDist) ?? undefined),
        libraryUsage: adaptLibraryUsage(val(rawLibUsage) ?? undefined),
        libraryAvailability: adaptLibraryAvailability(val(rawLibAvail) ?? undefined),
        activityLevel: adaptActivityLevel(val(rawActivity) ?? undefined),
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Error desconocido";
      set({ error: msg });
      console.error("[dashboard] loadData failed:", err);
    } finally {
      set({ loading: false });
    }
  },
}));
