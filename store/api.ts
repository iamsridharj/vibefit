import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "./index";
import type {
  User,
  WorkoutPlan,
  WorkoutSession,
  Exercise,
  BodyMetric,
  AIInsight,
  ApiResponse,
  AuthResponse,
  LoginForm,
  RegisterForm,
  LLMConversation,
  ExerciseSet,
} from "../types";

const API_BASE_URL = __DEV__
  ? "http://localhost:3000/api/v1"
  : "https://api.vibefit.com/api/v1";

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
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
    "BodyMetric",
    "AIInsight",
    "Conversation",
    "Progress",
  ],
  endpoints: (builder) => ({
    // Authentication endpoints
    login: builder.mutation<ApiResponse<AuthResponse>, LoginForm>({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["User"],
    }),

    register: builder.mutation<ApiResponse<AuthResponse>, RegisterForm>({
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
      providesTags: ["WorkoutPlan"],
    }),

    getWorkoutPlan: builder.query<ApiResponse<WorkoutPlan>, string>({
      query: (planId) => `/workouts/plans/${planId}`,
      providesTags: (result, error, planId) => [
        { type: "WorkoutPlan", id: planId },
      ],
    }),

    generateWorkoutPlan: builder.mutation<ApiResponse<WorkoutPlan>, any>({
      query: (planData) => ({
        url: "/llm/generate-plan",
        method: "POST",
        body: planData,
      }),
      invalidatesTags: ["WorkoutPlan"],
    }),

    getTodaysWorkout: builder.query<ApiResponse<WorkoutSession>, void>({
      query: () => "/workouts/today",
      providesTags: ["WorkoutSession"],
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
      ApiResponse<ExerciseSet>,
      { sessionId: string; setData: Partial<ExerciseSet> }
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
      { sessionId: string; sessionData: any }
    >({
      query: ({ sessionId, sessionData }) => ({
        url: `/workouts/sessions/${sessionId}/complete`,
        method: "POST",
        body: sessionData,
      }),
      invalidatesTags: ["WorkoutSession", "Progress"],
    }),

    getWorkoutHistory: builder.query<
      ApiResponse<WorkoutSession[]>,
      { page?: number; limit?: number }
    >({
      query: ({ page = 1, limit = 20 } = {}) =>
        `/workouts/history?page=${page}&limit=${limit}`,
      providesTags: ["WorkoutSession"],
    }),

    // Exercise endpoints
    getExercises: builder.query<
      ApiResponse<Exercise[]>,
      { category?: string; muscleGroup?: string }
    >({
      query: ({ category, muscleGroup } = {}) => {
        const params = new URLSearchParams();
        if (category) params.append("category", category);
        if (muscleGroup) params.append("muscleGroup", muscleGroup);
        return `/exercises?${params.toString()}`;
      },
      providesTags: ["Exercise"],
    }),

    getExercise: builder.query<ApiResponse<Exercise>, string>({
      query: (exerciseId) => `/exercises/${exerciseId}`,
      providesTags: (result, error, exerciseId) => [
        { type: "Exercise", id: exerciseId },
      ],
    }),

    // Progress endpoints
    getBodyMetrics: builder.query<
      ApiResponse<BodyMetric[]>,
      { startDate?: string; endDate?: string }
    >({
      query: ({ startDate, endDate } = {}) => {
        const params = new URLSearchParams();
        if (startDate) params.append("startDate", startDate);
        if (endDate) params.append("endDate", endDate);
        return `/progress/metrics?${params.toString()}`;
      },
      providesTags: ["BodyMetric"],
    }),

    addBodyMetric: builder.mutation<
      ApiResponse<BodyMetric>,
      Partial<BodyMetric>
    >({
      query: (metric) => ({
        url: "/progress/metrics",
        method: "POST",
        body: metric,
      }),
      invalidatesTags: ["BodyMetric", "Progress"],
    }),

    updateBodyMetric: builder.mutation<
      ApiResponse<BodyMetric>,
      { id: string; updates: Partial<BodyMetric> }
    >({
      query: ({ id, updates }) => ({
        url: `/progress/metrics/${id}`,
        method: "PUT",
        body: updates,
      }),
      invalidatesTags: ["BodyMetric", "Progress"],
    }),

    deleteBodyMetric: builder.mutation<ApiResponse<void>, string>({
      query: (id) => ({
        url: `/progress/metrics/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["BodyMetric", "Progress"],
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
      invalidatesTags: ["Conversation"],
    }),

    getConversations: builder.query<ApiResponse<LLMConversation[]>, void>({
      query: () => "/llm/conversations",
      providesTags: ["Conversation"],
    }),

    getConversation: builder.query<ApiResponse<LLMConversation>, string>({
      query: (conversationId) => `/llm/conversations/${conversationId}`,
      providesTags: (result, error, conversationId) => [
        { type: "Conversation", id: conversationId },
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
  useGetWorkoutPlanQuery,
  useGenerateWorkoutPlanMutation,
  useGetTodaysWorkoutQuery,
  useStartWorkoutSessionMutation,
  useLogExerciseSetMutation,
  useCompleteWorkoutSessionMutation,
  useGetWorkoutHistoryQuery,

  // Exercises
  useGetExercisesQuery,
  useGetExerciseQuery,

  // Progress
  useGetBodyMetricsQuery,
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
} = api;
