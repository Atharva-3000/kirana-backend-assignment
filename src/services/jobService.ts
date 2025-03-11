import { v4 as uuidv4 } from 'uuid';
import type { Job, JobId, Visit, JobError } from '../models/job.js';
import { storeService } from './storeService.js';
import { imageService } from './imageService.js';
import { addToQueue } from '../queue/jobQueue.js';

class JobService {
  private jobs: Map<JobId, Job> = new Map();

  createJob(visits: Visit[]): JobId {
    const jobId = uuidv4();
    const job: Job = {
      status: 'ongoing',
      errors: [],
      data: { visits },
      results: [] // Add a results array to store completed image results
    };

    this.jobs.set(jobId, job);

    // Use queue for processing
    addToQueue(jobId, visits).catch(error => {
      this.updateJobError(jobId, 'system', 'Failed to queue job: ' + error.message);
    });

    return jobId;
  }

  getJob(jobId: JobId): Job | undefined {
    return this.jobs.get(jobId);
  }

  updateJobError(jobId: JobId, storeId: string, message: string): void {
    const job = this.jobs.get(jobId);
    if (job) {
      this.addJobError(job, storeId, message);
      this.checkJobCompletion(jobId);
    }
  }

  addImageResult(jobId: JobId, storeId: string, imageUrl: string, perimeter: number): void {
    const job = this.jobs.get(jobId);
    if (job && job.results) {
      job.results.push({
        store_id: storeId,
        image_id: imageUrl, // Changed to match the interface
        result: perimeter // Changed to match the interface
      });
      this.checkJobCompletion(jobId);
    }
  }

  private checkJobCompletion(jobId: JobId): void {
    const job = this.jobs.get(jobId);
    if (!job) return;

    // Calculate total expected images
    let totalExpectedImages = 0;
    for (const visit of job.data.visits) {
      totalExpectedImages += visit.image_url.length;
    }

    // If we have errors or all images are processed, mark job as complete
    if (job.errors.length > 0) {
      job.status = 'failed';
    } else if (job.results && job.results.length >= totalExpectedImages) {
      job.status = 'completed';
    }
  }

  private addJobError(job: Job, store_id: string, message: string): void {
    if (!job.errors.some((e) => e.store_id === store_id)) {
      job.errors.push({ store_id, error: message });
    }
  }
}

export const jobService = new JobService();