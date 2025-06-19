import { apiClient } from "./apiClient";
import { BodyMetrics, ProgressAnalytics } from "../../types/api";

export class ProgressService {
  async recordBodyMetrics(metrics: BodyMetrics): Promise<void> {
    await apiClient.post("/progress/metrics", metrics);
    apiClient.clearCache();
  }

  async getBodyMetrics(params: {
    startDate?: string;
    endDate?: string;
    limit?: number;
    metric?: "weight" | "bodyfat" | "musclemass" | "water" | "measurements";
  }): Promise<{
    metrics: BodyMetrics[];
  }> {
    const queryParams = new URLSearchParams();

    if (params.startDate) queryParams.append("startDate", params.startDate);
    if (params.endDate) queryParams.append("endDate", params.endDate);
    if (params.limit) queryParams.append("limit", params.limit.toString());
    if (params.metric) queryParams.append("metric", params.metric);

    const response = await apiClient.get<{ metrics: BodyMetrics[] }>(
      `/progress/metrics?${queryParams.toString()}`,
      {
        enableCache: true,
        cacheTTL: 300000, // 5 minutes
      }
    );

    return response.data;
  }

  async getProgressAnalytics(
    timeframe: number = 90
  ): Promise<ProgressAnalytics> {
    const response = await apiClient.get<{ analytics: ProgressAnalytics }>(
      `/progress/analytics?timeframe=${timeframe}`,
      {
        enableCache: true,
        cacheTTL: 300000, // 5 minutes
      }
    );

    return response.data.analytics;
  }

  async getProgressComparison(params: {
    period1?: number;
    period2?: number;
  }): Promise<{
    comparison: {
      period1: {
        startDate: string;
        endDate: string;
        metrics: {
          weight: {
            average: number;
            min: number;
            max: number;
          };
          bodyFat: {
            average: number;
            change: number;
          };
        };
      };
      period2: {
        startDate: string;
        endDate: string;
        metrics: {
          weight: {
            average: number;
            min: number;
            max: number;
          };
          bodyFat: {
            average: number;
            change: number;
          };
        };
      };
      differences: {
        weight: number;
        bodyFat: number;
        muscleMass: number;
      };
    };
  }> {
    const queryParams = new URLSearchParams();

    if (params.period1)
      queryParams.append("period1", params.period1.toString());
    if (params.period2)
      queryParams.append("period2", params.period2.toString());

    const response = await apiClient.get<{
      comparison: {
        period1: {
          startDate: string;
          endDate: string;
          metrics: {
            weight: {
              average: number;
              min: number;
              max: number;
            };
            bodyFat: {
              average: number;
              change: number;
            };
          };
        };
        period2: {
          startDate: string;
          endDate: string;
          metrics: {
            weight: {
              average: number;
              min: number;
              max: number;
            };
            bodyFat: {
              average: number;
              change: number;
            };
          };
        };
        differences: {
          weight: number;
          bodyFat: number;
          muscleMass: number;
        };
      };
    }>(`/progress/comparison?${queryParams.toString()}`, {
      enableCache: true,
      cacheTTL: 300000, // 5 minutes
    });

    return response.data;
  }

  async getWeightProgress(
    days: number = 30
  ): Promise<Array<{ date: string; value: number }>> {
    const endDate = new Date().toISOString().split("T")[0];
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0];

    const metrics = await this.getBodyMetrics({
      startDate,
      endDate,
      metric: "weight",
    });

    return metrics
      .filter((m) => m.weight)
      .map((m) => ({
        date: m.recordedAt.split("T")[0],
        value: m.weight!,
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }

  async getBodyCompositionProgress(days: number = 30): Promise<{
    bodyFat: Array<{ date: string; value: number }>;
    muscleMass: Array<{ date: string; value: number }>;
  }> {
    const endDate = new Date().toISOString().split("T")[0];
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0];

    const metrics = await this.getBodyMetrics({
      startDate,
      endDate,
    });

    const bodyFat = metrics
      .filter((m) => m.bodyFatPercentage)
      .map((m) => ({
        date: m.recordedAt.split("T")[0],
        value: m.bodyFatPercentage!,
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const muscleMass = metrics
      .filter((m) => m.muscleMass)
      .map((m) => ({
        date: m.recordedAt.split("T")[0],
        value: m.muscleMass!,
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return { bodyFat, muscleMass };
  }

  async getStrengthProgress(exerciseId?: string): Promise<
    Array<{
      exerciseName: string;
      data: Array<{
        date: string;
        weight: number;
        reps: number;
        volume: number;
      }>;
    }>
  > {
    const queryParams = new URLSearchParams();
    if (exerciseId) {
      queryParams.append("exerciseId", exerciseId);
    }

    const url = `/api/v1/progress/strength${
      queryParams.toString() ? `?${queryParams.toString()}` : ""
    }`;

    const response = await apiClient.get<{
      exercises: Array<{
        exerciseName: string;
        data: Array<{
          date: string;
          weight: number;
          reps: number;
          volume: number;
        }>;
      }>;
    }>(url, {
      enableCache: true,
      cacheTTL: 600000, // 10 minutes
    });

    return response.data.exercises;
  }

  async getVolumeProgress(
    days: number = 30
  ): Promise<Array<{ date: string; volume: number }>> {
    const response = await apiClient.get<{
      volume: Array<{ date: string; volume: number }>;
    }>(`/api/v1/progress/volume?days=${days}`, {
      enableCache: true,
      cacheTTL: 600000, // 10 minutes
    });

    return response.data.volume;
  }

  async getWorkoutFrequency(weeks: number = 4): Promise<{
    current: number;
    target: number;
    weekly: Array<{ week: string; count: number }>;
  }> {
    const response = await apiClient.get<{
      current: number;
      target: number;
      weekly: Array<{ week: string; count: number }>;
    }>(`/api/v1/progress/frequency?weeks=${weeks}`, {
      enableCache: true,
      cacheTTL: 600000, // 10 minutes
    });

    return response.data;
  }

  async getPersonalRecords(): Promise<
    Array<{
      exerciseName: string;
      recordType: "max_weight" | "max_reps" | "max_volume";
      value: number;
      unit: string;
      achievedAt: string;
    }>
  > {
    const response = await apiClient.get<{
      records: Array<{
        exerciseName: string;
        recordType: "max_weight" | "max_reps" | "max_volume";
        value: number;
        unit: string;
        achievedAt: string;
      }>;
    }>("/api/v1/progress/records", {
      enableCache: true,
      cacheTTL: 600000, // 10 minutes
    });

    return response.data.records;
  }

  async getMilestones(): Promise<
    Array<{
      id: string;
      type: string;
      title: string;
      description: string;
      achievedAt: string;
      value?: number;
      unit?: string;
    }>
  > {
    const response = await apiClient.get<{
      milestones: Array<{
        id: string;
        type: string;
        title: string;
        description: string;
        achievedAt: string;
        value?: number;
        unit?: string;
      }>;
    }>("/api/v1/progress/milestones", {
      enableCache: true,
      cacheTTL: 600000, // 10 minutes
    });

    return response.data.milestones;
  }

  async getProgressSummary(): Promise<{
    totalWorkouts: number;
    totalVolume: number;
    averageSessionDuration: number;
    currentStreak: number;
    longestStreak: number;
    personalRecords: number;
    goalsAchieved: number;
  }> {
    const response = await apiClient.get<{
      totalWorkouts: number;
      totalVolume: number;
      averageSessionDuration: number;
      currentStreak: number;
      longestStreak: number;
      personalRecords: number;
      goalsAchieved: number;
    }>("/api/v1/progress/summary", {
      enableCache: true,
      cacheTTL: 300000, // 5 minutes
    });

    return response.data;
  }

  async getInsights(): Promise<
    Array<{
      id: string;
      type: string;
      title: string;
      description: string;
      actionItems: string[];
      priority: number;
      generatedAt: string;
    }>
  > {
    const response = await apiClient.get<{
      insights: Array<{
        id: string;
        type: string;
        title: string;
        description: string;
        actionItems: string[];
        priority: number;
        generatedAt: string;
      }>;
    }>("/api/v1/progress/insights", {
      enableCache: true,
      cacheTTL: 600000, // 10 minutes
    });

    return response.data.insights;
  }

  async dismissInsight(insightId: string): Promise<void> {
    await apiClient.post(`/api/v1/progress/insights/${insightId}/dismiss`);

    // Clear cache to refresh insights
    apiClient.clearCache();
  }

  // Photos for progress tracking
  async uploadProgressPhoto(photo: {
    uri: string;
    type: "front" | "side" | "back";
    notes?: string;
  }): Promise<{ url: string }> {
    const formData = new FormData();
    formData.append("photo", {
      uri: photo.uri,
      type: "image/jpeg",
      name: `progress-${photo.type}-${Date.now()}.jpg`,
    } as any);
    formData.append("type", photo.type);
    if (photo.notes) {
      formData.append("notes", photo.notes);
    }

    const response = await apiClient.post<{ url: string }>(
      "/api/v1/progress/photos",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    // Clear cache to refresh progress data
    apiClient.clearCache();

    return response.data;
  }

  async getProgressPhotos(params?: {
    type?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<
    Array<{
      id: string;
      type: string;
      url: string;
      thumbnailUrl: string;
      notes?: string;
      takenAt: string;
    }>
  > {
    const queryParams = new URLSearchParams();

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value);
        }
      });
    }

    const url = `/api/v1/progress/photos${
      queryParams.toString() ? `?${queryParams.toString()}` : ""
    }`;

    const response = await apiClient.get<{
      photos: Array<{
        id: string;
        type: string;
        url: string;
        thumbnailUrl: string;
        notes?: string;
        takenAt: string;
      }>;
    }>(url, {
      enableCache: true,
      cacheTTL: 600000, // 10 minutes
    });

    return response.data.photos;
  }
}

export const progressService = new ProgressService();
