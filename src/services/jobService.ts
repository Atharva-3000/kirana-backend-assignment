import { v4 as uuidv4 } from 'uuid';
import type { Job, JobId, Visit, JobError } from '../models/job.js';
import { storeService } from './storeService.js';
import { imageService } from './imageService.js';

class JobService {
  private jobs: Map<JobId, Job> = new Map();

  createJob(visits: Visit[]): JobId {
    const jobId = uuidv4();
    const job: Job = {
      status: 'ongoing',
      errors: [],
      data: { visits }
    };
    
    this.jobs.set(jobId, job);
    this.processJob(job);
    
    return jobId;
  }

  getJob(jobId: JobId): Job | undefined {
    return this.jobs.get(jobId);
  }

  private async processJob(job: Job): Promise<void> {
    try {
      for (const visit of job.data.visits) {
        const { store_id, image_url } = visit;

        // Validate store ID
        if (!(await storeService.isStoreValid(store_id))) {
          this.addJobError(job, store_id, 'Invalid store ID');
          continue;
        }

        // Process images
        await Promise.all(image_url.map(async (url: string) => {
          try {
            const imageBuffer = await imageService.downloadImage(url);
            const perimeter = imageService.calculatePerimeter(imageBuffer);
            await imageService.simulateGpuProcessing();
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            this.addJobError(job, store_id, errorMessage);
          }
        }));
      }

      job.status = job.errors.length > 0 ? 'failed' : 'completed';
    } catch (error) {
      job.status = 'failed';
      this.addJobError(job, 'system', 'Unexpected processing error');
    }
  }

  private addJobError(job: Job, store_id: string, message: string): void {
    if (!job.errors.some((e) => e.store_id === store_id)) {
      job.errors.push({ store_id, error: message });
    }
  }
}

export const jobService = new JobService();