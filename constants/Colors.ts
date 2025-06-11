/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

export const Colors = {
  light: {
    // Primary colors
    primary: "#6366f1", // Indigo - main brand color
    primaryLight: "#818cf8", // Light indigo
    primaryDark: "#4f46e5", // Dark indigo

    // Secondary colors
    secondary: "#10b981", // Emerald - success/progress
    secondaryLight: "#34d399", // Light emerald
    secondaryDark: "#059669", // Dark emerald

    // Accent colors
    accent: "#f59e0b", // Amber - highlights/warnings
    accentLight: "#fbbf24", // Light amber
    accentDark: "#d97706", // Dark amber

    // Background colors
    background: "#ffffff", // Main background
    backgroundSecondary: "#f8fafc", // Secondary background
    surface: "#ffffff", // Card/surface background
    surfaceSecondary: "#f1f5f9", // Secondary surface

    // Text colors
    text: "#0f172a", // Primary text
    textSecondary: "#64748b", // Secondary text
    textTertiary: "#94a3b8", // Tertiary text
    textInverse: "#ffffff", // Text on dark backgrounds

    // Icon color
    icon: "#475569", // Default icon color

    // Border colors
    border: "#e2e8f0", // Default border
    borderLight: "#f1f5f9", // Light border
    borderDark: "#cbd5e1", // Dark border

    // Status colors
    success: "#10b981", // Success state
    successLight: "#d1fae5", // Success background
    error: "#ef4444", // Error state
    errorLight: "#fee2e2", // Error background
    warning: "#f59e0b", // Warning state
    warningLight: "#fef3c7", // Warning background
    info: "#3b82f6", // Info state
    infoLight: "#dbeafe", // Info background

    // Workout specific colors
    strength: "#8b5cf6", // Strength exercises
    cardio: "#ef4444", // Cardio exercises
    flexibility: "#06b6d4", // Flexibility exercises
    core: "#f59e0b", // Core exercises

    // Chart colors
    chart: {
      line1: "#6366f1",
      line2: "#10b981",
      line3: "#f59e0b",
      line4: "#ef4444",
      area: "#6366f1",
      areaOpacity: 0.1,
    },

    // Shadow
    shadow: "rgba(0, 0, 0, 0.1)",
    shadowDark: "rgba(0, 0, 0, 0.2)",

    // Overlay
    overlay: "rgba(0, 0, 0, 0.5)",
    overlayLight: "rgba(0, 0, 0, 0.3)",

    // Tab bar
    tint: "#6366f1",
    tabIconDefault: "#687076",
    tabIconSelected: "#6366f1",
  },

  dark: {
    // Primary colors
    primary: "#818cf8", // Light indigo for dark mode
    primaryLight: "#a5b4fc", // Lighter indigo
    primaryDark: "#6366f1", // Standard indigo

    // Secondary colors
    secondary: "#34d399", // Light emerald
    secondaryLight: "#6ee7b7", // Lighter emerald
    secondaryDark: "#10b981", // Standard emerald

    // Accent colors
    accent: "#fbbf24", // Light amber
    accentLight: "#fcd34d", // Lighter amber
    accentDark: "#f59e0b", // Standard amber

    // Background colors
    background: "#0f172a", // Main dark background
    backgroundSecondary: "#1e293b", // Secondary dark background
    surface: "#1e293b", // Card/surface background
    surfaceSecondary: "#334155", // Secondary surface

    // Text colors
    text: "#f8fafc", // Primary text (light)
    textSecondary: "#cbd5e1", // Secondary text
    textTertiary: "#94a3b8", // Tertiary text
    textInverse: "#0f172a", // Text on light backgrounds

    // Icon color
    icon: "#cbd5e1", // Default icon color for dark mode

    // Border colors
    border: "#334155", // Default border
    borderLight: "#475569", // Light border
    borderDark: "#1e293b", // Dark border

    // Status colors
    success: "#34d399", // Success state
    successLight: "#064e3b", // Success background (dark)
    error: "#f87171", // Error state
    errorLight: "#7f1d1d", // Error background (dark)
    warning: "#fbbf24", // Warning state
    warningLight: "#78350f", // Warning background (dark)
    info: "#60a5fa", // Info state
    infoLight: "#1e3a8a", // Info background (dark)

    // Workout specific colors
    strength: "#a78bfa", // Strength exercises
    cardio: "#f87171", // Cardio exercises
    flexibility: "#22d3ee", // Flexibility exercises
    core: "#fbbf24", // Core exercises

    // Chart colors
    chart: {
      line1: "#818cf8",
      line2: "#34d399",
      line3: "#fbbf24",
      line4: "#f87171",
      area: "#818cf8",
      areaOpacity: 0.2,
    },

    // Shadow
    shadow: "rgba(0, 0, 0, 0.3)",
    shadowDark: "rgba(0, 0, 0, 0.5)",

    // Overlay
    overlay: "rgba(0, 0, 0, 0.7)",
    overlayLight: "rgba(0, 0, 0, 0.5)",

    // Tab bar
    tint: "#818cf8",
    tabIconDefault: "#9CA3AF",
    tabIconSelected: "#818cf8",
  },
};

// Spacing constants
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
};

// Typography constants
export const typography = {
  fontSizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32,
    xxxxl: 40,
  },
  fontWeights: {
    light: "300" as const,
    regular: "400" as const,
    medium: "500" as const,
    semibold: "600" as const,
    bold: "700" as const,
  },
  lineHeights: {
    tight: 1.2,
    normal: 1.4,
    relaxed: 1.6,
  },
};

// Border radius constants
export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 24,
  round: 999,
};

// Animation durations
export const animations = {
  fast: 150,
  normal: 300,
  slow: 500,
};

// Common dimensions
export const dimensions = {
  buttonHeight: 48,
  inputHeight: 48,
  headerHeight: 60,
  tabBarHeight: 80,
  cardMinHeight: 120,
};

// Workout-specific colors mapping
export const workoutColors = {
  strength: {
    light: Colors.light.strength,
    dark: Colors.dark.strength,
  },
  cardio: {
    light: Colors.light.cardio,
    dark: Colors.dark.cardio,
  },
  flexibility: {
    light: Colors.light.flexibility,
    dark: Colors.dark.flexibility,
  },
  core: {
    light: Colors.light.core,
    dark: Colors.dark.core,
  },
  balance: {
    light: Colors.light.info,
    dark: Colors.dark.info,
  },
};

// Difficulty level colors
export const difficultyColors = {
  beginner: {
    light: Colors.light.success,
    dark: Colors.dark.success,
  },
  intermediate: {
    light: Colors.light.warning,
    dark: Colors.dark.warning,
  },
  advanced: {
    light: Colors.light.error,
    dark: Colors.dark.error,
  },
};
