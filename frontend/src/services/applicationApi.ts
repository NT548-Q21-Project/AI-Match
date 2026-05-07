import { Application, ApplicationStatus } from "../types/application";
import apiClient from "./apiClient";

export const applicationApi = {
  apply: async (data: { job_id: string; cv_id: string; }): Promise<Application> => {
    const response = await apiClient.post<Application>("/recruitment/applications", data);
    return response.data;
  },

  getMyApplications: async (): Promise<Application[]> => {
    const response = await apiClient.get<Application[]>("/recruitment/applications/me");
    return response.data;
  },

  getJobApplications: async (jobId: string): Promise<Application[]> => {
    const response = await apiClient.get<Application[]>(`/recruitment/applications/job/${jobId}`);
    return response.data;
  },

  updateStatus: async (applicationId: string, status: ApplicationStatus): Promise<Application> => {
    const response = await apiClient.patch<Application>(`/recruitment/applications/${applicationId}/status`, { status });
    return response.data;
  },
};
