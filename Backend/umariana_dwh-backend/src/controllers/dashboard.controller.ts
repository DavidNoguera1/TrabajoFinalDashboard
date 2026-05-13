import { NextFunction, Request, Response } from 'express';
import {
  getAcademicAttendanceByStudentSemester,
  getAcademicAttendanceByWeekday,
  DashboardFilters,
  getAcademicAttendanceTrend,
  getAcademicGradeDistributionByStudent,
  getAcademicPerformanceBySubject,
  getFilters,
  getLibraryActivityByLevel,
  getLibraryAvailability,
  getLibraryUsageByType,
  getOverview
} from '../repositories/dashboard.repository';

const parseNumberParam = (value: unknown): number | number[] | undefined => {
  const parseValue = (raw: string): number | undefined => {
    const trimmed = raw.trim();
    if (!trimmed) return undefined;
    const parsed = Number(trimmed);
    return Number.isFinite(parsed) ? parsed : undefined;
  };

  const normalizeString = (raw: string): number[] =>
    raw
      .split(",")
      .map((item) => parseValue(item))
      .filter((item): item is number => typeof item === 'number');

  if (typeof value === 'string') {
    const parsedValues = normalizeString(value);
    if (parsedValues.length === 0) return undefined;
    return parsedValues.length === 1 ? parsedValues[0] : parsedValues;
  }

  if (Array.isArray(value)) {
    const parsedValues = value
      .flatMap((item) =>
        typeof item === 'string' ? normalizeString(item) : []
      )
      .filter((item): item is number => typeof item === 'number');

    return parsedValues.length > 0 ? parsedValues : undefined;
  }

  return undefined;
};

const normalizeNumberArray = (
  value: number | number[] | undefined,
  validator?: (n: number) => boolean
): number | number[] | undefined => {
  if (typeof value === 'number') {
    const normalized = Math.trunc(value);
    return validator && !validator(normalized) ? undefined : normalized;
  }

  if (Array.isArray(value)) {
    const filtered = value
      .filter((n) => typeof n === 'number')
      .map((n) => Math.trunc(n))
      .filter((n) => (validator ? validator(n) : true));

    return filtered.length > 0 ? filtered : undefined;
  }

  return undefined;
};

const parseStringParam = (value: unknown): string | string[] | undefined => {
  const normalizeString = (raw: string): string[] =>
    raw
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item.length > 0);

  if (typeof value === 'string') {
    const values = normalizeString(value);
    if (values.length === 0) return undefined;
    return values.length === 1 ? values[0] : values;
  }

  if (Array.isArray(value)) {
    const filtered = value
      .flatMap((item) =>
        typeof item === 'string' ? normalizeString(item) : []
      )
      .filter((item) => item.length > 0);
    return filtered.length > 0 ? filtered : undefined;
  }

  return undefined;
};

const getDashboardFilters = (req: Request): DashboardFilters => {
  console.log('==============================');
  console.log('[DASHBOARD REQUEST]');
  console.log('RAW QUERY:', req.query);
  console.log('==============================');

  const yearRaw = parseNumberParam(req.query.year);
  const semesterRaw = parseNumberParam(req.query.semester);
  const courseIdRaw = parseNumberParam(req.query.courseId);
  const teacher = parseStringParam(req.query.teacher);
  const subject = parseStringParam(req.query.subject);
  const activityLevel = parseStringParam(req.query.activityLevel);
  const gradeMinRaw = parseNumberParam(req.query.gradeMin);
  const gradeMaxRaw = parseNumberParam(req.query.gradeMax);

  const year = normalizeNumberArray(yearRaw, (n) => Number.isInteger(n) && n > 0);
  const semester = normalizeNumberArray(semesterRaw, (n) => Number.isInteger(n) && n >= 1 && n <= 20);
  const courseId = normalizeNumberArray(courseIdRaw, (n) => Number.isInteger(n) && n > 0);
  const gradeMin =
    typeof gradeMinRaw === 'number' && gradeMinRaw >= 0 && gradeMinRaw <= 5
      ? Math.trunc(gradeMinRaw)
      : undefined;
  const gradeMax =
    typeof gradeMaxRaw === 'number' && gradeMaxRaw >= 0 && gradeMaxRaw <= 5
      ? Math.trunc(gradeMaxRaw)
      : undefined;

  const normalizedFilters: DashboardFilters = {
    ...(year !== undefined ? { year } : {}),
    ...(semester !== undefined ? { semester } : {}),
    ...(courseId !== undefined ? { courseId } : {}),
    ...(teacher ? { teacher } : {}),
    ...(subject ? { subject } : {}),
    ...(activityLevel ? { activityLevel } : {}),
    ...(typeof gradeMin === 'number' ? { gradeMin } : {}),
    ...(typeof gradeMax === 'number' ? { gradeMax } : {}),
  };

  console.log('==============================');
  console.log('[FILTERS]');
  console.log('NORMALIZED FILTERS:', normalizedFilters);
  console.log('==============================');
  return normalizedFilters;
};

export const filters = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await getFilters();
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const overview = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const filters = getDashboardFilters(req);
    console.log('==============================');
    console.log('[DASHBOARD] overview endpoint called');
    console.log('==============================');
    const data = await getOverview(filters);
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const academicPerformance = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const filters = getDashboardFilters(req);
    console.log('==============================');
    console.log('[DASHBOARD] academic/performance endpoint called');
    console.log('==============================');
    const data = await getAcademicPerformanceBySubject(filters);
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const academicAttendanceTrend = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const filters = getDashboardFilters(req);
    console.log('==============================');
    console.log('[DASHBOARD] academic/attendance-trend endpoint called');
    console.log('==============================');
    const data = await getAcademicAttendanceTrend(filters);
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const academicAttendanceWeekday = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const filters = getDashboardFilters(req);
    console.log('==============================');
    console.log('[DASHBOARD] academic/attendance-weekday endpoint called');
    console.log('==============================');
    const data = await getAcademicAttendanceByWeekday(filters);
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const academicAttendanceByStudentSemester = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const filters = getDashboardFilters(req);
    console.log('==============================');
    console.log('[DASHBOARD] academic/attendance-by-student-semester endpoint called');
    console.log('==============================');
    const data = await getAcademicAttendanceByStudentSemester(filters);
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const academicGradeDistribution = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const filters = getDashboardFilters(req);
    console.log('==============================');
    console.log('[DASHBOARD] academic/grade-distribution endpoint called');
    console.log('==============================');
    const data = await getAcademicGradeDistributionByStudent(filters);
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const libraryUsage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const filters = getDashboardFilters(req);
    console.log('==============================');
    console.log('[DASHBOARD] library/usage-by-type endpoint called');
    console.log('==============================');
    const data = await getLibraryUsageByType(filters);
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const libraryAvailability = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const filters = getDashboardFilters(req);
    console.log('==============================');
    console.log('[DASHBOARD] library/availability endpoint called');
    console.log('==============================');
    const data = await getLibraryAvailability(filters);
    console.log('==============================');
    console.log('[KPI] library/availability result:', data);
    console.log('==============================');
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const libraryActivityByLevel = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const filters = getDashboardFilters(req);
    console.log('==============================');
    console.log('[DASHBOARD] library/activity-by-level endpoint called');
    console.log('==============================');
    const data = await getLibraryActivityByLevel(filters);
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};
