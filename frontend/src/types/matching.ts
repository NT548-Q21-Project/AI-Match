import { CV } from "./cv";
import { Job } from "./job";

export interface MatchResult {
  id: string;
  cv_id: string;
  job_id: string;
  candidate_id: string;
  score: number;
  strengths: string[];
  weaknesses: string[];
  explanation: string;
  job?: Job;
  cv?: CV;
}
