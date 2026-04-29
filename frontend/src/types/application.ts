import { CV } from "./cv";
import { Job } from "./job";
import { MatchResult } from "./matching";

export type ApplicationStatus = "pending" | "viewed" | "interviewing" | "rejected" | "accepted" | "withdrawn";

export interface Application {
  id: string;
  candidate_id: string;
  candidate_name?: string;
  job_id: string;
  cv_id: string;
  cv_title?: string;
  cover_letter?: string;
  applied_at: string;
  status: ApplicationStatus;
  job?: Job;
  cv?: CV;
  match_result?: MatchResult;
}
