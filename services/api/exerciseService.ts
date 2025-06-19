import { apiClient } from "./apiClient";
import {
  Exercise,
  ExerciseSearchParams,
  PaginatedResponse,
} from "../../types/api";

export class ExerciseService {
  async getAllExercises(params: {
    page?: number;
    limit?: number;
    category?: string;
    muscleGroups?: string[];
    equipment?: string[];
    difficultyLevel?: number;
    movementPattern?: string;
  }): Promise<PaginatedResponse<Exercise>> {
    const queryParams = new URLSearchParams();

    if (params.page) queryParams.append("page", params.page.toString());
    if (params.limit) queryParams.append("limit", params.limit.toString());
    if (params.category) queryParams.append("category", params.category);
    if (params.muscleGroups) {
      queryParams.append("muscleGroups", params.muscleGroups.join(","));
    }
    if (params.equipment) {
      queryParams.append("equipment", params.equipment.join(","));
    }
    if (params.difficultyLevel) {
      queryParams.append("difficultyLevel", params.difficultyLevel.toString());
    }
    if (params.movementPattern) {
      queryParams.append("movementPattern", params.movementPattern);
    }

    const response = await apiClient.get<PaginatedResponse<Exercise>>(
      `/exercises?${queryParams.toString()}`,
      {
        enableCache: true,
        cacheTTL: 300000, // 5 minutes
      }
    );

    return response.data;
  }

  async searchExercises(
    query: string,
    limit: number = 10
  ): Promise<Exercise[]> {
    const response = await apiClient.get<{ exercises: Exercise[] }>(
      `/exercises/search?q=${encodeURIComponent(query)}&limit=${limit}`,
      {
        enableCache: true,
        cacheTTL: 300000, // 5 minutes
      }
    );

    return response.data.exercises;
  }

  async getPopularExercises(limit: number = 10): Promise<Exercise[]> {
    const response = await apiClient.get<{ exercises: Exercise[] }>(
      `/exercises/popular?limit=${limit}`,
      {
        enableCache: true,
        cacheTTL: 300000, // 5 minutes
      }
    );

    return response.data.exercises;
  }

  async getFilterOptions(): Promise<{
    categories: string[];
    muscleGroups: string[];
    equipment: string[];
    difficultyLevels: number[];
    movementPatterns: string[];
    programmingTags: string[];
  }> {
    const response = await apiClient.get<{
      categories: string[];
      muscleGroups: string[];
      equipment: string[];
      difficultyLevels: number[];
      movementPatterns: string[];
      programmingTags: string[];
    }>("/exercises/filters", {
      enableCache: true,
      cacheTTL: 86400000, // 24 hours - rarely changes
    });

    return response.data;
  }

  async getExerciseStats(): Promise<{
    totalExercises: number;
    byCategory: Record<string, number>;
    byMuscleGroup: Record<string, number>;
    byDifficulty: Record<string, number>;
  }> {
    const response = await apiClient.get<{
      totalExercises: number;
      byCategory: Record<string, number>;
      byMuscleGroup: Record<string, number>;
      byDifficulty: Record<string, number>;
    }>("/exercises/stats", {
      enableCache: true,
      cacheTTL: 3600000, // 1 hour
    });

    return response.data;
  }

  async getExercisesByMuscleGroup(
    muscleGroup: string,
    limit: number = 20
  ): Promise<Exercise[]> {
    const response = await apiClient.get<{ exercises: Exercise[] }>(
      `/exercises/muscle-groups/${encodeURIComponent(
        muscleGroup
      )}?limit=${limit}`,
      {
        enableCache: true,
        cacheTTL: 300000, // 5 minutes
      }
    );

    return response.data.exercises;
  }

  async getExercisesByCategory(
    category: string,
    limit: number = 20
  ): Promise<Exercise[]> {
    const response = await apiClient.get<{ exercises: Exercise[] }>(
      `/exercises/categories/${encodeURIComponent(category)}?limit=${limit}`,
      {
        enableCache: true,
        cacheTTL: 300000, // 5 minutes
      }
    );

    return response.data.exercises;
  }

  async getRecommendedExercises(): Promise<Exercise[]> {
    const response = await apiClient.get<{ exercises: Exercise[] }>(
      "/exercises/recommended/for-me",
      {
        enableCache: true,
        cacheTTL: 300000, // 5 minutes
      }
    );

    return response.data.exercises;
  }

  async getExerciseById(exerciseId: string): Promise<{
    exercise: Exercise;
    variations: Array<{
      id: string;
      name: string;
      difficultyLevel: number;
      equipment: string[];
    }>;
  }> {
    const response = await apiClient.get<{
      exercise: Exercise;
      variations: Array<{
        id: string;
        name: string;
        difficultyLevel: number;
        equipment: string[];
      }>;
    }>(`/exercises/${exerciseId}`, {
      enableCache: true,
      cacheTTL: 300000, // 5 minutes
    });

    return response.data;
  }

  async getExerciseVariations(exerciseId: string): Promise<Exercise[]> {
    const response = await apiClient.get<{ exercises: Exercise[] }>(
      `/exercises/${exerciseId}/variations`,
      {
        enableCache: true,
        cacheTTL: 300000, // 5 minutes
      }
    );

    return response.data.exercises;
  }
}

export const exerciseService = new ExerciseService();
