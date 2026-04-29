export type JobStatus = "draft" | "active" | "closed" | "expired";

export interface Job {
  id: string;
  recruiter_id: string;
  title: string;
  description: string;
  requirements?: string;
  nice_to_have?: string;
  responsibilities?: string;
  benefits?: string;
  location?: string;
  status: JobStatus;
  applications_count?: number;
  created_at: string;
  expired_at?: string;
}
