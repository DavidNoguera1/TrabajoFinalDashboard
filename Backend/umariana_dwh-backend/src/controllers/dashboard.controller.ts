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

const parseNumberParam = (value: unknown): number | undefined => {
  if (typeof value !== 'string' || !value.trim()) {
    return undefined;
  }

  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    return undefined;
  }

  return parsed;
};

const parseStringParam = (value: unknown): string | undefined => {
  if (typeof value !== 'string') {
    return undefined;
  }

  const normalized = value.trim();
  return normalized ? normalized : undefined;
};

const parseNumberArrayParam = (value: unknown): number[] | undefined => {
  if (typeof value === 'string') {
    const parsed = parseNumberParam(value);
    return parsed ? [parsed] : undefined;
  }
  if (Array.isArray(value)) {
    const numbers = value
      .map(v => parseNumberParam(v))
      .filter((v): v is number => typeof v === 'number');
    return numbers.length > 0 ? numbers : undefined;
  }
  return undefined;
};

const parseStringArrayParam = (value: unknown): string[] | undefined => {
  if (typeof value === 'string' && value.trim()) {
    return [value.trim()];
  }
  if (Array.isArray(value)) {
    const strings = value
      .map(v => parseStringParam(v))
      .filter((v): v is string => typeof v === 'string');
    return strings.length > 0 ? strings : undefined;
  }
  return undefined;
};

const getDashboardFilters = (req: Request): DashboardFilters => {
  const year = parseNumberParam(req.query.year);
  const semesters = parseNumberArrayParam(req.query.semesters);
  const courseIds = parseNumberArrayParam(req.query.courseIds);
  const teachers = parseStringArrayParam(req.query.teachers);
  const subjects = parseStringArrayParam(req.query.subjects);
  const activityLevels = parseStringArrayParam(req.query.activityLevels);
  const gradeMinRaw = parseNumberParam(req.query.gradeMin);
  const gradeMaxRaw = parseNumberParam(req.query.gradeMax);

  const gradeMin =
    typeof gradeMinRaw === 'number' && gradeMinRaw >= 0 && gradeMinRaw <= 5
      ? gradeMinRaw
      : undefined;
  const gradeMax =
    typeof gradeMaxRaw === 'number' && gradeMaxRaw >= 0 && gradeMaxRaw <= 5
      ? gradeMaxRaw
      : undefined;

  return {
    ...(typeof year === 'number' ? { year } : {}),
    ...(semesters ? { semesters: semesters.map(s => Math.trunc(s)).filter(s => s >= 1 && s <= 20) } : {}),
    ...(courseIds ? { courseIds } : {}),
    ...(teachers ? { teachers } : {}),
    ...(subjects ? { subjects } : {}),
    ...(activityLevels ? { activityLevels } : {}),
    ...(typeof gradeMin === 'number' ? { gradeMin } : {}),
    ...(typeof gradeMax === 'number' ? { gradeMax } : {})
  };
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
    const data = await getOverview(getDashboardFilters(req));
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const academicPerformance = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await getAcademicPerformanceBySubject(getDashboardFilters(req));
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const academicAttendanceTrend = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await getAcademicAttendanceTrend(getDashboardFilters(req));
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const academicAttendanceWeekday = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await getAcademicAttendanceByWeekday(getDashboardFilters(req));
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
    const data = await getAcademicAttendanceByStudentSemester(getDashboardFilters(req));
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const academicGradeDistribution = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await getAcademicGradeDistributionByStudent(getDashboardFilters(req));
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const libraryUsage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await getLibraryUsageByType(getDashboardFilters(req));
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const libraryAvailability = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await getLibraryAvailability(getDashboardFilters(req));
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const libraryActivityByLevel = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await getLibraryActivityByLevel(getDashboardFilters(req));
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};
