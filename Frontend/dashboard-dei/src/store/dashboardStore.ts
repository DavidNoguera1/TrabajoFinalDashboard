import { create } from "zustand";

import {
  getAcademicGradeDistribution,
  getAttendanceTrend,
  getFilters,
  getAcademicPerformance,
  getLibraryActivityByLevel,
  getLibraryAvailability,
  getLibraryUsage,
  getOverview,
} from "../api/dashboardApi";
import type {
  ActivityLevelItem,
  AttendanceTrendItem,
  DashboardFiltersCatalog,
  DashboardOverview,
  DashboardQueryFilters,
  GradeDistributionItem,
  LibraryAvailabilityItem,
  LibraryUsageItem,
  PerformanceBySubject,
} from "../types/dashboard";

interface DashboardState {
  loading: boolean;

  filters: DashboardFiltersCatalog | null;
  overview: DashboardOverview | null;
  performance: PerformanceBySubject[];
  trend: AttendanceTrendItem[];
  usage: LibraryUsageItem[];
  availability: LibraryAvailabilityItem[];
  gradeDistribution: GradeDistributionItem[];
  activityByLevel: ActivityLevelItem[];

  fetchFilters: () => Promise<void>;
  fetchDashboardData: (filters?: DashboardQueryFilters) => Promise<void>;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  loading: false,

  filters: null,
  overview: null,
  performance: [],
  trend: [],
  usage: [],
  availability: [],
  gradeDistribution: [],
  activityByLevel: [],

  fetchFilters: async () => {
    try {
      const filters = await getFilters();
      set({ filters });
    } catch (error) {
      console.error(error);
    }
  },

  fetchDashboardData: async (filters) => {
    try {
      set({ loading: true });

      const [
        overview,
        performance,
        trend,
        usage,
        availability,
        gradeDistribution,
        activityByLevel,
      ] = await Promise.all([
        getOverview(filters),
        getAcademicPerformance(filters),
        getAttendanceTrend(filters),
        getLibraryUsage(filters),
        getLibraryAvailability(filters),
        getAcademicGradeDistribution(filters),
        getLibraryActivityByLevel(filters),
      ]);

      set({
        overview,
        performance,
        trend,
        usage,
        availability,
        gradeDistribution,
        activityByLevel,
      });
    } catch (error) {
      console.error(error);
    } finally {
      set({ loading: false });
    }
  },
}));
