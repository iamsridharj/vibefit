import { apiClient } from "./apiClient";
import {
  WorkoutPlan,
  WorkoutSession,
  GeneratePlanRequest,
  CreateSessionRequest,
  LogSetRequest,
  CompleteWorkoutRequest,
  PaginatedResponse,
} from "../../types/api";

export class WorkoutService {
  // Workout Plans
  async generateWorkoutPlan(
    request: GeneratePlanRequest
  ): Promise<WorkoutPlan> {
    const response = await apiClient.post<{ plan: WorkoutPlan }>(
      "/api/v1/workouts/plans/generate",
      request,
      {
        timeout: 30000, // AI generation can take longer
        retries: 1,
      }
    );

    return response.data.plan;
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

  async getWorkoutPlans(params?: {
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<WorkoutPlan>> {
    const queryParams = new URLSearchParams();

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const url = `/api/v1/workouts/plans${
      queryParams.toString() ? `?${queryParams.toString()}` : ""
    }`;

    const response = await apiClient.get<PaginatedResponse<WorkoutPlan>>(url, {
      enableCache: true,
      cacheTTL: 300000, // 5 minutes
    });

    return response.data;
  }

  async getActivePlan(): Promise<WorkoutPlan | null> {
    try {
      const response = await apiClient.get<WorkoutPlan>(
        "/api/v1/workouts/plans/active",
        {
          enableCache: true,
          cacheTTL: 300000, // 5 minutes
        }
      );

      return response.data;
    } catch (error) {
      // Return null if no active plan found
      return null;
    }
  }

  async getWorkoutPlan(planId: string): Promise<WorkoutPlan> {
    const response = await apiClient.get<WorkoutPlan>(
      `/api/v1/workouts/plans/${planId}`,
      {
        enableCache: true,
        cacheTTL: 600000, // 10 minutes
      }
    );

    return response.data;
  }

  async updatePlanStatus(
    planId: string,
    status: WorkoutPlan["status"]
  ): Promise<WorkoutPlan> {
    const response = await apiClient.patch<WorkoutPlan>(
      `/api/v1/workouts/plans/${planId}/status`,
      { status }
    );

    // Clear cache to refresh plans
    apiClient.clearCache();

    return response.data;
  }

  async deletePlan(planId: string): Promise<void> {
    await apiClient.delete(`/api/v1/workouts/plans/${planId}`);

    // Clear cache to refresh plans
    apiClient.clearCache();
  }

  // Workout Sessions
  async getTodaysWorkout(): Promise<WorkoutSession | null> {
    try {
      const response = await apiClient.get<WorkoutSession>(
        "/api/v1/workouts/today",
        {
          enableCache: true,
          cacheTTL: 300000, // 5 minutes
        }
      );

      return response.data;
    } catch (error) {
      // Return null if no workout today
      return null;
    }
  }

  async createWorkoutSession(
    request: CreateSessionRequest
  ): Promise<WorkoutSession> {
    const response = await apiClient.post<WorkoutSession>(
      "/api/v1/workouts/sessions",
      request
    );

    return response.data;
  }

  async getWorkoutSession(sessionId: string): Promise<WorkoutSession> {
    const response = await apiClient.get<WorkoutSession>(
      `/api/v1/workouts/sessions/${sessionId}`,
      {
        enableCache: true,
        cacheTTL: 60000, // 1 minute - sessions change frequently during workouts
      }
    );

    return response.data;
  }

  async startWorkoutSession(sessionId: string): Promise<WorkoutSession> {
    const response = await apiClient.post<WorkoutSession>(
      `/api/v1/workouts/sessions/${sessionId}/start`
    );

    return response.data;
  }

  async logExerciseSet(
    sessionId: string,
    setData: LogSetRequest
  ): Promise<void> {
    await apiClient.post(
      `/api/v1/workouts/sessions/${sessionId}/sets`,
      setData
    );
  }

  async completeWorkout(
    sessionId: string,
    data: CompleteWorkoutRequest
  ): Promise<WorkoutSession> {
    const response = await apiClient.post<WorkoutSession>(
      `/api/v1/workouts/sessions/${sessionId}/complete`,
      data
    );

    // Clear relevant caches
    apiClient.clearCache();

    return response.data;
  }

  async getWorkoutSessions(params?: {
    status?: string;
    page?: number;
    limit?: number;
    startDate?: string;
    endDate?: string;
  }): Promise<PaginatedResponse<WorkoutSession>> {
    const queryParams = new URLSearchParams();

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const url = `/api/v1/workouts/sessions${
      queryParams.toString() ? `?${queryParams.toString()}` : ""
    }`;

    const response = await apiClient.get<PaginatedResponse<WorkoutSession>>(
      url,
      {
        enableCache: true,
        cacheTTL: 300000, // 5 minutes
      }
    );

    return response.data;
  }

  async getRecentSessions(limit: number = 10): Promise<WorkoutSession[]> {
    const response = await this.getWorkoutSessions({
      status: "completed",
      limit,
      page: 1,
    });

    return response.items;
  }

  async pauseWorkout(sessionId: string): Promise<WorkoutSession> {
    const response = await apiClient.post<WorkoutSession>(
      `/api/v1/workouts/sessions/${sessionId}/pause`
    );

    return response.data;
  }

  async resumeWorkout(sessionId: string): Promise<WorkoutSession> {
    const response = await apiClient.post<WorkoutSession>(
      `/api/v1/workouts/sessions/${sessionId}/resume`
    );

    return response.data;
  }

  async cancelWorkout(
    sessionId: string,
    reason?: string
  ): Promise<WorkoutSession> {
    const response = await apiClient.post<WorkoutSession>(
      `/api/v1/workouts/sessions/${sessionId}/cancel`,
      { reason }
    );

    return response.data;
  }

  // Workout Templates
  async getWorkoutTemplates(): Promise<WorkoutPlan[]> {
    const response = await apiClient.get<{ templates: WorkoutPlan[] }>(
      "/api/v1/workouts/templates",
      {
        enableCache: true,
        cacheTTL: 3600000, // 1 hour - templates don't change often
      }
    );

    return response.data.templates;
  }

  async createFromTemplate(
    templateId: string,
    customizations?: any
  ): Promise<WorkoutPlan> {
    const response = await apiClient.post<WorkoutPlan>(
      `/api/v1/workouts/templates/${templateId}/create`,
      customizations
    );

    // Clear cache to refresh plans
    apiClient.clearCache();

    return response.data;
  }

  // Quick workout creation
  async createQuickWorkout(
    exercises: Array<{
      exerciseId: string;
      sets: number;
      reps: string;
      restSeconds?: number;
    }>
  ): Promise<WorkoutSession> {
    const response = await apiClient.post<WorkoutSession>(
      "/api/v1/workouts/quick",
      { exercises }
    );

    return response.data;
  }
}

export const workoutService = new WorkoutService();
