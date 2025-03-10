export interface Visit {
    store_id: string;
    image_url: string[];
    visit_time: string;
  }
  
  export interface Job {
    status: 'ongoing' | 'completed' | 'failed';
    errors: JobError[];
    data: {
      visits: Visit[];
    };
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