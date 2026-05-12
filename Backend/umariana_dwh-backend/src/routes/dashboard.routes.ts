import { Router } from 'express';
import {
  academicAttendanceTrend,
  academicPerformance,
  libraryAvailability,
  libraryUsage,
  overview
} from '../controllers/dashboard.controller';

const router = Router();

router.get('/overview', overview);
router.get('/academic/performance', academicPerformance);
router.get('/academic/attendance-trend', academicAttendanceTrend);
router.get('/library/usage-by-type', libraryUsage);
router.get('/library/availability', libraryAvailability);

export default router;
