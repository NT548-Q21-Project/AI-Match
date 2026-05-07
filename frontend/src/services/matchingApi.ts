import { MatchResult } from "../types/matching";
import apiClient from "./apiClient";

export interface MatchAnalyzeRequest {
  cv_id: string;
  job_id: string;
  cv_text: string;
  job_title: string;
  job_description: string;
  responsibilities?: string | null;
  requirements?: string | null;
  nice_to_have?: string | null;
  benefits?: string | null;
}

export const matchingApi = {
  matchCVWithJob: async (
    cvIdOrPayload: string | MatchAnalyzeRequest,
    jobId?: string,
  ): Promise<MatchResult> => {
    const payload: MatchAnalyzeRequest =
      typeof cvIdOrPayload === "string"
        ? {
            cv_id: cvIdOrPayload,
            job_id: jobId ?? cvIdOrPayload,
            cv_text: `CV text placeholder for ${cvIdOrPayload}`,
            job_title: "Job title pending",
            job_description: "Job description pending",
          }
        : cvIdOrPayload;

    const response = await apiClient.post<{
      id: string;
      candidate_id: string;
      cv_id: string;
      job_id: string;
      fit_level: MatchResult["fit_level"];
      score: number;
      strengths?: string[] | null;
      weaknesses?: string[] | null;
      suggestions?: string | null;
      created_at: string;
    }>("/ai/match", payload);

    const result = response.data;

    return {
      ...result,
      score: result.score,
      explanation: result.suggestions ?? "AI analysis completed.",
    };
  },

  getMyMatchResults: async (): Promise<MatchResult[]> => {
    const response = await apiClient.get<Array<{
      id: string;
      candidate_id: string;
      cv_id: string;
      job_id: string;
      fit_level: MatchResult["fit_level"];
      score: number;
      strengths?: string[] | null;
      weaknesses?: string[] | null;
      suggestions?: string | null;
      created_at: string;
    }>>("/ai/match-results");

    return response.data.map((result) => ({
      ...result,
      score: result.score,
      explanation: result.suggestions ?? "AI analysis completed.",
    }));
  },
};
