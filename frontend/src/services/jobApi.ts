import { Job } from "../types/job";
import apiClient from "./apiClient";
import { MOCK_JOBS } from "../mocks";

const USE_MOCK_API = true;

export const jobApi = {
  getJobs: async (filters?: any): Promise<Job[]> => {
    if (USE_MOCK_API) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return MOCK_JOBS;
    }
    const response = await apiClient.get<Job[]>("/jobs", { params: filters });
    return response.data;
  },

  getJob: async (jobId: string): Promise<Job> => {
    if (USE_MOCK_API) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return MOCK_JOBS.find(j => j.id === jobId) || MOCK_JOBS[0];
    }
    const response = await apiClient.get<Job>(`/jobs/${jobId}`);
    return response.data;
  },

  getMyJobs: async (): Promise<Job[]> => {
    if (USE_MOCK_API) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return MOCK_JOBS.filter(j => j.recruiter_id === "u2");
    }
    const response = await apiClient.get<Job[]>("/jobs/my");
    return response.data;
  },

  createJob: async (data: Partial<Job>): Promise<Job> => {
    if (USE_MOCK_API) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return {
        ...data,
        id: "new-j-" + Date.now(),
        recruiter_id: "u2",
        status: data.status || "active",
        applications_count: 0,
        created_at: new Date().toISOString(),
      } as Job;
    }
    const response = await apiClient.post<Job>("/jobs", data);
    return response.data;
  },

  updateJob: async (jobId: string, data: Partial<Job>): Promise<Job> => {
    if (USE_MOCK_API) {
      await new Promise(resolve => setTimeout(resolve, 800));
      const job = MOCK_JOBS.find(j => j.id === jobId) || MOCK_JOBS[0];
      return { ...job, ...data };
    }
    const response = await apiClient.patch<Job>(`/jobs/${jobId}`, data);
    return response.data;
  },
};
