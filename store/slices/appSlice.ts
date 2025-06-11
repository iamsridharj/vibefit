import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// State Interface
interface AppState {
  isOnline: boolean;
  isAppActive: boolean;
  appVersion: string;
  buildNumber: string;
  lastSync: string | null;
  settings: {
    enableHapticFeedback: boolean;
    enablePushNotifications: boolean;
    enableSoundEffects: boolean;
    theme: "light" | "dark" | "system";
    units: "metric" | "imperial";
    language: string;
    autoSyncEnabled: boolean;
    offlineMode: boolean;
  };
  permissions: {
    camera: boolean;
    notifications: boolean;
    location: boolean;
    healthKit: boolean;
  };
  deviceInfo: {
    platform: "ios" | "android" | "web";
    deviceId: string | null;
    osVersion: string | null;
    appStoreVersion: string | null;
    hasUpdate: boolean;
  };
  onboarding: {
    isCompleted: boolean;
    currentStep: number;
    completedSteps: string[];
  };
  cache: {
    lastCleared: string | null;
    size: number;
  };
  analytics: {
    sessionId: string | null;
    sessionStartTime: string | null;
    crashReports: boolean;
    usageAnalytics: boolean;
  };
}

// Initial State
const initialState: AppState = {
  isOnline: true,
  isAppActive: true,
  appVersion: "1.0.0",
  buildNumber: "1",
  lastSync: null,
  settings: {
    enableHapticFeedback: true,
    enablePushNotifications: true,
    enableSoundEffects: true,
    theme: "system",
    units: "metric",
    language: "en",
    autoSyncEnabled: true,
    offlineMode: false,
  },
  permissions: {
    camera: false,
    notifications: false,
    location: false,
    healthKit: false,
  },
  deviceInfo: {
    platform: "ios",
    deviceId: null,
    osVersion: null,
    appStoreVersion: null,
    hasUpdate: false,
  },
  onboarding: {
    isCompleted: false,
    currentStep: 0,
    completedSteps: [],
  },
  cache: {
    lastCleared: null,
    size: 0,
  },
  analytics: {
    sessionId: null,
    sessionStartTime: null,
    crashReports: true,
    usageAnalytics: true,
  },
};

// Slice
const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    // Network & Connectivity
    setOnlineStatus: (state, action: PayloadAction<boolean>) => {
      state.isOnline = action.payload;
    },
    setAppActiveStatus: (state, action: PayloadAction<boolean>) => {
      state.isAppActive = action.payload;
    },
    updateLastSync: (state) => {
      state.lastSync = new Date().toISOString();
    },

    // Settings
    updateSettings: (
      state,
      action: PayloadAction<Partial<AppState["settings"]>>
    ) => {
      state.settings = { ...state.settings, ...action.payload };
    },
    toggleHapticFeedback: (state) => {
      state.settings.enableHapticFeedback =
        !state.settings.enableHapticFeedback;
    },
    togglePushNotifications: (state) => {
      state.settings.enablePushNotifications =
        !state.settings.enablePushNotifications;
    },
    toggleSoundEffects: (state) => {
      state.settings.enableSoundEffects = !state.settings.enableSoundEffects;
    },
    setTheme: (state, action: PayloadAction<"light" | "dark" | "system">) => {
      state.settings.theme = action.payload;
    },
    setUnits: (state, action: PayloadAction<"metric" | "imperial">) => {
      state.settings.units = action.payload;
    },
    setLanguage: (state, action: PayloadAction<string>) => {
      state.settings.language = action.payload;
    },
    toggleAutoSync: (state) => {
      state.settings.autoSyncEnabled = !state.settings.autoSyncEnabled;
    },
    toggleOfflineMode: (state) => {
      state.settings.offlineMode = !state.settings.offlineMode;
    },

    // Permissions
    updatePermissions: (
      state,
      action: PayloadAction<Partial<AppState["permissions"]>>
    ) => {
      state.permissions = { ...state.permissions, ...action.payload };
    },
    setCameraPermission: (state, action: PayloadAction<boolean>) => {
      state.permissions.camera = action.payload;
    },
    setNotificationPermission: (state, action: PayloadAction<boolean>) => {
      state.permissions.notifications = action.payload;
    },
    setLocationPermission: (state, action: PayloadAction<boolean>) => {
      state.permissions.location = action.payload;
    },
    setHealthKitPermission: (state, action: PayloadAction<boolean>) => {
      state.permissions.healthKit = action.payload;
    },

    // Device Info
    updateDeviceInfo: (
      state,
      action: PayloadAction<Partial<AppState["deviceInfo"]>>
    ) => {
      state.deviceInfo = { ...state.deviceInfo, ...action.payload };
    },
    setAppVersion: (
      state,
      action: PayloadAction<{ version: string; buildNumber: string }>
    ) => {
      state.appVersion = action.payload.version;
      state.buildNumber = action.payload.buildNumber;
    },
    setUpdateAvailable: (state, action: PayloadAction<boolean>) => {
      state.deviceInfo.hasUpdate = action.payload;
    },

    // Onboarding
    setOnboardingCompleted: (state, action: PayloadAction<boolean>) => {
      state.onboarding.isCompleted = action.payload;
    },
    setOnboardingStep: (state, action: PayloadAction<number>) => {
      state.onboarding.currentStep = action.payload;
    },
    addCompletedOnboardingStep: (state, action: PayloadAction<string>) => {
      if (!state.onboarding.completedSteps.includes(action.payload)) {
        state.onboarding.completedSteps.push(action.payload);
      }
    },
    resetOnboarding: (state) => {
      state.onboarding = {
        isCompleted: false,
        currentStep: 0,
        completedSteps: [],
      };
    },

    // Cache Management
    updateCacheInfo: (
      state,
      action: PayloadAction<{ size: number; lastCleared?: string }>
    ) => {
      state.cache.size = action.payload.size;
      if (action.payload.lastCleared) {
        state.cache.lastCleared = action.payload.lastCleared;
      }
    },
    clearCacheTimestamp: (state) => {
      state.cache.lastCleared = new Date().toISOString();
    },

    // Analytics
    startSession: (state) => {
      state.analytics.sessionId = Date.now().toString();
      state.analytics.sessionStartTime = new Date().toISOString();
    },
    endSession: (state) => {
      state.analytics.sessionId = null;
      state.analytics.sessionStartTime = null;
    },
    toggleCrashReports: (state) => {
      state.analytics.crashReports = !state.analytics.crashReports;
    },
    toggleUsageAnalytics: (state) => {
      state.analytics.usageAnalytics = !state.analytics.usageAnalytics;
    },
    updateAnalyticsSettings: (
      state,
      action: PayloadAction<Partial<AppState["analytics"]>>
    ) => {
      state.analytics = { ...state.analytics, ...action.payload };
    },

    // Reset
    resetAppState: (state) => {
      // Keep device info and permissions, reset everything else
      const deviceInfo = state.deviceInfo;
      const permissions = state.permissions;
      Object.assign(state, initialState, { deviceInfo, permissions });
    },
  },
});

export const {
  setOnlineStatus,
  setAppActiveStatus,
  updateLastSync,
  updateSettings,
  toggleHapticFeedback,
  togglePushNotifications,
  toggleSoundEffects,
  setTheme,
  setUnits,
  setLanguage,
  toggleAutoSync,
  toggleOfflineMode,
  updatePermissions,
  setCameraPermission,
  setNotificationPermission,
  setLocationPermission,
  setHealthKitPermission,
  updateDeviceInfo,
  setAppVersion,
  setUpdateAvailable,
  setOnboardingCompleted,
  setOnboardingStep,
  addCompletedOnboardingStep,
  resetOnboarding,
  updateCacheInfo,
  clearCacheTimestamp,
  startSession,
  endSession,
  toggleCrashReports,
  toggleUsageAnalytics,
  updateAnalyticsSettings,
  resetAppState,
} = appSlice.actions;

export default appSlice.reducer;
