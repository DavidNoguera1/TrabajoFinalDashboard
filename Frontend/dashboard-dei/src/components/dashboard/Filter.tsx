import type { CourseFilterOption } from "../../types/dashboard";

interface SearchableInputProps {
  label: string;
  listId: string;
  value: string | null;
  options: string[];
  onChange: (value: string | null) => void;
  emptyLabel?: string;
  placeholder?: string;
}

interface FilterProps {
  selectedSemester: string | null;
  onSemesterChange: (semester: string | null) => void;
  semesters: number[];
  selectedSubject: string | null;
  onSubjectChange: (subject: string | null) => void;
  subjects: string[];
  selectedYear: string | null;
  onYearChange: (year: string | null) => void;
  years: number[];
  selectedCourse: string | null;
  onCourseChange: (course: string | null) => void;
  courses: CourseFilterOption[];
  selectedTeacher: string | null;
  onTeacherChange: (teacher: string | null) => void;
  teachers: string[];
  selectedActivityLevel: string | null;
  onActivityLevelChange: (value: string | null) => void;
  activityLevels: string[];
  selectedGradeMin: string | null;
  onGradeMinChange: (value: string | null) => void;
  selectedGradeMax: string | null;
  onGradeMaxChange: (value: string | null) => void;
  onClearFilters: () => void;
}

const SearchableInput = ({
  label,
  listId,
  value,
  options,
  onChange,
  emptyLabel = "Todos",
  placeholder = "Escribe para buscar...",
}: SearchableInputProps) => (
  <div>
    <label className="mb-2 block text-sm font-medium text-text-main">{label}</label>
    <input
      list={listId}
      value={value ?? ""}
      onChange={(event) => onChange(event.target.value || null)}
      placeholder={placeholder}
      autoComplete="off"
      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-text-main transition focus:border-primary focus:outline-none"
    />
    <datalist id={listId}>
      <option value="">{emptyLabel}</option>
      {options.map((option) => (
        <option key={option} value={option} />
      ))}
    </datalist>
  </div>
);

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
  selectedGradeMin,
  onGradeMinChange,
  selectedGradeMax,
  onGradeMaxChange,
  onClearFilters,
}: FilterProps) {
  const semesterOptions = semesters.map((semester) => String(semester));
  const yearOptions = years.map((year) => String(year));
  const uniqueYear = years.length === 1 ? years[0] : null;

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
        <SearchableInput
          label="Año"
          listId="year-options"
          value={selectedYear}
          options={yearOptions}
          onChange={onYearChange}
        />
      )}

      <SearchableInput
        label="Semestre Estudiante"
        listId="semester-options"
        value={selectedSemester}
        options={semesterOptions}
        onChange={onSemesterChange}
        placeholder="Ejemplo: 5"
      />

      <div>
        <label className="mb-2 block text-sm font-medium text-text-main">Curso</label>
        <input
          list="course-options"
          value={selectedCourse ?? ""}
          onChange={(event) => onCourseChange(event.target.value || null)}
          placeholder="Escribe para buscar curso..."
          autoComplete="off"
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-text-main transition focus:border-primary focus:outline-none"
        />
        <datalist id="course-options">
          <option value="">Todos</option>
          {courses.map((course) => (
            <option key={course.id} value={course.label} />
          ))}
        </datalist>
      </div>

      <SearchableInput
        label="Nivel Actividad Biblioteca"
        listId="activity-level-options"
        value={selectedActivityLevel}
        options={activityLevels}
        onChange={onActivityLevelChange}
      />

      <div>
        <label className="mb-2 block text-sm font-medium text-text-main">Rango de Calificación</label>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            min={0}
            max={5}
            step={0.1}
            value={selectedGradeMin ?? ""}
            onChange={(event) => onGradeMinChange(event.target.value || null)}
            placeholder="Mín"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-text-main transition focus:border-primary focus:outline-none"
          />
          <input
            type="number"
            min={0}
            max={5}
            step={0.1}
            value={selectedGradeMax ?? ""}
            onChange={(event) => onGradeMaxChange(event.target.value || null)}
            placeholder="Máx"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-text-main transition focus:border-primary focus:outline-none"
          />
        </div>
        <p className="mt-1 text-xs text-text-muted">Ejemplo: 0.0 a 0.5, o 4.5 a 5.0</p>
      </div>

      <SearchableInput
        label="Docente"
        listId="teacher-options"
        value={selectedTeacher}
        options={teachers}
        onChange={onTeacherChange}
      />

      <SearchableInput
        label="Asignatura"
        listId="subject-options"
        value={selectedSubject}
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
