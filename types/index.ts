// Authentication Types
export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  gender?: "male" | "female" | "other";
  heightCm?: number;
  activityLevel?:
    | "sedentary"
    | "lightly_active"
    | "moderately_active"
    | "active"
    | "very_active";
  primaryGoal?:
    | "weight_loss"
    | "muscle_building"
    | "strength_building"
    | "endurance"
    | "general_fitness";
  emailVerified: boolean;
  appleId?: string;
  googleId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserPreferences {
  id: string;
  userId: string;
  experienceLevel: "beginner" | "intermediate" | "advanced";
  availableEquipment: string[];
  workoutDays: string[];
  sessionDurationMinutes: number;
  preferredWorkoutTime: "morning" | "afternoon" | "evening";
  injuriesLimitations?: string;
  maxDifficulty: number;
  focusAreas: string[];
  avoidExercises: string[];
  intensityPreference: "low" | "moderate" | "moderate_high" | "high";
  musicPreference?: string;
  notificationSettings: {
    workoutReminders: boolean;
    progressUpdates: boolean;
    socialUpdates: boolean;
  };
}

// Exercise Types
export interface Exercise {
  id: string;
  name: string;
  category: "strength" | "cardio" | "flexibility" | "core" | "balance";
  muscleGroups: string[];
  equipmentRequired: string[];
  difficultyLevel: number;
  instructions: string;
  safetyTips: string;
  videoUrl?: string;
  movementPattern: string;
  caloriesBurnedPerMinute: number;
}

export interface ExerciseSet {
  id: string;
  workoutSessionId: string;
  exerciseId: string;
  setNumber: number;
  weightKg?: number;
  reps: number;
  restSeconds: number;
  rpe?: number; // Rate of Perceived Exertion 1-10
  notes?: string;
  createdAt: string;
}

// Workout Types
export interface WorkoutPlan {
  id: string;
  userId: string;
  name: string;
  description: string;
  durationWeeks: number;
  difficultyLevel: number;
  goal: string;
  aiGenerated: boolean;
  planData: WorkoutPlanData;
  archivedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface WorkoutPlanData {
  metadata: {
    generatedAt: string;
    model: string;
    confidence: number;
    reasoning: string;
  };
  plan: {
    name: string;
    description: string;
    durationWeeks: number;
    difficultyLevel: number;
    workoutsPerWeek: number;
    estimatedDuration: number;
    goals: string[];
    adaptationStrategy: string;
  };
  weeks: WorkoutWeek[];
}

export interface WorkoutWeek {
  weekNumber: number;
  focus: string;
  workouts: WorkoutDay[];
}

export interface WorkoutDay {
  day: string;
  name: string;
  type: string;
  estimatedDuration: number;
  exercises: WorkoutExercise[];
}

export interface WorkoutExercise {
  exerciseId: string;
  name: string;
  sets: number;
  reps: string;
  weight: string;
  rest: number;
  notes: string;
  progressionNotes: string;
}

export interface WorkoutSession {
  id: string;
  userId: string;
  workoutPlanId?: string;
  workoutPlan?: WorkoutPlan;
  scheduledDate?: string;
  startedAt?: string;
  completedAt?: string;
  status: "scheduled" | "in_progress" | "completed" | "skipped";
  notes?: string;
  rating?: number;
  sessionData?: {
    totalWeight?: number;
    totalReps?: number;
    averageRestTime?: number;
    peakHeartRate?: number;
    averageHeartRate?: number;
    caloriesBurned?: number;
  };
  createdAt: string;
  updatedAt: string;
}

// Progress Types
export interface BodyMetric {
  id: string;
  userId: string;
  date: string;
  weightKg?: number;
  bodyFatPercentage?: number;
  muscleMassKg?: number;
  measurements?: {
    chest?: number;
    waist?: number;
    bicep?: number;
    thigh?: number;
    [key: string]: number | undefined;
  };
  notes?: string;
  createdAt: string;
}

export interface AIInsight {
  id: string;
  userId: string;
  insightType:
    | "progress_analysis"
    | "workout_optimization"
    | "adherence_encouragement"
    | "goal_progress";
  title: string;
  description: string;
  actionItems: string[];
  priority: number;
  confidence: number;
  metadata?: {
    generatedBy: string;
    [key: string]: any;
  };
  createdAt: string;
}

// Social Types
export interface SocialRelationship {
  id: string;
  userId: string;
  friendId: string;
  status: "pending" | "accepted" | "blocked";
  createdAt: string;
  acceptedAt?: string;
}

// Chat Types
export interface LLMConversation {
  id: string;
  userId: string;
  conversationTitle: string;
  messages: ChatMessage[];
  status: "active" | "archived";
  createdAt: string;
  updatedAt: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  actionItems?: ActionItem[];
}

export interface ActionItem {
  type: string;
  data: any;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  meta?: {
    timestamp: string;
    requestId?: string;
    pagination?: {
      page: number;
      limit: number;
      total: number;
    };
  };
}

export interface AuthResponse {
  user: User;
  token: string;
}

// Navigation Types
export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  Onboarding: undefined;
};

export type AuthStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Workouts: undefined;
  Progress: undefined;
  Social: undefined;
  Profile: undefined;
};

export type WorkoutStackParamList = {
  WorkoutsList: undefined;
  WorkoutPlan: { planId: string };
  WorkoutSession: { sessionId?: string; planId?: string };
  ExerciseDetail: { exerciseId: string };
  CreatePlan: undefined;
};

export type ProgressStackParamList = {
  ProgressDashboard: undefined;
  BodyMetrics: undefined;
  WorkoutHistory: undefined;
  Insights: undefined;
  Charts: undefined;
};

// UI Component Types
export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  error: string;
  success: string;
  warning: string;
  info: string;
}

export interface Theme {
  colors: ThemeColors;
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
  typography: {
    fontSizes: {
      xs: number;
      sm: number;
      md: number;
      lg: number;
      xl: number;
      xxl: number;
    };
    fontWeights: {
      light: string;
      regular: string;
      medium: string;
      semibold: string;
      bold: string;
    };
  };
  borderRadius: {
    sm: number;
    md: number;
    lg: number;
  };
}

// Form Types
export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
}

export interface OnboardingForm {
  personalInfo: {
    dateOfBirth: string;
    gender: string;
    heightCm: number;
    currentWeight: number;
  };
  fitnessProfile: {
    experienceLevel: string;
    primaryGoal: string;
    activityLevel: string;
  };
  preferences: {
    availableEquipment: string[];
    workoutDays: string[];
    sessionDuration: number;
    preferredTime: string;
    injuriesLimitations: string;
  };
}

// Error Types
export interface AppError {
  message: string;
  code?: string;
  statusCode?: number;
}

// State Types
export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

export interface WorkoutState {
  currentPlan: WorkoutPlan | null;
  activeSession: WorkoutSession | null;
  workoutHistory: WorkoutSession[];
  exercises: Exercise[];
  loading: boolean;
  error: string | null;
}

export interface ProgressState {
  bodyMetrics: BodyMetric[];
  insights: AIInsight[];
  currentStreak: number;
  weeklyStats: any;
  loading: boolean;
  error: string | null;
}
