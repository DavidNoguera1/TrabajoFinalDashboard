import { useState, useMemo } from "react";
import type { CourseFilterOption } from "../../types/dashboard";

interface MultiSelectProps {
  label: string;
  selectedValues: string[];
  options: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
}

const MultiSelect = ({
  label,
  selectedValues,
  options,
  onChange,
  placeholder = "Buscar...",
}: MultiSelectProps) => {
  const [search, setSearch] = useState("");

  const filteredOptions = useMemo(() => {
    if (!search.trim()) return options;
    const lower = search.toLowerCase();
    return options.filter((opt) => opt.toLowerCase().includes(lower));
  }, [options, search]);

  const handleToggle = (option: string) => {
    if (selectedValues.includes(option)) {
      onChange(selectedValues.filter((v) => v !== option));
    } else {
      onChange([...selectedValues, option]);
    }
  };

  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-text-main">{label}</label>
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder={placeholder}
        className="mb-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm text-text-main transition focus:border-primary focus:outline-none"
      />
      <div className="max-h-40 space-y-1 overflow-y-auto rounded border border-slate-300 bg-white p-2">
        {filteredOptions.length === 0 ? (
          <p className="text-xs text-text-muted">No hay opciones</p>
        ) : (
          filteredOptions.map((option) => (
            <label
              key={option}
              className="flex cursor-pointer items-center gap-2 rounded px-1 py-1 hover:bg-slate-50"
            >
              <input
                type="checkbox"
                checked={selectedValues.includes(option)}
                onChange={() => handleToggle(option)}
                className="rounded border-slate-300 text-primary focus:ring-primary"
              />
              <span className="text-sm text-text-main">{option}</span>
            </label>
          ))
        )}
      </div>
      {selectedValues.length > 0 && (
        <p className="mt-1 text-xs text-text-muted">
          {selectedValues.length} seleccionado{selectedValues.length > 1 ? "s" : ""}
        </p>
      )}
    </div>
  );
};

interface FilterProps {
  selectedSemester: string[];
  onSemesterChange: (semester: string[]) => void;
  semesters: number[];
  selectedSubject: string[];
  onSubjectChange: (subject: string[]) => void;
  subjects: string[];
  selectedYear: string[];
  onYearChange: (year: string[]) => void;
  years: number[];
  selectedCourse: number[];
  onCourseChange: (course: number[]) => void;
  courses: CourseFilterOption[];
  selectedTeacher: string[];
  onTeacherChange: (teacher: string[]) => void;
  teachers: string[];
  selectedActivityLevel: string[];
  onActivityLevelChange: (value: string[]) => void;
  activityLevels: string[];
  selectedGradeRanges: string[];
  onGradeRangesChange: (value: string[]) => void;
  onClearFilters: () => void;
}

export default function Filter({
  selectedSemester,
  onSemesterChange,
  semesters,
  selectedSubject,
  onSubjectChange,
  subjects,
  selectedYear,
  onYearChange,
  years,
  selectedCourse,
  onCourseChange,
  courses,
  selectedTeacher,
  onTeacherChange,
  teachers,
  selectedActivityLevel,
  onActivityLevelChange,
  activityLevels,
  selectedGradeRanges,
  onGradeRangesChange,
  onClearFilters,
}: FilterProps) {
  const gradeRanges = [
    "0.0 - 0.5",
    "0.5 - 1.0",
    "1.0 - 1.5",
    "1.5 - 2.0",
    "2.0 - 2.5",
    "2.5 - 3.0",
    "3.0 - 3.5",
    "3.5 - 4.0",
    "4.0 - 4.5",
    "4.5 - 5.0",
  ];
  const semesterOptions = semesters.map((semester) => String(semester));
  const yearOptions = years.map((year) => String(year));
  const uniqueYear = years.length === 1 ? years[0] : null;

  const [courseSearch, setCourseSearch] = useState("");

  const filteredCourses = useMemo(() => {
    if (!courseSearch.trim()) return courses;
    const lower = courseSearch.toLowerCase();
    return courses.filter((c) => c.label.toLowerCase().includes(lower));
  }, [courses, courseSearch]);

  return (
    <div className="space-y-4">
      {uniqueYear ? (
        <div>
          <label className="mb-2 block text-sm font-medium text-text-main">Año</label>
          <input
            value={String(uniqueYear)}
            disabled
            className="w-full cursor-not-allowed rounded-lg border border-slate-300 bg-slate-100 px-3 py-2 text-text-muted"
          />
          <p className="mt-1 text-xs text-text-muted">Solo hay datos para este año.</p>
        </div>
      ) : (
        <MultiSelect
          label="Año"
          selectedValues={selectedYear}
          options={yearOptions}
          onChange={onYearChange}
        />
      )}

      <MultiSelect
        label="Semestre Estudiante"
        selectedValues={selectedSemester}
        options={semesterOptions}
        onChange={onSemesterChange}
        placeholder="Buscar semestre..."
      />

      <div>
        <label className="mb-2 block text-sm font-medium text-text-main">Curso</label>
        <input
          type="text"
          value={courseSearch}
          onChange={(e) => setCourseSearch(e.target.value)}
          placeholder="Buscar curso..."
          className="mb-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm text-text-main transition focus:border-primary focus:outline-none"
        />
        <div className="max-h-40 space-y-1 overflow-y-auto rounded border border-slate-300 bg-white p-2">
          {filteredCourses.map((course) => (
            <label
              key={course.id}
              className="flex cursor-pointer items-center gap-2 rounded px-1 py-1 hover:bg-slate-50"
            >
              <input
                type="checkbox"
                checked={selectedCourse.includes(course.id)}
                onChange={(event) => {
                  if (event.target.checked) {
                    onCourseChange([...selectedCourse, course.id]);
                  } else {
                    onCourseChange(selectedCourse.filter((c) => c !== course.id));
                  }
                }}
                className="rounded border-slate-300 text-primary focus:ring-primary"
              />
              <span className="text-sm text-text-main">{course.label}</span>
            </label>
          ))}
        </div>
        {selectedCourse.length > 0 && (
          <p className="mt-1 text-xs text-text-muted">
            {selectedCourse.length} seleccionado{selectedCourse.length > 1 ? "s" : ""}
          </p>
        )}
      </div>

      <MultiSelect
        label="Nivel Actividad Biblioteca"
        selectedValues={selectedActivityLevel}
        options={activityLevels}
        onChange={onActivityLevelChange}
      />

      <MultiSelect
        label="Rango de Calificación"
        selectedValues={selectedGradeRanges}
        options={gradeRanges}
        onChange={onGradeRangesChange}
      />

      <MultiSelect
        label="Docente"
        selectedValues={selectedTeacher}
        options={teachers}
        onChange={onTeacherChange}
      />

      <MultiSelect
        label="Asignatura"
        selectedValues={selectedSubject}
        options={subjects}
        onChange={onSubjectChange}
      />

      <button
        type="button"
        onClick={onClearFilters}
        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-text-main transition hover:bg-slate-50"
      >
        Limpiar filtros
      </button>
    </div>
  );
}