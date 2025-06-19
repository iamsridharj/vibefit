import { apiClient } from "./apiClient";
import {
  WorkoutPlan,
  WorkoutPlanRequest as GeneratePlanRequest,
  WorkoutSession,
  CreateWorkoutSessionRequest as CreateSessionRequest,
  LogSetRequest,
  CompleteWorkoutRequest,
  PaginatedResponse,
  OnboardingPlanRequest,
  OnboardingPlanResponse,
  SavePlanRequest,
  SavePlanResponse,
} from "../../types/api";

export class WorkoutService {
  // Onboarding Workout Plan Methods
  async generateOnboardingPlan(
    request: OnboardingPlanRequest
  ): Promise<OnboardingPlanResponse> {
    const response = await apiClient.post<OnboardingPlanResponse>(
      "/workouts/plans/generate",
      request,
      {
        timeout: 30000, // AI generation can take longer
        retries: 1,
      }
    );

    return response.data;
  }

  async saveOnboardingPlan(
    request: SavePlanRequest
  ): Promise<SavePlanResponse> {
    const response = await apiClient.post<SavePlanResponse>(
      "/workouts/plans/save",
      request
    );

    // Clear cache to refresh plans list
    apiClient.clearCache();

    return response.data;
  }

  // Workout Plans
  async generateWorkoutPlan(request: GeneratePlanRequest): Promise<{
    plan: WorkoutPlan;
    message: string;
    meta: {
      timestamp: string;
      requestId: string;
      tokenUsage: {
        promptTokens: number;
        completionTokens: number;
        totalTokens: number;
      };
    };
  }> {
    const response = await apiClient.post<{
      plan: WorkoutPlan;
      message: string;
      meta: {
        timestamp: string;
        requestId: string;
        tokenUsage: {
          promptTokens: number;
          completionTokens: number;
          totalTokens: number;
        };
      };
    }>("/workouts/plans/generate", request);

    return response.data;
  }

  async saveGeneratedPlan(planId: string, name?: string): Promise<WorkoutPlan> {
    const response = await apiClient.post<WorkoutPlan>(
      "/api/v1/workouts/plans/save",
      { planId, name }
    );

    // Clear cache to refresh plans list
    apiClient.clearCache();

    return response.data;
  }

  async getUserWorkoutPlans(params: {
    status?: "draft" | "active" | "completed" | "archived";
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<WorkoutPlan>> {
    const queryParams = new URLSearchParams();

    if (params.status) queryParams.append("status", params.status);
    if (params.page) queryParams.append("page", params.page.toString());
    if (params.limit) queryParams.append("limit", params.limit.toString());

    const response = await apiClient.get<PaginatedResponse<WorkoutPlan>>(
      `/workouts/plans?${queryParams.toString()}`,
      {
        enableCache: true,
        cacheTTL: 300000, // 5 minutes
      }
    );

    return response.data;
  }

  async getActivePlan(): Promise<{
    activePlan: WorkoutPlan & {
      progress: {
        currentWeek: number;
        currentDay: number;
        completedSessions: number;
        totalSessions: number;
        adherenceRate: number;
      };
      nextSession: {
        weekNumber: number;
        dayNumber: number;
        focus: string;
        scheduledFor: string;
      };
    };
  }> {
    const response = await apiClient.get<{
      activePlan: WorkoutPlan & {
        progress: {
          currentWeek: number;
          currentDay: number;
          completedSessions: number;
          totalSessions: number;
          adherenceRate: number;
        };
        nextSession: {
          weekNumber: number;
          dayNumber: number;
          focus: string;
          scheduledFor: string;
        };
      };
    }>("/workouts/plans/active", {
      enableCache: true,
      cacheTTL: 300000, // 5 minutes
    });

    return response.data;
  }

  async getPlanDetails(planId: string): Promise<{
    plan: WorkoutPlan & {
      progress: {
        currentWeek: number;
        currentDay: number;
        completedSessions: number;
        totalSessions: number;
        adherenceRate: number;
      };
      metrics: {
        totalVolume: number;
        volumeByMuscleGroup: {
          chest: number;
          back: number;
          legs: number;
          shoulders: number;
          arms: number;
          core: number;
        };
        progressionRate: {
          strength: number;
          volume: number;
          intensity: number;
        };
      };
    };
  }> {
    const response = await apiClient.get<{
      plan: WorkoutPlan & {
        progress: {
          currentWeek: number;
          currentDay: number;
          completedSessions: number;
          totalSessions: number;
          adherenceRate: number;
        };
        metrics: {
          totalVolume: number;
          volumeByMuscleGroup: {
            chest: number;
            back: number;
            legs: number;
            shoulders: number;
            arms: number;
            core: number;
          };
          progressionRate: {
            strength: number;
            volume: number;
            intensity: number;
          };
        };
      };
    }>(`/workouts/plans/${planId}`, {
      enableCache: true,
      cacheTTL: 300000, // 5 minutes
    });

    return response.data;
  }

  async updatePlanStatus(
    planId: string,
    status: "active" | "completed" | "archived",
    reason?: string
  ): Promise<{
    plan: {
      id: string;
      status: string;
      updatedAt: string;
    };
  }> {
    const response = await apiClient.post<{
      plan: {
        id: string;
        status: string;
        updatedAt: string;
      };
    }>(`/workouts/plans/${planId}/status`, {
      status,
      reason,
    });

    apiClient.clearCache();
    return response.data;
  }

  async deletePlan(planId: string): Promise<void> {
    await apiClient.delete(`/workouts/plans/${planId}`);

    // Clear cache to refresh plans
    apiClient.clearCache();
  }

  // Workout Sessions
  async getTodaysWorkout(): Promise<WorkoutSession> {
    const response = await apiClient.get<{ session: WorkoutSession }>(
      "/workouts/today",
      {
        enableCache: true,
        cacheTTL: 300000, // 5 minutes
      }
    );

    return response.data.session;
  }

  async createWorkoutSession(data: {
    planId?: string;
    weekNumber?: number;
    dayNumber?: number;
    type: "plan" | "custom";
    customExercises?: Array<{
      exerciseId: string;
      sets: number;
      reps: string;
      rest: string;
      notes?: string;
    }>;
  }): Promise<{
    session: WorkoutSession;
  }> {
    const response = await apiClient.post<{
      session: WorkoutSession;
    }>("/workouts/sessions", data);

    return response.data;
  }

  async getActiveSession(): Promise<{
    session: WorkoutSession;
  }> {
    const response = await apiClient.get<{
      session: WorkoutSession;
    }>("/workouts/sessions/active", {
      enableCache: true,
      cacheTTL: 60000, // 1 minute
    });

    return response.data;
  }

  async getSessionDetails(sessionId: string): Promise<{
    session: WorkoutSession;
  }> {
    const response = await apiClient.get<{
      session: WorkoutSession;
    }>(`/workouts/sessions/${sessionId}`, {
      enableCache: true,
      cacheTTL: 300000, // 5 minutes
    });

    return response.data;
  }

  async cancelSession(sessionId: string): Promise<{
    session: {
      id: string;
      status: "cancelled";
      cancelledAt: string;
    };
  }> {
    const response = await apiClient.post<{
      session: {
        id: string;
        status: "cancelled";
        cancelledAt: string;
      };
    }>(`/workouts/sessions/${sessionId}/cancel`);

    apiClient.clearCache();
    return response.data;
  }

  async getWeeklyStats(startDate: string): Promise<{
    weeklyStats: {
      totalSessions: number;
      totalDuration: number;
      totalVolume: number;
      sessionsPerDay: {
        monday: number;
        tuesday: number;
        wednesday: number;
        thursday: number;
        friday: number;
        saturday: number;
        sunday: number;
      };
      volumeByMuscleGroup: {
        chest: number;
        back: number;
        legs: number;
        shoulders: number;
        arms: number;
        core: number;
      };
    };
    comparison: {
      sessionsChange: number;
      volumeChange: number;
      durationChange: number;
    };
  }> {
    const response = await apiClient.get<{
      weeklyStats: {
        totalSessions: number;
        totalDuration: number;
        totalVolume: number;
        sessionsPerDay: {
          monday: number;
          tuesday: number;
          wednesday: number;
          thursday: number;
          friday: number;
          saturday: number;
          sunday: number;
        };
        volumeByMuscleGroup: {
          chest: number;
          back: number;
          legs: number;
          shoulders: number;
          arms: number;
          core: number;
        };
      };
      comparison: {
        sessionsChange: number;
        volumeChange: number;
        durationChange: number;
      };
    }>(`/workouts/stats/weekly?startDate=${startDate}`, {
      enableCache: true,
      cacheTTL: 300000, // 5 minutes
    });

    return response.data;
  }

  async getWorkoutHistory(params: {
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
  }): Promise<{
    sessions: Array<{
      id: string;
      startTime: string;
      endTime: string;
      duration: number;
      status: "completed";
      rating: number;
      metrics: {
        totalVolume: number;
        caloriesBurned: number;
        averageHeartRate: number;
      };
      exercises: Array<{
        name: string;
        sets: Array<{
          weight: number;
          reps: number;
          rpe: number;
        }>;
      }>;
    }>;
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
    summary: {
      totalSessions: number;
      averageDuration: number;
      totalVolume: number;
      favoriteExercises: Array<{
        name: string;
        count: number;
      }>;
    };
  }> {
    const queryParams = new URLSearchParams();

    if (params.startDate) queryParams.append("startDate", params.startDate);
    if (params.endDate) queryParams.append("endDate", params.endDate);
    if (params.page) queryParams.append("page", params.page.toString());
    if (params.limit) queryParams.append("limit", params.limit.toString());

    const response = await apiClient.get<{
      sessions: Array<{
        id: string;
        startTime: string;
        endTime: string;
        duration: number;
        status: "completed";
        rating: number;
        metrics: {
          totalVolume: number;
          caloriesBurned: number;
          averageHeartRate: number;
        };
        exercises: Array<{
          name: string;
          sets: Array<{
            weight: number;
            reps: number;
            rpe: number;
          }>;
        }>;
      }>;
      pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
      };
      summary: {
        totalSessions: number;
        averageDuration: number;
        totalVolume: number;
        favoriteExercises: Array<{
          name: string;
          count: number;
        }>;
      };
    }>(`/workouts/history?${queryParams.toString()}`, {
      enableCache: true,
      cacheTTL: 300000, // 5 minutes
    });

    return response.data;
  }

  async getExerciseHistory(
    exerciseId: string,
    params: {
      startDate?: string;
      endDate?: string;
      page?: number;
      limit?: number;
    }
  ): Promise<{
    exercise: {
      id: string;
      name: string;
      category: string;
      muscleGroups: string[];
    };
    sets: Array<{
      date: string;
      sessionId: string;
      weight: number;
      reps: number;
      rpe: number;
    }>;
    progress: {
      maxWeight: number;
      maxReps: number;
      volumeTrend: Array<{
        date: string;
        volume: number;
      }>;
      strengthScore: number;
    };
  }> {
    const queryParams = new URLSearchParams();

    if (params.startDate) queryParams.append("startDate", params.startDate);
    if (params.endDate) queryParams.append("endDate", params.endDate);
    if (params.page) queryParams.append("page", params.page.toString());
    if (params.limit) queryParams.append("limit", params.limit.toString());

    const response = await apiClient.get<{
      exercise: {
        id: string;
        name: string;
        category: string;
        muscleGroups: string[];
      };
      sets: Array<{
        date: string;
        sessionId: string;
        weight: number;
        reps: number;
        rpe: number;
      }>;
      progress: {
        maxWeight: number;
        maxReps: number;
        volumeTrend: Array<{
          date: string;
          volume: number;
        }>;
        strengthScore: number;
      };
    }>(`/workouts/exercises/${exerciseId}/history?${queryParams.toString()}`, {
      enableCache: true,
      cacheTTL: 300000, // 5 minutes
    });

    return response.data;
  }

  async getExerciseRecommendations(params: {
    muscleGroup?: string;
    equipment?: string;
    difficulty?: string;
    limit?: number;
  }): Promise<{
    recommendations: Array<{
      id: string;
      name: string;
      category: string;
      muscleGroups: string[];
      difficulty: string;
      equipment: string[];
      matchScore: number;
      reason: string;
    }>;
  }> {
    const queryParams = new URLSearchParams();

    if (params.muscleGroup)
      queryParams.append("muscleGroup", params.muscleGroup);
    if (params.equipment) queryParams.append("equipment", params.equipment);
    if (params.difficulty) queryParams.append("difficulty", params.difficulty);
    if (params.limit) queryParams.append("limit", params.limit.toString());

    const response = await apiClient.get<{
      recommendations: Array<{
        id: string;
        name: string;
        category: string;
        muscleGroups: string[];
        difficulty: string;
        equipment: string[];
        matchScore: number;
        reason: string;
      }>;
    }>(`/workouts/exercises/recommendations?${queryParams.toString()}`, {
      enableCache: true,
      cacheTTL: 300000, // 5 minutes
    });

    return response.data;
  }
}

export const workoutService = new WorkoutService();
