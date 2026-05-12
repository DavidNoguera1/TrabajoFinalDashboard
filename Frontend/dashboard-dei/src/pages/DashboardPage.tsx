import { useEffect, useState } from "react";

import DashboardLayout from "../layouts/DashboardLayout";

import Navbar from "../components/dashboard/Navbar";
import KPIGrid from "../components/dashboard/KPIGrid";
import Filter from "../components/dashboard/Filter";

import ResourceBarChart from "../components/charts/ResourceBarChart";
import TrendLineChart from "../components/charts/TrendLineChart";
import PerformanceDistributionChart from "../components/charts/PerformanceDistributionChart";
import SubjectRankingChart from "../components/charts/SubjectRankingChart";
import LibraryResourcesChart from "../components/charts/LibraryResourcesChart";

import { useDashboardStore } from "../store/dashboardStore";

function DashboardPage() {
  const {
    fetchDashboardData,
    overview,
    performance,
    trend,
    usage,
    loading,
  } = useDashboardStore();

  const [selectedSemester, setSelectedSemester] = useState<string | null>(null);
  const [filteredPerformance, setFilteredPerformance] = useState<any[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  useEffect(() => {
    if (performance) {
      if (selectedSemester) {
        setFilteredPerformance(
          performance.filter((item: any) => 
            item.codigo_asignatura.substring(0, 3) === `SIS` &&
            item.codigo_asignatura.substring(3, 6).startsWith(selectedSemester[0])
          )
        );
      } else {
        setFilteredPerformance(performance);
      }
    }
  }, [selectedSemester, performance]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="space-y-4">
          <div className="h-10 w-64 bg-surface animate-pulse rounded-md"></div>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-surface animate-pulse rounded-xl"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-80 bg-surface animate-pulse rounded-xl"></div>
            ))}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <Navbar />

      <Filter selectedSemester={selectedSemester} onSemesterChange={setSelectedSemester} />

      <KPIGrid data={overview} filteredPerformance={filteredPerformance} selectedSemester={selectedSemester} />

      {/* Top Row - 2 Charts */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 mb-8">
        <PerformanceDistributionChart data={filteredPerformance} />
        <SubjectRankingChart data={filteredPerformance} />
      </div>

      {/* Middle Row - 2 Charts */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 mb-8">
        <ResourceBarChart data={usage} />
        <LibraryResourcesChart data={usage} />
      </div>

      {/* Bottom Row - Full Width Trend Chart */}
      <div className="grid grid-cols-1 gap-8">
        <TrendLineChart data={trend} />
      </div>
    </DashboardLayout>
  );
}

export default DashboardPage;