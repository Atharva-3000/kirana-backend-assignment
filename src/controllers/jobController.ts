import type { Request, Response } from 'express';
import { jobService } from '../services/jobService.js';
import type { Visit } from '../models/job.js';

export const submitJob = (req: Request, res: Response) => {
  const { count, visits } = req.body;

  // Validate request
  if (count === undefined || !Array.isArray(visits) || count !== visits.length) {
    return res.status(400).json({ error: 'Invalid count or visits structure' });
  }

  for (const visit of visits) {
    if (!visit.store_id || !visit.image_url || !visit.visit_time) {
      return res.status(400).json({ error: 'Missing required fields in visit' });
    }
  }

  // Create new job
  const jobId = jobService.createJob(visits);
  return res.status(201).json({ job_id: jobId });
};

export const getJobStatus = (req: Request, res: Response) => {
  const jobId = req.query.jobid as string;
  
  if (!jobId) {
    return res.status(400).json({});
  }

  const job = jobService.getJob(jobId);
  
  if (!job) {
    return res.status(400).json({});
  }

  const response: {
    status: string;
    job_id: string;
    error?: any;
  } = {
    status: job.status,
    job_id: jobId
  };

  if (job.status === 'failed') {
    response.error = job.errors;
  }

  return res.json(response);
};