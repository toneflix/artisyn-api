import { Router } from 'express';
import { getActivityLogs } from '../../controllers/ActivityLogController';

const router = Router();

// GET /api/activity-logs
router.get('/activity-logs', getActivityLogs);

export default router;
