import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  WorkoutState,
  WorkoutPlan,
  WorkoutSession,
  Exercise,
} from "../../types";

const initialState: WorkoutState = {
  currentPlan: null,
  activeSession: null,
  workoutHistory: [],
  exercises: [],
  loading: false,
  error: null,
};

const workoutSlice = createSlice({
  name: "workout",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setCurrentPlan: (state, action: PayloadAction<WorkoutPlan | null>) => {
      state.currentPlan = action.payload;
    },
    setActiveSession: (state, action: PayloadAction<WorkoutSession | null>) => {
      state.activeSession = action.payload;
    },
    updateActiveSession: (
      state,
      action: PayloadAction<Partial<WorkoutSession>>
    ) => {
      if (state.activeSession) {
        state.activeSession = { ...state.activeSession, ...action.payload };
      }
    },
    addToWorkoutHistory: (state, action: PayloadAction<WorkoutSession>) => {
      state.workoutHistory.unshift(action.payload);
      // Keep only last 50 sessions for performance
      if (state.workoutHistory.length > 50) {
        state.workoutHistory = state.workoutHistory.slice(0, 50);
      }
    },
    setWorkoutHistory: (state, action: PayloadAction<WorkoutSession[]>) => {
      state.workoutHistory = action.payload;
    },
    setExercises: (state, action: PayloadAction<Exercise[]>) => {
      state.exercises = action.payload;
    },
    clearWorkoutState: (state) => {
      state.currentPlan = null;
      state.activeSession = null;
      state.error = null;
    },
  },
});

export const {
  setLoading,
  setError,
  setCurrentPlan,
  setActiveSession,
  updateActiveSession,
  addToWorkoutHistory,
  setWorkoutHistory,
  setExercises,
  clearWorkoutState,
} = workoutSlice.actions;

export default workoutSlice.reducer;
