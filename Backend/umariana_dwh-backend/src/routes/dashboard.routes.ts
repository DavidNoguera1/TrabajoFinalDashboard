import { Router } from 'express';
import {
  academicAttendanceByStudentSemester,
  academicAttendanceTrend,
  academicAttendanceWeekday,
  academicGradeDistribution,
  academicPerformance,
  filters,
  libraryActivityByLevel,
  libraryAvailability,
  libraryUsage,
  overview
} from '../controllers/dashboard.controller';

const router = Router();

router.get('/filters', filters);
router.get('/overview', overview);
router.get('/academic/performance', academicPerformance);
router.get('/academic/attendance-trend', academicAttendanceTrend);
router.get('/academic/attendance-weekday', academicAttendanceWeekday);
router.get('/academic/attendance-by-student-semester', academicAttendanceByStudentSemester);
router.get('/academic/grade-distribution', academicGradeDistribution);
router.get('/library/usage-by-type', libraryUsage);
router.get('/library/availability', libraryAvailability);
router.get('/library/activity-by-level', libraryActivityByLevel);

export default router;
