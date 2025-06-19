// Base API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  meta?: {
    timestamp: string;
    requestId: string;
    version: string;
    processingTime?: number;
    pagination?: {
      page: number;
      limit: number;
      total: number;
      hasMore: boolean;
    };
    tokenUsage?: {
      promptTokens: number;
      completionTokens: number;
      totalTokens: number;
    };
  };
}

export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, any>;
    stack?: string;
    requestId: string;
  };
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Authentication Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  dateOfBirth?: string;
  gender?: "male" | "female" | "other" | "prefer_not_to_say";
  fitnessGoals?: string[];
  experienceLevel?: "beginner" | "intermediate" | "advanced";
}

export interface AppleSignInRequest {
  identityToken: string;
  authorizationCode: string;
  firstName?: string;
  lastName?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// User Types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  dateOfBirth?: string;
  gender?: "male" | "female" | "other" | "prefer_not_to_say";
  fitnessGoals?: string[];
  experienceLevel?: "beginner" | "intermediate" | "advanced";
  profileComplete?: boolean;
  activePlan?: boolean;
  createdAt: string;
  updatedAt: string;
}

// Exercise Types
export interface Exercise {
  id: string;
  name: string;
  description: string;
  category: string;
  muscleGroups: string[];
  equipment: string[];
  difficultyLevel: number;
  movementPattern: string;
  instructions: string[];
  tips: string[];
  videoUrl?: string;
  imageUrl?: string;
  variations: string[];
  createdAt: string;
  updatedAt: string;
}

// Workout Types
export interface WorkoutPlanRequest {
  userGoals: string[];
  constraints: {
    timePerSession: number;
    daysPerWeek: number;
    durationWeeks: number;
  };
  preferences: {
    intensityPreference: "low" | "moderate" | "high" | "variable";
    equipmentPreference: string[];
    exercisePreferences?: string[];
  };
}

export interface GenerateWorkoutPlanRequest {
  userGoals: string[];
  constraints: {
    timePerSession: number;
    daysPerWeek: number;
    durationWeeks: number;
  };
  preferences: {
    intensityPreference: "low" | "moderate" | "high" | "variable";
    equipmentPreference: string[];
    exercisePreferences?: string[];
  };
}

export interface CreateWorkoutSessionRequest {
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
}

export interface WorkoutPlan {
  id: string;
  userId: string;
  name: string;
  description: string;
  goal: string;
  status: "draft" | "active" | "completed" | "archived";
  durationWeeks: number | null;
  difficultyLevel: string | null;
  aiGenerated: boolean;
  planData?: {
    plan: {
      name: string;
      description: string;
      duration: string;
      difficulty: string;
      timePerSession: number;
    };
    weeks: Array<{
      week: number;
      days: Array<{
        day: string;
        exercises: Array<{
          name: string;
          sets: number;
          reps: string;
          rest: string;
        }>;
      }>;
    }>;
    alternatives: Record<string, string>;
    progressionPlan: string;
  };
  metadata: any;
  nextSession?: {
    weekNumber: number;
    dayNumber: number;
    focus: string;
    scheduledFor: string;
  };
  createdAt: string;
  startedAt: string | null;
  completedAt: string | null;
  archivedAt: string | null;
  updatedAt: string;
}

export interface WorkoutSession {
  id: string;
  userId: string;
  planId?: string;
  type: "plan" | "custom";
  status: "not_started" | "in_progress" | "completed" | "cancelled";
  startTime?: string;
  endTime?: string;
  duration?: number;
  exercises: Array<{
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
  metrics?: {
    totalVolume: number;
    totalExercises: number;
    completedExercises: number;
    totalSets: number;
    completedSets: number;
    duration: number;
  };
}

// Progress Types
export interface BodyMetrics {
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
}

export interface ProgressAnalytics {
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
}

export interface AIInsight {
  id: string;
  userId: string;
  type: "progress" | "workout" | "nutrition" | "recovery";
  title: string;
  description: string;
  recommendations: string[];
  metrics: Record<string, any>;
  createdAt: string;
}

export interface LLMConversation {
  id: string;
  userId: string;
  type: "workout" | "nutrition" | "general";
  messages: Array<{
    role: "user" | "assistant";
    content: string;
    timestamp: string;
  }>;
  context?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

// Social Types
export interface ActivityContent {
  title: string;
  description: string;
  metadata: any;
}

export interface Comment {
  id: string;
  userId: string;
  content: string;
  createdAt: string;
}

export interface WeeklyStats {
  totalSessions: number;
  totalDuration: number;
  volumeByMuscleGroup: {
    [key: string]: number;
  };
  sessionsPerDay: {
    monday: number;
    tuesday: number;
    wednesday: number;
    thursday: number;
    friday: number;
    saturday: number;
    sunday: number;
  };
  comparison: {
    sessionsChange: number;
    volumeChange: number;
    durationChange: number;
  };
}

export interface TodaysWorkout {
  id: string;
  type: "plan" | "custom";
  status: "not_started" | "in_progress" | "completed" | "cancelled";
  exercises: Array<{
    id: string;
    exerciseId: string;
    name: string;
    sets: number;
    reps: string;
    rest: string;
    notes: string;
    order: number;
  }>;
}

export interface SocialActivity {
  id: string;
  userId: string;
  type:
    | "workout_completed"
    | "achievement_unlocked"
    | "plan_started"
    | "friend_joined";
  content: ActivityContent;
  reactions: {
    like: number;
    fire: number;
    strong: number;
  };
  comments: Comment[];
  createdAt: string;
}

export interface FriendRequest {
  id: string;
  requesterId: string;
  targetUserId: string;
  status: "pending" | "accepted" | "declined";
  message?: string;
  createdAt: string;
  acceptedAt?: string;
}

export interface Friend {
  id: string;
  firstName: string;
  lastName: string;
  isOnline: boolean;
  lastActive?: string;
  totalWorkouts: number;
  currentStreak: number;
  mutualFriends: number;
  isFriend: boolean;
}

// Request/Response wrapper types
export type ApiMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface RequestConfig {
  method?: ApiMethod;
  headers?: Record<string, string>;
  timeout?: number;
  retries?: number;
  enableCache?: boolean;
  cacheTTL?: number;
  appVersion?: string;
  body?: any;
  signal?: AbortSignal;
}

export interface CachedResponse<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

// Error Types
export class ApiErrorType extends Error {
  constructor(
    public code: string,
    message: string,
    public requestId?: string,
    public details?: Record<string, any>
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export class AuthenticationError extends ApiErrorType {
  constructor(
    message: string,
    public isRefreshable: boolean = false,
    requestId?: string
  ) {
    super("AUTHENTICATION_ERROR", message, requestId);
    this.name = "AuthenticationError";
  }
}

export class ValidationError extends ApiErrorType {
  constructor(
    message: string,
    public validationErrors?: Record<string, any>,
    requestId?: string
  ) {
    super("VALIDATION_ERROR", message, requestId, validationErrors);
    this.name = "ValidationError";
  }
}

export class RateLimitError extends ApiErrorType {
  constructor(
    message: string,
    public retryAfterSeconds: number,
    requestId?: string
  ) {
    super("RATE_LIMIT_ERROR", message, requestId, {
      retryAfter: retryAfterSeconds,
    });
    this.name = "RateLimitError";
  }
}

export class NetworkError extends ApiErrorType {
  constructor(message: string = "Network error occurred") {
    super("NETWORK_ERROR", message);
    this.name = "NetworkError";
  }
}

export class ServerError extends ApiErrorType {
  constructor(message: string, requestId?: string) {
    super("SERVER_ERROR", message, requestId);
    this.name = "ServerError";
  }
}

export interface OnboardingPlanRequest {
  userGoals: string[];
  constraints: {
    timePerSession: number;
    daysPerWeek: number;
    durationWeeks: number;
  };
  preferences: {
    intensityPreference: "low" | "moderate" | "high" | "variable";
    equipmentPreference: string[];
    exercisePreferences?: string[];
  };
}

export interface OnboardingPlanResponse {
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
}

export interface SavePlanRequest {
  generatedPlan: {
    plan: {
      name: string;
      description: string;
      duration: string;
      difficulty: string;
    };
    weeks: Array<{
      week: number;
      days: Array<{
        day: string;
        exercises: Array<{
          name: string;
          sets: number;
          reps: string;
          rest: string;
        }>;
      }>;
    }>;
    progressionPlan: string;
    alternatives: {
      [exerciseName: string]: string;
    };
  };
}

export interface SavePlanResponse {
  plan: WorkoutPlan;
  message: string;
}

export interface LogSetRequest {
  weight?: number;
  reps: number;
  rpe?: number;
}

export interface CompleteWorkoutRequest {
  rating?: number;
  feedback?: string;
}
