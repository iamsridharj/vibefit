import { apiClient } from "./apiClient";
import { User } from "../../types/api";

export class UserService {
  async getProfile(): Promise<User> {
    const response = await apiClient.get<{ user: User }>("/users/profile", {
      enableCache: true,
      cacheTTL: 300000, // 5 minutes
    });

    return response.data.user;
  }

  async updateProfile(data: {
    firstName?: string;
    lastName?: string;
    dateOfBirth?: string;
    gender?: "male" | "female" | "other" | "prefer_not_to_say";
    fitnessGoals?: string[];
    experienceLevel?: "beginner" | "intermediate" | "advanced";
    preferences?: {
      unitSystem?: "metric" | "imperial";
      notifications?: {
        workoutReminders?: boolean;
        progressUpdates?: boolean;
        socialActivity?: boolean;
      };
      privacySettings?: {
        profileVisibility?: "public" | "friends" | "private";
        activitySharing?: "public" | "friends" | "private";
        progressSharing?: "public" | "friends" | "private";
      };
    };
  }): Promise<User> {
    const response = await apiClient.put<{ user: User }>(
      "/users/profile",
      data
    );

    apiClient.clearCache();
    return response.data.user;
  }

  async updateProfilePicture(picture: File): Promise<{ pictureUrl: string }> {
    const formData = new FormData();
    formData.append("picture", picture);

    const response = await apiClient.post<{ pictureUrl: string }>(
      "/users/profile/picture",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    apiClient.clearCache();
    return response.data;
  }

  async getStats(): Promise<{
    workouts: {
      total: number;
      thisMonth: number;
      thisWeek: number;
      averageDuration: number;
      streak: number;
    };
    progress: {
      weightChange: {
        lastMonth: number;
        lastThreeMonths: number;
      };
      workoutIntensity: {
        average: number;
        trend: "up" | "down" | "stable";
      };
    };
    achievements: {
      total: number;
      recentlyUnlocked: Array<{
        id: string;
        name: string;
        description: string;
        unlockedAt: string;
      }>;
    };
  }> {
    const response = await apiClient.get<{
      workouts: {
        total: number;
        thisMonth: number;
        thisWeek: number;
        averageDuration: number;
        streak: number;
      };
      progress: {
        weightChange: {
          lastMonth: number;
          lastThreeMonths: number;
        };
        workoutIntensity: {
          average: number;
          trend: "up" | "down" | "stable";
        };
      };
      achievements: {
        total: number;
        recentlyUnlocked: Array<{
          id: string;
          name: string;
          description: string;
          unlockedAt: string;
        }>;
      };
    }>("/users/stats", {
      enableCache: true,
      cacheTTL: 300000, // 5 minutes
    });

    return response.data;
  }
}

export const userService = new UserService();
