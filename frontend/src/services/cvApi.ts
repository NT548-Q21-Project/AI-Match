import { CV } from "../types/cv";
import apiClient from "./apiClient";

export const cvApi = {
  getCVs: async (): Promise<CV[]> => {
    const response = await apiClient.get<CV[]>("/recruitment/cvs");
    return response.data;
  },

  uploadCV: async (formData: FormData): Promise<CV> => {
    const response = await apiClient.post<CV>("/recruitment/cvs/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  deleteCV: async (cvId: string): Promise<void> => {
    await apiClient.delete(`/recruitment/cvs/${cvId}`);
  },
};
