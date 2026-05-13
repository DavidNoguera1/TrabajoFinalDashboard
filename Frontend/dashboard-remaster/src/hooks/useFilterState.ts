/**
 * hooks/useFilterState.ts
 *
 * Single source of truth for the active filter selections.
 * Completely decoupled from the data store — it only knows about
 * what the user has selected, not what data those selections produce.
 *
 * Design principles:
 * - One reducer, one state object — no scattered useState calls
 * - All mutations go through typed actions
 * - Derived `activeFilters` is memoized
 */

import { useCallback, useMemo, useReducer } from "react";
import type { ActiveFilters, FiltersCatalog } from "../types/dashboard";

// ─── State shape ──────────────────────────────────────────────────────────────

interface FilterUIState {
  year: number | null;
  semesters: number[];
  courseLabels: string[];   // UI stores labels; adapter converts to IDs
  teachers: string[];
  subjects: string[];
  activityLevels: string[];
  gradeMin: string;         // string for input control, converted to number on output
  gradeMax: string;
}

const INITIAL: FilterUIState = {
  year: null,
  semesters: [],
  courseLabels: [],
  teachers: [],
  subjects: [],
  activityLevels: [],
  gradeMin: "",
  gradeMax: "",
};

// ─── Actions ──────────────────────────────────────────────────────────────────

type Action =
  | { type: "SET_YEAR"; value: number | null }
  | { type: "TOGGLE_SEMESTER"; value: number }
  | { type: "TOGGLE_COURSE"; label: string }
  | { type: "TOGGLE_TEACHER"; value: string }
  | { type: "TOGGLE_SUBJECT"; value: string }
  | { type: "TOGGLE_ACTIVITY_LEVEL"; value: string }
  | { type: "SET_GRADE_MIN"; value: string }
  | { type: "SET_GRADE_MAX"; value: string }
  | { type: "CLEAR" };

// ─── Reducer ──────────────────────────────────────────────────────────────────

const toggle = <T>(arr: T[], value: T): T[] =>
  arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];

function reducer(state: FilterUIState, action: Action): FilterUIState {
  switch (action.type) {
    case "SET_YEAR":
      return { ...state, year: action.value };
    case "TOGGLE_SEMESTER":
      return { ...state, semesters: toggle(state.semesters, action.value) };
    case "TOGGLE_COURSE":
      return { ...state, courseLabels: toggle(state.courseLabels, action.label) };
    case "TOGGLE_TEACHER":
      return { ...state, teachers: toggle(state.teachers, action.value) };
    case "TOGGLE_SUBJECT":
      return { ...state, subjects: toggle(state.subjects, action.value) };
    case "TOGGLE_ACTIVITY_LEVEL":
      return { ...state, activityLevels: toggle(state.activityLevels, action.value) };
    case "SET_GRADE_MIN":
      return { ...state, gradeMin: action.value };
    case "SET_GRADE_MAX":
      return { ...state, gradeMax: action.value };
    case "CLEAR":
      return INITIAL;
    default:
      return state;
  }
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useFilterState(catalog: FiltersCatalog | null) {
  const [state, dispatch] = useReducer(reducer, INITIAL);

  // Convert UI state → API-ready ActiveFilters
  const activeFilters = useMemo<ActiveFilters>(() => {
    // Resolve course labels → IDs using catalog
    const courseIds = state.courseLabels
      .map((label) => catalog?.courses.find((c) => c.label === label)?.id)
      .filter((id): id is number => id !== undefined);

    // Default to single year when catalog has only one
    const year =
      state.year !== null
        ? state.year
        : catalog?.years.length === 1
        ? catalog.years[0]
        : null;

    const gradeMin = state.gradeMin !== "" ? Number(state.gradeMin) : null;
    const gradeMax = state.gradeMax !== "" ? Number(state.gradeMax) : null;

    return {
      year,
      semesters: state.semesters,
      courseIds,
      teachers: state.teachers,
      subjects: state.subjects,
      activityLevels: state.activityLevels,
      gradeMin: Number.isFinite(gradeMin ?? NaN) ? (gradeMin as number) : null,
      gradeMax: Number.isFinite(gradeMax ?? NaN) ? (gradeMax as number) : null,
    };
  }, [state, catalog]);

  // Stable action callbacks
  const setYear = useCallback(
    (value: number | null) => dispatch({ type: "SET_YEAR", value }),
    []
  );
  const toggleSemester = useCallback(
    (value: number) => dispatch({ type: "TOGGLE_SEMESTER", value }),
    []
  );
  const toggleCourse = useCallback(
    (label: string) => dispatch({ type: "TOGGLE_COURSE", label }),
    []
  );
  const toggleTeacher = useCallback(
    (value: string) => dispatch({ type: "TOGGLE_TEACHER", value }),
    []
  );
  const toggleSubject = useCallback(
    (value: string) => dispatch({ type: "TOGGLE_SUBJECT", value }),
    []
  );
  const toggleActivityLevel = useCallback(
    (value: string) => dispatch({ type: "TOGGLE_ACTIVITY_LEVEL", value }),
    []
  );
  const setGradeMin = useCallback(
    (value: string) => dispatch({ type: "SET_GRADE_MIN", value }),
    []
  );
  const setGradeMax = useCallback(
    (value: string) => dispatch({ type: "SET_GRADE_MAX", value }),
    []
  );
  const clearAll = useCallback(() => dispatch({ type: "CLEAR" }), []);

  // Count of active filter groups (for badge display)
  const activeCount = useMemo(() => {
    let count = 0;
    if (state.year !== null) count++;
    if (state.semesters.length > 0) count++;
    if (state.courseLabels.length > 0) count++;
    if (state.teachers.length > 0) count++;
    if (state.subjects.length > 0) count++;
    if (state.activityLevels.length > 0) count++;
    if (state.gradeMin !== "" || state.gradeMax !== "") count++;
    return count;
  }, [state]);

  return {
    // UI state (for controlled inputs)
    uiState: state,
    // API-ready filters
    activeFilters,
    // Active filter count
    activeCount,
    // Actions
    setYear,
    toggleSemester,
    toggleCourse,
    toggleTeacher,
    toggleSubject,
    toggleActivityLevel,
    setGradeMin,
    setGradeMax,
    clearAll,
  };
}
