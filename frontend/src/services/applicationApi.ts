import { Application, ApplicationStatus } from "../types/application";
import apiClient from "./apiClient";
import { MOCK_APPLICATIONS } from "../mocks";

const USE_MOCK_API = true;

export const applicationApi = {
  apply: async (data: { job_id: string; cv_id: string; cover_letter?: string }): Promise<Application> => {
    if (USE_MOCK_API) {
      await new Promise(resolve => setTimeout(resolve, 1200));
      return {
        id: "app-" + Date.now(),
        candidate_id: "u1",
        job_id: data.job_id,
        cv_id: data.cv_id,
        cover_letter: data.cover_letter,
        applied_at: new Date().toISOString(),
        status: "pending",
      };
    }
    const response = await apiClient.post<Application>("/applications", data);
    return response.data;
  },

  getMyApplications: async (): Promise<Application[]> => {
    if (USE_MOCK_API) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return MOCK_APPLICATIONS.filter(a => a.candidate_id === "u1");
    }
    const response = await apiClient.get<Application[]>("/applications/me");
    return response.data;
  },

  getJobApplications: async (jobId: string): Promise<Application[]> => {
    if (USE_MOCK_API) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return MOCK_APPLICATIONS.filter(a => a.job_id === jobId);
    }
    const response = await apiClient.get<Application[]>(`/applications/job/${jobId}`);
    return response.data;
  },

  updateStatus: async (applicationId: string, status: ApplicationStatus): Promise<Application> => {
    if (USE_MOCK_API) {
      await new Promise(resolve => setTimeout(resolve, 800));
      const app = MOCK_APPLICATIONS.find(a => a.id === applicationId) || MOCK_APPLICATIONS[0];
      return { ...app, status };
    }
    const response = await apiClient.patch<Application>(`/applications/${applicationId}/status`, { status });
    return response.data;
  },
};
