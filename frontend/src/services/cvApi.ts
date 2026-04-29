import { CV } from "../types/cv";
import apiClient from "./apiClient";
import { MOCK_CVS } from "../mocks";

const USE_MOCK_API = true;

export const cvApi = {
  getCVs: async (): Promise<CV[]> => {
    if (USE_MOCK_API) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return MOCK_CVS;
    }
    const response = await apiClient.get<CV[]>("/cvs");
    return response.data;
  },

  uploadCV: async (formData: FormData): Promise<CV> => {
    if (USE_MOCK_API) {
      await new Promise(resolve => setTimeout(resolve, 1500));
      const file = formData.get("file") as File;
      const title = formData.get("title") as string;
      return {
        id: "new-cv-" + Date.now(),
        user_id: "u1",
        file_name: file.name,
        title: title || "New CV",
        created_at: new Date().toISOString(),
      };
    }
    const response = await apiClient.post<CV>("/cvs/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  deleteCV: async (cvId: string): Promise<void> => {
    if (USE_MOCK_API) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return;
    }
    await apiClient.delete(`/cvs/${cvId}`);
  },
};
