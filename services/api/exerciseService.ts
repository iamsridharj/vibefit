import { apiClient } from "./apiClient";
import {
  Exercise,
  ExerciseSearchParams,
  PaginatedResponse,
} from "../../types/api";

export class ExerciseService {
  async getExercises(
    params?: ExerciseSearchParams
  ): Promise<PaginatedResponse<Exercise>> {
    const queryParams = new URLSearchParams();

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const url = `/api/v1/exercises${
      queryParams.toString() ? `?${queryParams.toString()}` : ""
    }`;

    const response = await apiClient.get<PaginatedResponse<Exercise>>(url, {
      enableCache: true,
      cacheTTL: 1800000, // 30 minutes - exercises don't change often
    });

    return response.data;
  }

  async searchExercises(
    query: string,
    limit: number = 10
  ): Promise<Exercise[]> {
    const response = await apiClient.get<{ exercises: Exercise[] }>(
      `/api/v1/exercises/search?q=${encodeURIComponent(query)}&limit=${limit}`,
      {
        enableCache: true,
        cacheTTL: 900000, // 15 minutes
      }
    );

    return response.data.exercises;
  }

  async getExercise(exerciseId: string): Promise<Exercise> {
    const response = await apiClient.get<Exercise>(
      `/api/v1/exercises/${exerciseId}`,
      {
        enableCache: true,
        cacheTTL: 3600000, // 1 hour - individual exercises rarely change
      }
    );

    return response.data;
  }

  async getRecommendedExercises(): Promise<Exercise[]> {
    const response = await apiClient.get<{ exercises: Exercise[] }>(
      "/api/v1/exercises/recommended/for-me",
      {
        enableCache: true,
        cacheTTL: 600000, // 10 minutes
      }
    );

    return response.data.exercises;
  }

  async getExercisesByMuscleGroup(muscleGroup: string): Promise<Exercise[]> {
    const response = await this.getExercises({
      muscle: muscleGroup,
      limit: 50,
    });

    return response.items;
  }

  async getExercisesByEquipment(equipment: string): Promise<Exercise[]> {
    const response = await this.getExercises({
      equipment,
      limit: 50,
    });

    return response.items;
  }

  async getExercisesByCategory(category: string): Promise<Exercise[]> {
    const response = await this.getExercises({
      category,
      limit: 50,
    });

    return response.items;
  }

  // Get all available muscle groups
  async getMuscleGroups(): Promise<string[]> {
    const response = await apiClient.get<{ muscleGroups: string[] }>(
      "/api/v1/exercises/muscle-groups",
      {
        enableCache: true,
        cacheTTL: 86400000, // 24 hours - rarely changes
      }
    );

    return response.data.muscleGroups;
  }

  // Get all available equipment types
  async getEquipmentTypes(): Promise<string[]> {
    const response = await apiClient.get<{ equipmentTypes: string[] }>(
      "/api/v1/exercises/equipment-types",
      {
        enableCache: true,
        cacheTTL: 86400000, // 24 hours - rarely changes
      }
    );

    return response.data.equipmentTypes;
  }

  // Get all available categories
  async getCategories(): Promise<string[]> {
    const response = await apiClient.get<{ categories: string[] }>(
      "/api/v1/exercises/categories",
      {
        enableCache: true,
        cacheTTL: 86400000, // 24 hours - rarely changes
      }
    );

    return response.data.categories;
  }

  // Get exercises suitable for user's equipment and preferences
  async getPersonalizedExercises(params?: {
    muscleGroup?: string;
    difficulty?: number;
    excludeExercises?: string[];
  }): Promise<Exercise[]> {
    const queryParams = new URLSearchParams();

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          if (Array.isArray(value)) {
            value.forEach((item) => queryParams.append(key, item.toString()));
          } else {
            queryParams.append(key, value.toString());
          }
        }
      });
    }

    const url = `/api/v1/exercises/personalized${
      queryParams.toString() ? `?${queryParams.toString()}` : ""
    }`;

    const response = await apiClient.get<{ exercises: Exercise[] }>(url, {
      enableCache: true,
      cacheTTL: 600000, // 10 minutes
    });

    return response.data.exercises;
  }
}

export const exerciseService = new ExerciseService();
