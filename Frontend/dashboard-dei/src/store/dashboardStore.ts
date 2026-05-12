import { create } from "zustand";

import {
  getOverview,
  getAcademicPerformance,
  getAttendanceTrend,
  getLibraryUsage,
} from "../api/dashboardApi";

interface DashboardState {
  loading: boolean;

  overview: any;
  performance: any[];
  trend: any[];
  usage: any[];

  fetchDashboardData: () => Promise<void>;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  loading: false,

  overview: null,
  performance: [],
  trend: [],
  usage: [],

  fetchDashboardData: async () => {
    try {
      set({ loading: true });

      const [
        overview,
        performance,
        trend,
        usage,
      ] = await Promise.all([
        getOverview(),
        getAcademicPerformance(),
        getAttendanceTrend(),
        getLibraryUsage(),
      ]);

      set({
        overview,
        performance,
        trend,
        usage,
      });
    } catch (error) {
      console.error(error);
    } finally {
      set({ loading: false });
    }
  },
}));