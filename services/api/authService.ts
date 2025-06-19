import { apiClient } from "./apiClient";
import {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  AppleSignInRequest,
  User,
} from "../../types/api";

export class AuthService {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(
      "/auth/login",
      credentials
    );
    apiClient.setAccessToken(response.data.token);
    return response.data;
  }

  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>("/auth/register", data);
    apiClient.setAccessToken(response.data.token);
    return response.data;
  }

  async appleSignIn(data: AppleSignInRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>("/auth/apple", data);
    apiClient.setAccessToken(response.data.token);
    return response.data;
  }

  async forgotPassword(email: string): Promise<void> {
    await apiClient.post("/auth/forgot-password", { email });
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    await apiClient.post("/auth/reset-password", {
      token,
      newPassword,
    });
  }

  async changePassword(
    currentPassword: string,
    newPassword: string
  ): Promise<void> {
    await apiClient.post("/auth/change-password", {
      currentPassword,
      newPassword,
    });
  }

  async getCurrentUser(): Promise<User> {
    const response = await apiClient.get<{ user: User }>("/auth/me");
    return response.data.user;
  }

  async logout(): Promise<void> {
    await apiClient.post("/auth/logout");
    apiClient.clearAccessToken();
    apiClient.clearCache();
  }
}

export const authService = new AuthService();
