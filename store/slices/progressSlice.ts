import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ProgressState, BodyMetric, AIInsight } from "../../types";

const initialState: ProgressState = {
  bodyMetrics: [],
  insights: [],
  currentStreak: 0,
  weeklyStats: null,
  loading: false,
  error: null,
};

const progressSlice = createSlice({
  name: "progress",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setBodyMetrics: (state, action: PayloadAction<BodyMetric[]>) => {
      state.bodyMetrics = action.payload;
    },
    addBodyMetric: (state, action: PayloadAction<BodyMetric>) => {
      state.bodyMetrics.unshift(action.payload);
    },
    updateBodyMetric: (
      state,
      action: PayloadAction<{ id: string; updates: Partial<BodyMetric> }>
    ) => {
      const index = state.bodyMetrics.findIndex(
        (metric) => metric.id === action.payload.id
      );
      if (index !== -1) {
        state.bodyMetrics[index] = {
          ...state.bodyMetrics[index],
          ...action.payload.updates,
        };
      }
    },
    removeBodyMetric: (state, action: PayloadAction<string>) => {
      state.bodyMetrics = state.bodyMetrics.filter(
        (metric) => metric.id !== action.payload
      );
    },
    setInsights: (state, action: PayloadAction<AIInsight[]>) => {
      state.insights = action.payload;
    },
    addInsight: (state, action: PayloadAction<AIInsight>) => {
      state.insights.unshift(action.payload);
    },
    setCurrentStreak: (state, action: PayloadAction<number>) => {
      state.currentStreak = action.payload;
    },
    setWeeklyStats: (state, action: PayloadAction<any>) => {
      state.weeklyStats = action.payload;
    },
    clearProgress: (state) => {
      state.bodyMetrics = [];
      state.insights = [];
      state.currentStreak = 0;
      state.weeklyStats = null;
      state.error = null;
    },
  },
});

export const {
  setLoading,
  setError,
  setBodyMetrics,
  addBodyMetric,
  updateBodyMetric,
  removeBodyMetric,
  setInsights,
  addInsight,
  setCurrentStreak,
  setWeeklyStats,
  clearProgress,
} = progressSlice.actions;

export default progressSlice.reducer;
