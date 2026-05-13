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

  const [selectedSemester, setSelectedSemester] = useState<string | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [selectedTeacher, setSelectedTeacher] = useState<string | null>(null);
  const [selectedActivityLevel, setSelectedActivityLevel] = useState<string | null>(null);
  const [selectedGradeMin, setSelectedGradeMin] = useState<string | null>(null);
  const [selectedGradeMax, setSelectedGradeMax] = useState<string | null>(null);

  useEffect(() => {
    fetchFilters();
  }, [fetchFilters]);

  const appliedFilters = useMemo<DashboardQueryFilters>(() => {
    const defaultYear =
      filters?.years && filters.years.length === 1 ? String(filters.years[0]) : null;
    const year = toNumberOrUndefined(selectedYear ?? defaultYear);
    const semesterNumber = toNumberOrUndefined(selectedSemester);
    const normalizedCourse = (selectedCourse || "").trim().toLowerCase();
    const exactCourseMatch = (filters?.courses || []).find(
      (course) => course.label.trim().toLowerCase() === normalizedCourse
    );
    const partialMatches = (filters?.courses || []).filter((course) =>
      course.label.trim().toLowerCase().includes(normalizedCourse)
    );
    const matchedCourse =
      exactCourseMatch || (normalizedCourse && partialMatches.length === 1 ? partialMatches[0] : undefined);
    const courseId = matchedCourse?.id ?? toNumberOrUndefined(selectedCourse);
    const gradeMin = toNumberOrUndefined(selectedGradeMin);
    const gradeMax = toNumberOrUndefined(selectedGradeMax);

    return {
      ...(typeof year === "number" ? { year } : {}),
      ...(typeof semesterNumber === "number" ? { semester: Math.trunc(semesterNumber) } : {}),
      ...(typeof courseId === "number" ? { courseId } : {}),
      ...(selectedTeacher ? { teacher: selectedTeacher } : {}),
      ...(selectedSubject ? { subject: selectedSubject } : {}),
      ...(selectedActivityLevel ? { activityLevel: selectedActivityLevel } : {}),
      ...(typeof gradeMin === "number" ? { gradeMin } : {}),
      ...(typeof gradeMax === "number" ? { gradeMax } : {}),
    };
  }, [
    filters,
    selectedYear,
    selectedSemester,
    selectedCourse,
    selectedTeacher,
    selectedSubject,
    selectedActivityLevel,
    selectedGradeMin,
    selectedGradeMax,
  ]);

  useEffect(() => {
    fetchDashboardData(appliedFilters);
  }, [fetchDashboardData, appliedFilters]);

  const clearFilters = () => {
    setSelectedSemester(null);
    setSelectedSubject(null);
    setSelectedYear(null);
    setSelectedCourse(null);
    setSelectedTeacher(null);
    setSelectedActivityLevel(null);
    setSelectedGradeMin(null);
    setSelectedGradeMax(null);
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
          selectedCourse={selectedCourse}
          onCourseChange={setSelectedCourse}
          courses={courses}
          selectedTeacher={selectedTeacher}
          onTeacherChange={setSelectedTeacher}
          teachers={teachers}
          selectedActivityLevel={selectedActivityLevel}
          onActivityLevelChange={setSelectedActivityLevel}
          activityLevels={activityLevels}
          selectedGradeMin={selectedGradeMin}
          onGradeMinChange={setSelectedGradeMin}
          selectedGradeMax={selectedGradeMax}
          onGradeMaxChange={setSelectedGradeMax}
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
