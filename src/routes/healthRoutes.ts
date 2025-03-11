import { Router } from 'express';
import { getMetrics } from '../utils/logger.js';
import { imageProcessingQueue } from '../queue/jobQueue.js';

const router = Router();

// Basic health check endpoint
router.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});

// Detailed metrics endpoint
router.get('/metrics', async (req, res) => {
    // Get queue metrics
    const jobCounts = await imageProcessingQueue.getJobCounts();

    res.status(200).json({
        status: 'ok',
        metrics: {
            ...getMetrics(),
            queue: {
                waiting: jobCounts.waiting,
                active: jobCounts.active,
                completed: jobCounts.completed,
                failed: jobCounts.failed
            }
        }
    });
});

export default router;