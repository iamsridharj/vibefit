import { apiClient } from "./apiClient";
import { User, FitnessProfile } from "../../types/api";

export class UserService {
  async getProfile(): Promise<User> {
    const response = await apiClient.get<User>("/api/v1/users/me", {
      enableCache: true,
      cacheTTL: 300000, // 5 minutes
    });

    return response.data;
  }

  async updateProfile(data: Partial<User>): Promise<User> {
    const response = await apiClient.put<User>("/api/v1/users/me", data);

    // Clear cache to force refresh
    apiClient.clearCache();

    return response.data;
  }

  async getFitnessProfile(): Promise<FitnessProfile> {
    const response = await apiClient.get<FitnessProfile>(
      "/api/v1/users/me/fitness",
      {
        enableCache: true,
        cacheTTL: 300000, // 5 minutes
      }
    );

    return response.data;
  }

  async updateFitnessProfile(
    data: Partial<FitnessProfile>
  ): Promise<FitnessProfile> {
    const response = await apiClient.put<FitnessProfile>(
      "/api/v1/users/me/fitness",
      data
    );

    // Clear cache to force refresh
    apiClient.clearCache();

    return response.data;
  }

  async deleteAccount(): Promise<void> {
    await apiClient.delete("/api/v1/users/me");

    // Clear all local data
    apiClient.clearTokens();
    apiClient.clearCache();
  }

  async exportData(): Promise<{ downloadUrl: string }> {
    const response = await apiClient.post<{ downloadUrl: string }>(
      "/api/v1/users/me/export-data"
    );

    return response.data;
  }

  // Complete user onboarding
  async completeOnboarding(data: {
    primaryGoal: string;
    secondaryGoals?: string[];
    experienceLevel: string;
    availableEquipment: string[];
    workoutDays: string[];
    sessionDurationMinutes: number;
    injuriesLimitations?: string;
    activityLevel: string;
    dateOfBirth?: string;
    gender?: string;
    heightCm?: number;
    currentWeightKg?: number;
  }): Promise<{ user: User; fitnessProfile: FitnessProfile }> {
    const response = await apiClient.post<{
      user: User;
      fitnessProfile: FitnessProfile;
    }>("/api/v1/users/me/onboarding", data);

    // Clear cache to force refresh
    apiClient.clearCache();

    return response.data;
  }
}

export const userService = new UserService();
