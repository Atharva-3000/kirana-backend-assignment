export interface Visit {
  store_id: string;
  image_url: string[];
  visit_time: string;
}

export interface ImageResult {
  store_id: string;
  image_id: string;  // Added to match usage in jobService.ts
  result: number;    // Added to match usage in jobService.ts
}

export interface Job {
  status: 'ongoing' | 'completed' | 'failed';
  errors: JobError[];
  data: {
    visits: Visit[];
  };
  results?: ImageResult[];
}

export interface JobError {
  store_id: string;
  error: string;
}

export type JobId = string;

export interface JobResponse {
  status: string;
  job_id: JobId;
  error?: JobError[];
}