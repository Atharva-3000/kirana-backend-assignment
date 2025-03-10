import { Router, type Request, type Response } from 'express';
import { submitJob, getJobStatus } from '../controllers/jobController.js';

const router = Router();

router.post('/submit', submitJob);
router.get('/status', getJobStatus);

export default router;