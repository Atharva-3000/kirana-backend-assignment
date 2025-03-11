import Bull from 'bull';
import type { JobId, Visit } from '../models/job.js';
import { storeService } from '../services/storeService.js';
import { imageService } from '../services/imageService.js';
import { jobService } from '../services/jobService.js';

// Create queues
export const imageProcessingQueue = new Bull('image-processing');

// Process individual images with concurrency control
imageProcessingQueue.process(5, async (job) => {
    const { imageUrl, storeId, jobId } = job.data;

    try {
        const imageBuffer = await imageService.downloadImage(imageUrl);
        const perimeter = imageService.calculatePerimeter(imageBuffer);
        await imageService.simulateGpuProcessing();

        return { success: true, perimeter };
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        jobService.updateJobError(jobId, storeId, errorMessage);
        return { success: false, error: errorMessage };
    }
});

export const addToQueue = async (jobId: JobId, visits: Visit[]): Promise<void> => {
    // First validate all store IDs
    for (const visit of visits) {
        const { store_id } = visit;
        if (!(await storeService.isStoreValid(store_id))) {
            jobService.updateJobError(jobId, store_id, 'Invalid store ID');
            continue;
        }

        // Add each image URL to the queue
        for (const url of visit.image_url) {
            await imageProcessingQueue.add({
                imageUrl: url,
                storeId: store_id,
                jobId
            }, {
                attempts: 3,
                backoff: {
                    type: 'exponential',
                    delay: 1000
                }
            });
        }
    }
};