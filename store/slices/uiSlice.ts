import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UIState {
  theme: "light" | "dark" | "system";
  isOnboardingComplete: boolean;
  activeTab: string;
  showWorkoutTimer: boolean;
  notifications: Array<{
    id: string;
    type: "info" | "success" | "warning" | "error";
    message: string;
    timestamp: number;
  }>;
  modals: {
    workoutComplete: boolean;
    bodyMetricEntry: boolean;
    exerciseDetail: boolean;
  };
}

const initialState: UIState = {
  theme: "system",
  isOnboardingComplete: false,
  activeTab: "Home",
  showWorkoutTimer: false,
  notifications: [],
  modals: {
    workoutComplete: false,
    bodyMetricEntry: false,
    exerciseDetail: false,
  },
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<"light" | "dark" | "system">) => {
      state.theme = action.payload;
    },
    setOnboardingComplete: (state, action: PayloadAction<boolean>) => {
      state.isOnboardingComplete = action.payload;
    },
    setActiveTab: (state, action: PayloadAction<string>) => {
      state.activeTab = action.payload;
    },
    setShowWorkoutTimer: (state, action: PayloadAction<boolean>) => {
      state.showWorkoutTimer = action.payload;
    },
    addNotification: (
      state,
      action: PayloadAction<
        Omit<UIState["notifications"][0], "id" | "timestamp">
      >
    ) => {
      const notification = {
        ...action.payload,
        id: Date.now().toString(),
        timestamp: Date.now(),
      };
      state.notifications.unshift(notification);
      // Keep only last 10 notifications
      if (state.notifications.length > 10) {
        state.notifications = state.notifications.slice(0, 10);
      }
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(
        (n) => n.id !== action.payload
      );
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
    setModal: (
      state,
      action: PayloadAction<{ modal: keyof UIState["modals"]; open: boolean }>
    ) => {
      state.modals[action.payload.modal] = action.payload.open;
    },
    resetUI: (state) => {
      state.activeTab = "Home";
      state.showWorkoutTimer = false;
      state.notifications = [];
      state.modals = {
        workoutComplete: false,
        bodyMetricEntry: false,
        exerciseDetail: false,
      };
    },
  },
});

export const {
  setTheme,
  setOnboardingComplete,
  setActiveTab,
  setShowWorkoutTimer,
  addNotification,
  removeNotification,
  clearNotifications,
  setModal,
  resetUI,
} = uiSlice.actions;

export default uiSlice.reducer;
