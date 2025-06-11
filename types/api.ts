// Base API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  meta?: {
    timestamp: string;
    requestId?: string;
  };
}

export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
  };
  timestamp: string;
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
}

export interface AppleSignInRequest {
  identityToken: string;
  authorizationCode: string;
  firstName?: string;
  lastName?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: string;
}

export interface AuthResponse {
  user: User;
  tokens: AuthTokens;
}

// User Types
export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  gender?: "male" | "female" | "other" | "prefer_not_to_say";
  heightCm?: number;
  currentWeightKg?: number;
  activityLevel?:
    | "sedentary"
    | "lightly_active"
    | "moderately_active"
    | "very_active"
    | "extremely_active";
  primaryGoal?:
    | "weight_loss"
    | "muscle_gain"
    | "strength_training"
    | "general_fitness"
    | "endurance"
    | "flexibility";
  secondaryGoals?: string[];
  experienceLevel?: "beginner" | "intermediate" | "advanced" | "expert";
  availableEquipment?: string[];
  workoutDays?: string[];
  sessionDurationMinutes?: number;
  injuriesLimitations?: string;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface FitnessProfile {
  activityLevel: string;
  primaryGoal: string;
  secondaryGoals: string[];
  experienceLevel: string;
  availableEquipment: string[];
  workoutDays: string[];
  sessionDurationMinutes: number;
  injuriesLimitations?: string;
}

// Exercise Types
export interface Exercise {
  id: string;
  name: string;
  category: string;
  muscleGroups: string[];
  equipmentRequired: string[];
  difficultyLevel: number;
  instructions: string;
  formTips?: string;
  videoUrl?: string;
  imageUrl?: string;
  movementPattern: string;
  programmingTags?: string[];
  isActive: boolean;
}

export interface ExerciseSearchParams {
  q?: string;
  page?: number;
  limit?: number;
  category?: string;
  muscle?: string;
  equipment?: string;
  difficulty?: number;
}

// Workout Plan Types
export interface WorkoutExercise {
  exerciseId: string;
  name: string;
  sets: number;
  reps: string;
  weight?: number;
  restSeconds?: number;
  notes?: string;
}

export interface Workout {
  day: string;
  name: string;
  exercises: WorkoutExercise[];
}

export interface Week {
  weekNumber: number;
  workouts: Workout[];
}

export interface WorkoutPlan {
  id: string;
  userId: string;
  name: string;
  description?: string;
  durationWeeks?: number;
  difficultyLevel?: number;
  goal?: string;
  aiGenerated: boolean;
  planData?: {
    weeks: Week[];
  };
  status: "draft" | "active" | "completed" | "archived";
  startedAt?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface GeneratePlanRequest {
  goal: string;
  durationWeeks: number;
  workoutsPerWeek: number;
  sessionDuration: number;
  equipment: string[];
  preferences?: {
    focusAreas?: string[];
    avoidExercises?: string[];
    intensity?: string;
  };
}

// Workout Session Types
export interface ExerciseSet {
  exerciseId: string;
  setNumber: number;
  reps?: number;
  weight?: number;
  duration?: number;
  distance?: number;
  rpe?: number;
  notes?: string;
  completedAt: string;
}

export interface WorkoutSession {
  id: string;
  userId: string;
  planId?: string;
  workoutName: string;
  status: "planned" | "in_progress" | "completed" | "cancelled";
  startedAt?: string;
  completedAt?: string;
  rating?: number;
  notes?: string;
  fatigue?: number;
  exercises: ExerciseSet[];
}

export interface CreateSessionRequest {
  planId: string;
  workoutName: string;
  scheduledDate: string;
  exercises: Array<{
    exerciseId: string;
    plannedSets: number;
    plannedReps: string;
  }>;
}

export interface LogSetRequest {
  exerciseId: string;
  setNumber: number;
  reps: number;
  weight: number;
  duration?: number;
  rpe?: number;
  notes?: string;
}

export interface CompleteWorkoutRequest {
  rating: number;
  notes?: string;
  fatigue?: number;
}

// Progress Types
export interface BodyMetrics {
  weight?: number;
  bodyFatPercentage?: number;
  muscleMass?: number;
  recordedAt: string;
}

export interface ProgressAnalytics {
  weightProgress?: {
    current: number;
    startWeight: number;
    change: number;
    trend: string;
    data: Array<{ date: string; value: number }>;
  };
  strengthProgress?: Record<
    string,
    {
      current: number;
      starting: number;
      improvement: number;
    }
  >;
}

// Social Types
export interface SocialActivity {
  id: string;
  type: "workout_completed" | "milestone_achieved" | "friend_joined";
  userId: string;
  userName: string;
  content: any;
  reactions: Reaction[];
  comments: Comment[];
  timestamp: string;
}

export interface Reaction {
  userId: string;
  type: "like" | "fire" | "strong" | "clap" | "heart";
  timestamp: string;
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  content: string;
  timestamp: string;
}

export interface FriendRequest {
  id: string;
  fromUserId: string;
  toUserId: string;
  fromUserName: string;
  message?: string;
  status: "pending" | "accepted" | "declined";
  createdAt: string;
}

export interface Friend {
  id: string;
  firstName: string;
  lastName: string;
  isOnline: boolean;
  lastActive?: string;
}

// WebSocket Event Types
export interface WorkoutStartEvent {
  workoutName: string;
  estimatedDuration: number;
}

export interface WorkoutCompleteEvent {
  workoutName: string;
  duration: number;
  exercises: number;
  rating: number;
  notes?: string;
}

export interface SetLoggedEvent {
  exerciseName: string;
  reps: number;
  weight: number;
}

export interface FriendWorkoutStartedEvent {
  userId: string;
  userName: string;
  workoutName: string;
}

export interface FriendWorkoutCompletedEvent {
  userId: string;
  userName: string;
  workoutData: WorkoutCompleteEvent;
}

export interface ReactionReceivedEvent {
  activityId: string;
  fromUserId: string;
  fromUserName: string;
  reactionType: string;
  timestamp: string;
}

// Health Check Types
export interface HealthCheckResponse {
  status: "healthy" | "unhealthy";
  checks: {
    server: boolean;
    openai: boolean;
    database: boolean;
    redis: boolean;
    websocket: boolean;
    connectedUsers: number;
  };
  timestamp: string;
  uptime: number;
  version: string;
}

// Error Types
export class ApiErrorType extends Error {
  constructor(public code: string, message: string, public details?: any) {
    super(message);
    this.name = "ApiError";
  }
}

export class RateLimitError extends ApiErrorType {
  constructor(message: string) {
    super("RATE_LIMIT_EXCEEDED", message);
    this.name = "RateLimitError";
  }
}

export class NetworkError extends ApiErrorType {
  constructor(message: string) {
    super("NETWORK_ERROR", message);
    this.name = "NetworkError";
  }
}

export class AuthenticationError extends ApiErrorType {
  constructor(message: string) {
    super("AUTHENTICATION_ERROR", message);
    this.name = "AuthenticationError";
  }
}

export class ValidationError extends ApiErrorType {
  constructor(message: string, details?: any) {
    super("VALIDATION_ERROR", message, details);
    this.name = "ValidationError";
  }
}

// Request/Response wrapper types
export type ApiMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface RequestConfig extends Omit<RequestInit, "cache"> {
  timeout?: number;
  retries?: number;
  enableCache?: boolean;
  cacheTTL?: number;
}

export interface CachedResponse<T> {
  data: T;
  timestamp: number;
  ttl: number;
}
