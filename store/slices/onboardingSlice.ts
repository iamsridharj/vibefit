import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface OnboardingData {
  // Personal Info (for user identification only)
  firstName?: string;
  lastName?: string;

  // Fitness Profile (needed for API)
  experienceLevel?: "beginner" | "intermediate" | "advanced";
  primaryGoal?: string;

  // Preferences (needed for API)
  selectedEquipment?: string[];
  workoutDays?: string[];
  sessionDuration?: number;

  // Generated Plan
  generatedPlan?: any;
}

interface OnboardingState {
  data: OnboardingData;
  currentStep: number;
  isComplete: boolean;
  formData: {
    experienceLevel: string;
    fitnessGoals: string[];
    timePerSession: number;
    daysPerWeek: number;
    programDuration: number;
    equipmentPreference: string[];
    intensityPreference: string;
    exercisePreferences: string[];
  };
  generatedPlan: any | null;
}

const initialState: OnboardingState = {
  data: {},
  currentStep: 1,
  isComplete: false,
  formData: {
    experienceLevel: "",
    fitnessGoals: [],
    timePerSession: 0,
    daysPerWeek: 0,
    programDuration: 0,
    equipmentPreference: [],
    intensityPreference: "",
    exercisePreferences: [],
  },
  generatedPlan: null,
};

const onboardingSlice = createSlice({
  name: "onboarding",
  initialState,
  reducers: {
    updatePersonalInfo: (
      state,
      action: PayloadAction<Partial<OnboardingData>>
    ) => {
      state.data = { ...state.data, ...action.payload };
    },
    updateFitnessProfile: (
      state,
      action: PayloadAction<Partial<OnboardingData>>
    ) => {
      state.data = { ...state.data, ...action.payload };
    },
    updatePreferences: (
      state,
      action: PayloadAction<Partial<OnboardingData>>
    ) => {
      state.data = { ...state.data, ...action.payload };
    },
    setGeneratedPlan: (state, action: PayloadAction<any>) => {
      state.generatedPlan = action.payload;
    },
    setCurrentStep: (state, action: PayloadAction<number>) => {
      state.currentStep = action.payload;
    },
    completeOnboarding: (state) => {
      state.isComplete = true;
    },
    resetOnboarding: (state) => {
      state.data = {};
      state.currentStep = 1;
      state.isComplete = false;
      state.formData = {
        experienceLevel: "",
        fitnessGoals: [],
        timePerSession: 0,
        daysPerWeek: 0,
        programDuration: 0,
        equipmentPreference: [],
        intensityPreference: "",
        exercisePreferences: [],
      };
      state.generatedPlan = null;
    },
    setFormData: (
      state,
      action: PayloadAction<Partial<OnboardingState["formData"]>>
    ) => {
      state.formData = {
        ...state.formData,
        ...action.payload,
      };
    },
  },
});

export const {
  updatePersonalInfo,
  updateFitnessProfile,
  updatePreferences,
  setGeneratedPlan,
  setCurrentStep,
  completeOnboarding,
  resetOnboarding,
  setFormData,
} = onboardingSlice.actions;

export default onboardingSlice.reducer;
