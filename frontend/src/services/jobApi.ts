import { Job } from "../types/job";
import apiClient from "./apiClient";

export interface JobFilters {
  status?: string;
  location?: string;
  job_type?: string;
}

export const jobApi = {
  getJobs: async (filters?: JobFilters): Promise<Job[]> => {
    const response = await apiClient.get<Job[]>("/recruitment/jobs", { params: filters });
    return response.data;
  },

  getJob: async (jobId: string): Promise<Job> => {
    const response = await apiClient.get<Job>(`/recruitment/jobs/${jobId}`);
    return response.data;
  },

  getMyJobs: async (): Promise<Job[]> => {
    const response = await apiClient.get<Job[]>("/recruitment/jobs/my");
    return response.data;
  },

  createJob: async (data: Partial<Job>): Promise<Job> => {
    const response = await apiClient.post<Job>("/recruitment/jobs", data);
    return response.data;
  },

  updateJob: async (jobId: string, data: Partial<Job>): Promise<Job> => {
    const response = await apiClient.patch<Job>(`/recruitment/jobs/${jobId}`, data);
    return response.data;
  },
};
