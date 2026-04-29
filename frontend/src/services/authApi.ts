import { AuthResponse, LoginRequest, RegisterRequest } from "../types/auth";
import apiClient from "./apiClient";
import { MOCK_USER_CANDIDATE, MOCK_USER_RECRUITER } from "../mocks";

const USE_MOCK_API = true;

export const authApi = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    if (USE_MOCK_API) {
      await new Promise(resolve => setTimeout(resolve, 800));
      let user: any = MOCK_USER_CANDIDATE;
      if (data.email === "recruiter@example.com") {
        user = MOCK_USER_RECRUITER;
      }
      return {
        user,
        access_token: "mock-token-" + Date.now(),
        token_type: "bearer",
      };
    }
    const response = await apiClient.post<AuthResponse>("/auth/login", data);
    return response.data;
  },

  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    if (USE_MOCK_API) {
      await new Promise(resolve => setTimeout(resolve, 800));
      return {
        user: {
          id: "new-u-" + Date.now(),
          auth_id: "auth-" + Date.now(),
          email: data.email,
          role: data.role,
          created_at: new Date().toISOString(),
        },
        access_token: "mock-token-" + Date.now(),
        token_type: "bearer",
      };
    }
    const response = await apiClient.post<AuthResponse>("/auth/register", data);
    return response.data;
  },
};
