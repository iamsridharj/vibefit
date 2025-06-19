import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from ".";
import config from "../config/environment";
import type {
  ApiResponse,
  AuthResponse,
  RegisterRequest,
  User,
  WorkoutPlan,
  WorkoutSession,
  Exercise,
  BodyMetrics,
  AIInsight,
  LLMConversation,
  WeeklyStats,
  CreateWorkoutSessionRequest,
  ProgressAnalytics,
  WorkoutPlanRequest,
  TodaysWorkout,
  SocialActivity,
} from "../types/api";

// Define the set details type
type SetDetails = NonNullable<
  WorkoutSession["exercises"][number]["setDetails"]
>[number];

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: `${config.apiUrl}/api/v1`,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).persisted.auth.token;
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      headers.set("content-type", "application/json");
      return headers;
    },
  }),
  tagTypes: [
    "User",
    "WorkoutPlan",
    "WorkoutSession",
    "Exercise",
    "BodyMetrics",
    "AIInsight",
    "LLMConversation",
    "WorkoutPlans",
    "Exercises",
    "Progress",
    "Social",
  ],
  endpoints: (builder) => ({
    // Authentication endpoints
    login: builder.mutation<
      ApiResponse<AuthResponse>,
      { email: string; password: string }
    >({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["User"],
    }),

    register: builder.mutation<ApiResponse<AuthResponse>, RegisterRequest>({
      query: (userData) => ({
        url: "/auth/register",
        method: "POST",
        body: userData,
      }),
      invalidatesTags: ["User"],
    }),

    appleSignIn: builder.mutation<ApiResponse<AuthResponse>, any>({
      query: (appleData) => ({
        url: "/auth/apple-signin",
        method: "POST",
        body: appleData,
      }),
      invalidatesTags: ["User"],
    }),

    logout: builder.mutation<ApiResponse<void>, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      invalidatesTags: ["User"],
    }),

    // User profile endpoints
    getProfile: builder.query<ApiResponse<User>, void>({
      query: () => "/user/profile",
      providesTags: ["User"],
    }),

    updateProfile: builder.mutation<ApiResponse<User>, Partial<User>>({
      query: (updates) => ({
        url: "/user/profile",
        method: "PUT",
        body: updates,
      }),
      invalidatesTags: ["User"],
    }),

    // Workout endpoints
    getWorkoutPlans: builder.query<ApiResponse<WorkoutPlan[]>, void>({
      query: () => "/workouts/plans",
      providesTags: ["WorkoutPlans"],
    }),

    getActivePlan: builder.query<{ data: { activePlan: WorkoutPlan } }, void>({
      query: () => "/workouts/plans/active",
    }),

    getWorkoutPlan: builder.query<ApiResponse<WorkoutPlan>, string>({
      query: (planId) => `/workouts/plans/${planId}`,
      providesTags: (result, error, planId) => [
        { type: "WorkoutPlan", id: planId },
      ],
    }),

    generateWorkoutPlan: builder.mutation<
      ApiResponse<WorkoutPlan>,
      WorkoutPlanRequest
    >({
      query: (request) => ({
        url: "/workouts/plans/generate",
        method: "POST",
        body: request,
      }),
      invalidatesTags: ["WorkoutPlans"],
    }),

    getTodaysWorkout: builder.query<{ data: TodaysWorkout }, void>({
      query: () => "/workouts/today",
    }),

    startWorkoutSession: builder.mutation<
      ApiResponse<WorkoutSession>,
      { workoutPlanId?: string }
    >({
      query: (data) => ({
        url: "/workouts/sessions/start",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["WorkoutSession"],
    }),

    logExerciseSet: builder.mutation<
      ApiResponse<SetDetails>,
      { sessionId: string; setData: Partial<SetDetails> }
    >({
      query: ({ sessionId, setData }) => ({
        url: `/workouts/sessions/${sessionId}/sets`,
        method: "POST",
        body: setData,
      }),
      invalidatesTags: ["WorkoutSession"],
    }),

    completeWorkoutSession: builder.mutation<
      ApiResponse<WorkoutSession>,
      {
        id: string;
        endTime: string;
        duration: number;
      }
    >({
      query: ({ id, ...body }) => ({
        url: `/workouts/sessions/${id}/complete`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["WorkoutSession", "WorkoutPlan"],
    }),

    getWorkoutHistory: builder.query<
      ApiResponse<WorkoutSession[]>,
      { page?: number; limit?: number }
    >({
      query: ({ page = 1, limit = 20 } = {}) =>
        `/workouts/history?page=${page}&limit=${limit}`,
      providesTags: ["WorkoutSession"],
    }),

    createWorkoutSession: builder.mutation<
      ApiResponse<WorkoutSession>,
      CreateWorkoutSessionRequest
    >({
      query: (body) => ({
        url: "/workouts/sessions",
        method: "POST",
        body,
      }),
      invalidatesTags: ["WorkoutSession"],
    }),

    getWorkoutSession: builder.query<ApiResponse<WorkoutSession>, string>({
      query: (id) => `/workouts/sessions/${id}`,
      providesTags: ["WorkoutSession"],
    }),

    updateWorkoutSession: builder.mutation<
      ApiResponse<WorkoutSession>,
      {
        id: string;
        status?: "not_started" | "in_progress" | "completed" | "cancelled";
        startTime?: string;
        endTime?: string;
        duration?: number;
        exercises?: Array<{
          id: string;
          exerciseId: string;
          name: string;
          sets: number;
          reps: string;
          rest: string;
          notes?: string;
          order: number;
          completed?: boolean;
          setDetails?: Array<{
            setNumber: number;
            weight?: number;
            reps: number;
            rpe?: number;
            completed: boolean;
            timestamp: string;
          }>;
        }>;
      }
    >({
      query: ({ id, ...body }) => ({
        url: `/workouts/sessions/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["WorkoutSession"],
    }),

    // Exercise endpoints
    getExercises: builder.query<
      ApiResponse<Exercise[]>,
      {
        category?: string;
        muscleGroups?: string[];
        equipment?: string[];
        difficultyLevel?: number;
        movementPattern?: string;
        page?: number;
        limit?: number;
      }
    >({
      query: (params) => ({
        url: "/exercises",
        params,
      }),
      providesTags: ["Exercises"],
    }),

    getExercise: builder.query<ApiResponse<Exercise>, string>({
      query: (exerciseId) => `/exercises/${exerciseId}`,
      providesTags: (result, error, exerciseId) => [
        { type: "Exercise", id: exerciseId },
      ],
    }),

    // Progress endpoints
    getProgressAnalytics: builder.query<
      ApiResponse<{
        analytics: {
          weight: {
            current: number;
            change: number;
            trend: "up" | "down" | "stable";
          };
          bodyComposition: {
            fatPercentage: {
              current: number;
              change: number;
            };
            muscleMass: {
              current: number;
              change: number;
            };
          };
          measurements: {
            waist: {
              current: number;
              change: number;
            };
          };
          trends: {
            weightTrend: Array<{
              date: string;
              value: number;
            }>;
          };
        };
      }>,
      { timeframe: number }
    >({
      query: ({ timeframe }) => ({
        url: "/progress/analytics",
        params: { timeframe },
      }),
      providesTags: ["Progress"],
    }),

    getBodyMetrics: builder.query<
      ApiResponse<{
        metrics: Array<{
          id: string;
          userId: string;
          weightKg: number;
          bodyFatPercentage: number;
          muscleMassKg: number;
          waterPercentage: number;
          measurements: {
            waistCm: number;
            chestCm: number;
            armCm: number;
            thighCm: number;
            neckCm: number;
            hipCm: number;
          };
          measurementMethod: "scale" | "calipers" | "dexa" | "manual";
          notes?: string;
          createdAt: string;
        }>;
      }>,
      { startDate: string; endDate: string }
    >({
      query: ({ startDate, endDate }) => ({
        url: "/progress/metrics",
        params: { startDate, endDate },
      }),
      providesTags: ["Progress"],
    }),

    getProgressComparison: builder.query<
      ApiResponse<{
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
      }>,
      { period1: number; period2: number }
    >({
      query: ({ period1, period2 }) => ({
        url: "/progress/comparison",
        params: { period1, period2 },
      }),
      providesTags: ["Progress"],
    }),

    addBodyMetric: builder.mutation<
      ApiResponse<BodyMetrics>,
      Partial<BodyMetrics>
    >({
      query: (metric) => ({
        url: "/progress/metrics",
        method: "POST",
        body: metric,
      }),
      invalidatesTags: ["BodyMetrics", "Progress"],
    }),

    updateBodyMetric: builder.mutation<
      ApiResponse<BodyMetrics>,
      { id: string; updates: Partial<BodyMetrics> }
    >({
      query: ({ id, updates }) => ({
        url: `/progress/metrics/${id}`,
        method: "PUT",
        body: updates,
      }),
      invalidatesTags: ["BodyMetrics", "Progress"],
    }),

    deleteBodyMetric: builder.mutation<ApiResponse<void>, string>({
      query: (id) => ({
        url: `/progress/metrics/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["BodyMetrics", "Progress"],
    }),

    getProgressStats: builder.query<ApiResponse<any>, { timeframe?: string }>({
      query: ({ timeframe = "month" } = {}) =>
        `/progress/stats?timeframe=${timeframe}`,
      providesTags: ["Progress"],
    }),

    // AI & LLM endpoints
    getInsights: builder.query<
      ApiResponse<AIInsight[]>,
      { timeframe?: string }
    >({
      query: ({ timeframe = "week" } = {}) =>
        `/llm/insights?timeframe=${timeframe}`,
      providesTags: ["AIInsight"],
    }),

    analyzeProgress: builder.mutation<ApiResponse<any>, { timeframe?: string }>(
      {
        query: (data) => ({
          url: "/llm/analyze-progress",
          method: "POST",
          body: data,
        }),
        invalidatesTags: ["AIInsight"],
      }
    ),

    sendChatMessage: builder.mutation<
      ApiResponse<any>,
      { message: string; conversationId?: string }
    >({
      query: (data) => ({
        url: "/llm/chat/message",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["LLMConversation"],
    }),

    getConversations: builder.query<ApiResponse<LLMConversation[]>, void>({
      query: () => "/llm/conversations",
      providesTags: ["LLMConversation"],
    }),

    getConversation: builder.query<ApiResponse<LLMConversation>, string>({
      query: (conversationId) => `/llm/conversations/${conversationId}`,
      providesTags: (result, error, conversationId) => [
        { type: "LLMConversation", id: conversationId },
      ],
    }),

    // Social endpoints
    getFriends: builder.query<ApiResponse<any[]>, void>({
      query: () => "/social/friends",
    }),

    sendFriendRequest: builder.mutation<ApiResponse<any>, { friendId: string }>(
      {
        query: (data) => ({
          url: "/social/friends/request",
          method: "POST",
          body: data,
        }),
      }
    ),

    acceptFriendRequest: builder.mutation<
      ApiResponse<any>,
      { requestId: string }
    >({
      query: ({ requestId }) => ({
        url: `/social/friends/accept/${requestId}`,
        method: "POST",
      }),
    }),

    getFeed: builder.query<
      ApiResponse<any[]>,
      { page?: number; limit?: number }
    >({
      query: ({ page = 1, limit = 20 } = {}) =>
        `/social/feed?page=${page}&limit=${limit}`,
    }),

    getWeeklyStats: builder.query<{ data: { weeklyStats: WeeklyStats } }, void>(
      {
        query: () => "/workouts/stats/weekly",
      }
    ),

    getSocialFeed: builder.query<
      { data: { activities: SocialActivity[] } },
      { limit?: number }
    >({
      query: (params) => ({
        url: "/social/feed",
        params,
      }),
    }),
  }),
});

// Export hooks for each endpoint
export const {
  // Auth
  useLoginMutation,
  useRegisterMutation,
  useAppleSignInMutation,
  useLogoutMutation,

  // User
  useGetProfileQuery,
  useUpdateProfileMutation,

  // Workouts
  useGetWorkoutPlansQuery,
  useGetActivePlanQuery,
  useGetWorkoutPlanQuery,
  useGenerateWorkoutPlanMutation,
  useGetTodaysWorkoutQuery,
  useStartWorkoutSessionMutation,
  useLogExerciseSetMutation,
  useGetWorkoutHistoryQuery,
  useCreateWorkoutSessionMutation,
  useGetWorkoutSessionQuery,
  useUpdateWorkoutSessionMutation,
  useCompleteWorkoutSessionMutation,

  // Exercises
  useGetExercisesQuery,
  useGetExerciseQuery,

  // Progress
  useGetProgressAnalyticsQuery,
  useGetBodyMetricsQuery,
  useGetProgressComparisonQuery,
  useAddBodyMetricMutation,
  useUpdateBodyMetricMutation,
  useDeleteBodyMetricMutation,
  useGetProgressStatsQuery,

  // AI & LLM
  useGetInsightsQuery,
  useAnalyzeProgressMutation,
  useSendChatMessageMutation,
  useGetConversationsQuery,
  useGetConversationQuery,

  // Social
  useGetFriendsQuery,
  useSendFriendRequestMutation,
  useAcceptFriendRequestMutation,
  useGetFeedQuery,

  useGetWeeklyStatsQuery,
  useGetSocialFeedQuery,
} = api;
