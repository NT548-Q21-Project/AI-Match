import { MatchResult } from "../types/matching";
import apiClient from "./apiClient";
import { MOCK_MATCH_RESULTS } from "../mocks";

const USE_MOCK_API = true;

export const matchingApi = {
  matchCVWithJob: async (cvId: string, jobId: string): Promise<MatchResult> => {
    if (USE_MOCK_API) {
      await new Promise(resolve => setTimeout(resolve, 1500));
      return {
        ...MOCK_MATCH_RESULTS[0],
        cv_id: cvId,
        job_id: jobId,
        score: Math.floor(Math.random() * 60) + 40,
      };
    }
    const response = await apiClient.post<MatchResult>("/matching/cv-job", { cv_id: cvId, job_id: jobId });
    return response.data;
  },
};
