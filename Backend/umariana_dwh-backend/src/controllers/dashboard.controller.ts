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

const getDashboardFilters = (req: Request): DashboardFilters => {
  const year = parseNumberParam(req.query.year);
  const semesterRaw = parseNumberParam(req.query.semester);
  const courseId = parseNumberParam(req.query.courseId);
  const teacher = parseStringParam(req.query.teacher);
  const subject = parseStringParam(req.query.subject);
  const activityLevel = parseStringParam(req.query.activityLevel);
  const gradeMinRaw = parseNumberParam(req.query.gradeMin);
  const gradeMaxRaw = parseNumberParam(req.query.gradeMax);

  const semester =
    typeof semesterRaw === 'number' && semesterRaw >= 1 && semesterRaw <= 20
      ? Math.trunc(semesterRaw)
      : undefined;
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
    ...(typeof semester === 'number' ? { semester } : {}),
    ...(typeof courseId === 'number' ? { courseId } : {}),
    ...(teacher ? { teacher } : {}),
    ...(subject ? { subject } : {}),
    ...(activityLevel ? { activityLevel } : {}),
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
