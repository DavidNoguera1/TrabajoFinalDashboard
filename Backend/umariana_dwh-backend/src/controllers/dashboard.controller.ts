import { NextFunction, Request, Response } from 'express';
import {
  getAcademicAttendanceTrend,
  getAcademicPerformanceBySubject,
  getLibraryAvailability,
  getLibraryUsageByType,
  getOverview
} from '../repositories/dashboard.repository';

export const overview = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await getOverview();
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const academicPerformance = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await getAcademicPerformanceBySubject();
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const academicAttendanceTrend = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await getAcademicAttendanceTrend();
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const libraryUsage = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await getLibraryUsageByType();
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const libraryAvailability = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await getLibraryAvailability();
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};
