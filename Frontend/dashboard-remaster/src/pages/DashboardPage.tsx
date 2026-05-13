import { Database } from "lucide-react";
import { useEffect, useRef } from "react";
import ActivityLevelChart from "../components/charts/ActivityLevelChart";
import GradeDistributionChart from "../components/charts/GradeDistributionChart";
import LibraryAvailabilityChart from "../components/charts/LibraryAvailabilityChart";
import LibraryUsageChart from "../components/charts/LibraryUsageChart";
import SubjectRankingChart from "../components/charts/SubjectRankingChart";
import TrendLineChart from "../components/charts/TrendLineChart";
import ActiveFiltersBar from "../components/dashboard/ActiveFiltersBar";
import FilterPanel from "../components/dashboard/FilterPanel";
import KPIGrid from "../components/dashboard/KPIGrid";
import { useFilterState } from "../hooks/useFilterState";
import DashboardLayout from "../layouts/DashboardLayout";
import { useDashboardStore } from "../store/dashboardStore";

export default function DashboardPage() {
  const { catalog, overview, performance, trend, gradeDistribution,
          libraryUsage, libraryAvailability, activityLevel,
          loading, error, loadCatalog, loadData } = useDashboardStore();

  const filterState = useFilterState(catalog);
  const { activeFilters, clearAll } = filterState;

  // Load catalog once on mount
  useEffect(() => { loadCatalog(); }, [loadCatalog]);

  // Load data whenever filters change — but debounce grade inputs
  const timerRef = useRef<ReturnType<typeof setTimeout>>(null);
  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      loadData(activeFilters);
    }, 200);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [activeFilters, loadData]);

  const sidebar = (
    <FilterPanel catalog={catalog} filterState={filterState} />
  );

  return (
    <DashboardLayout sidebar={sidebar}>
      {/* Page header */}
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="flex items-center gap-2.5 text-2xl font-bold text-slate-800">
            <Database className="h-6 w-6 text-blue-600" />
            Academic Analytics
          </h1>
          <p className="mt-0.5 text-sm text-slate-400">
            Métricas estratégicas · Universidad Mariana
          </p>
        </div>
        {loading && (
          <span className="flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-600">
            <span className="h-2 w-2 animate-pulse rounded-full bg-blue-500" />
            Actualizando…
          </span>
        )}
      </div>

      {/* Error banner */}
      {error && (
        <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          No se pudo conectar con el servidor: {error}
        </div>
      )}

      {/* Active filters pills */}
      <ActiveFiltersBar filters={activeFilters} onClear={clearAll} />

      {/* KPIs */}
      <KPIGrid data={overview} loading={loading} />

      {/* Row 1 — Academic */}
      <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <GradeDistributionChart data={gradeDistribution} />
        <SubjectRankingChart data={performance} />
      </div>

      {/* Row 2 — Library */}
      <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <LibraryUsageChart data={libraryUsage} />
        <LibraryAvailabilityChart data={libraryAvailability} />
      </div>

      {/* Row 3 — Trends */}
      <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <TrendLineChart data={trend} />
        <ActivityLevelChart data={activityLevel} />
      </div>
    </DashboardLayout>
  );
}
