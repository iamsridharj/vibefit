import { apiClient } from "./apiClient";
import {
  LoginRequest,
  RegisterRequest,
  AppleSignInRequest,
  AuthResponse,
  User,
} from "../../types/api";

export class AuthService {
  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(
      "/api/v1/auth/register",
      data,
      {
        retries: 2,
      }
    );

    console.log("response", response);

    if (response.success) {
      // Store tokens
      apiClient.setTokens(
        response.data.tokens.accessToken,
        response.data.tokens.refreshToken
      );
    }

    return response.data;
  }

  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(
      "/api/v1/auth/login",
      data,
      {
        retries: 2,
      }
    );

    if (response.success) {
      // Store tokens
      apiClient.setTokens(
        response.data.tokens.accessToken,
        response.data.tokens.refreshToken
      );
    }

    return response.data;
  }

  async appleSignIn(data: AppleSignInRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(
      "/api/v1/auth/apple",
      data,
      {
        retries: 2,
      }
    );

    if (response.success) {
      // Store tokens
      apiClient.setTokens(
        response.data.tokens.accessToken,
        response.data.tokens.refreshToken
      );
    }

    return response.data;
  }

  async getCurrentUser(): Promise<User> {
    const response = await apiClient.get<User>("/api/v1/auth/me", {
      enableCache: true,
      cacheTTL: 300000, // 5 minutes
    });

    return response.data;
  }

  async changePassword(
    currentPassword: string,
    newPassword: string
  ): Promise<void> {
    await apiClient.post("/api/v1/auth/password/change", {
      currentPassword,
      newPassword,
    });
  }

  async requestPasswordReset(email: string): Promise<void> {
    await apiClient.post("/api/v1/auth/password/request-reset", {
      email,
    });
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    await apiClient.post("/api/v1/auth/password/reset", {
      token,
      newPassword,
    });
  }

  async refreshToken(): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(
      "/api/v1/auth/refresh",
      {}
    );

    if (response.success) {
      apiClient.setTokens(
        response.data.tokens.accessToken,
        response.data.tokens.refreshToken
      );
    }

    return response.data;
  }

  async logout(): Promise<void> {
    try {
      await apiClient.post("/api/v1/auth/logout");
    } finally {
      // Always clear tokens, even if logout call fails
      apiClient.clearTokens();
    }
  }
}

export const authService = new AuthService();
