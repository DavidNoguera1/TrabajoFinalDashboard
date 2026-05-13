import { useEffect, useMemo, useState } from "react";
import ActivityLevelChart from "../components/charts/ActivityLevelChart";
import LibraryAvailabilityChart from "../components/charts/LibraryAvailabilityChart";
import PerformanceDistributionChart from "../components/charts/PerformanceDistributionChart";
import ResourceBarChart from "../components/charts/ResourceBarChart";
import SubjectRankingChart from "../components/charts/SubjectRankingChart";
import TrendLineChart from "../components/charts/TrendLineChart";
import Filter from "../components/dashboard/Filter";
import KPIGrid from "../components/dashboard/KPIGrid";
import Navbar from "../components/dashboard/Navbar";
import DashboardLayout from "../layouts/DashboardLayout";
import { useDashboardStore } from "../store/dashboardStore";
import type { DashboardQueryFilters } from "../types/dashboard";

const toNumberOrUndefined = (value: string | null): number | undefined => {
  if (!value) return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
};

function DashboardPage() {
  const {
    fetchFilters,
    fetchDashboardData,
    filters,
    overview,
    performance,
    gradeDistribution,
    trend,
    usage,
    availability,
    activityByLevel,
    loading,
  } = useDashboardStore();

  const [selectedSemester, setSelectedSemester] = useState<string[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string[]>([]);
  const [selectedYear, setSelectedYear] = useState<string[]>([]);
  const [selectedCourseIds, setSelectedCourseIds] = useState<number[]>([]);
  const [selectedTeacher, setSelectedTeacher] = useState<string[]>([]);
  const [selectedActivityLevel, setSelectedActivityLevel] = useState<string[]>([]);
  const [selectedGradeRanges, setSelectedGradeRanges] = useState<string[]>([]);

  useEffect(() => {
    fetchFilters();
  }, [fetchFilters]);

  const appliedFilters = useMemo<DashboardQueryFilters>(() => {
    const defaultYear =
      filters?.years && filters.years.length === 1 ? [String(filters.years[0])] : [];
    const years = selectedYear.length > 0 ? selectedYear : defaultYear;
    const year = years.length === 1 ? toNumberOrUndefined(years[0]) : undefined;

    const semesters = selectedSemester.length > 0 
      ? selectedSemester.map(s => toNumberOrUndefined(s)).filter((s): s is number => typeof s === "number")
      : [];

    let gradeMin: number | undefined;
    let gradeMax: number | undefined;
    if (selectedGradeRanges.length > 0) {
      const mins = selectedGradeRanges.map(r => parseFloat(r.split(" - ")[0]));
      const maxs = selectedGradeRanges.map(r => parseFloat(r.split(" - ")[1]));
      gradeMin = Math.min(...mins);
      gradeMax = Math.max(...maxs);
    }

    return {
      ...(typeof year === "number" ? { year } : {}),
      ...(semesters.length > 0 ? { semesters: semesters.map(s => Math.trunc(s)) } : {}),
      ...(selectedCourseIds.length > 0 ? { courseIds: selectedCourseIds } : {}),
      ...(selectedTeacher.length > 0 ? { teachers: selectedTeacher } : {}),
      ...(selectedSubject.length > 0 ? { subjects: selectedSubject } : {}),
      ...(selectedActivityLevel.length > 0 ? { activityLevels: selectedActivityLevel } : {}),
      ...(typeof gradeMin === "number" ? { gradeMin } : {}),
      ...(typeof gradeMax === "number" ? { gradeMax } : {}),
    };
  }, [
    filters,
    selectedYear,
    selectedSemester,
    selectedCourseIds,
    selectedTeacher,
    selectedSubject,
    selectedActivityLevel,
    selectedGradeRanges,
  ]);

  useEffect(() => {
    console.log("Applied filters:", JSON.stringify(appliedFilters));
    fetchDashboardData(appliedFilters);
  }, [fetchDashboardData, appliedFilters]);

  const clearFilters = () => {
    setSelectedSemester([]);
    setSelectedSubject([]);
    setSelectedYear([]);
    setSelectedCourseIds([]);
    setSelectedTeacher([]);
    setSelectedActivityLevel([]);
    setSelectedGradeRanges([]);
  };

  const years = filters?.years || [];
  const courses = filters?.courses || [];
  const teachers = filters?.teachers || [];
  const subjects = filters?.subjects || [];
  const semesters = filters?.semesters || [];
  const activityLevels = filters?.activityLevels || [];

  if (loading && !overview) {
    return (
      <DashboardLayout filters={<div className="text-text-muted">Cargando filtros...</div>}>
        <div className="space-y-4">
          <div className="h-10 w-64 animate-pulse rounded-md bg-surface" />
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 animate-pulse rounded-xl bg-surface" />
            ))}
          </div>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-80 animate-pulse rounded-xl bg-surface" />
            ))}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      filters={
        <Filter
          selectedSemester={selectedSemester}
          onSemesterChange={setSelectedSemester}
          semesters={semesters}
          selectedSubject={selectedSubject}
          onSubjectChange={setSelectedSubject}
          subjects={subjects}
          selectedYear={selectedYear}
          onYearChange={setSelectedYear}
          years={years}
          selectedCourse={selectedCourseIds}
          onCourseChange={setSelectedCourseIds}
          courses={courses}
          selectedTeacher={selectedTeacher}
          onTeacherChange={setSelectedTeacher}
          teachers={teachers}
          selectedActivityLevel={selectedActivityLevel}
          onActivityLevelChange={setSelectedActivityLevel}
          activityLevels={activityLevels}
          selectedGradeRanges={selectedGradeRanges}
          onGradeRangesChange={setSelectedGradeRanges}
          onClearFilters={clearFilters}
        />
      }
    >
      <Navbar />

      <KPIGrid data={overview} />

      <div className="mb-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
        <PerformanceDistributionChart data={gradeDistribution} />
        <SubjectRankingChart data={performance} />
      </div>

      <div className="mb-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
        <ResourceBarChart data={usage} />
        <LibraryAvailabilityChart data={availability} />
      </div>

      <div className="mb-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
        <TrendLineChart data={trend} />
        <ActivityLevelChart data={activityByLevel} />
      </div>
    </DashboardLayout>
  );
}

export default DashboardPage;
