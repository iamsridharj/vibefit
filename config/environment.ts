import Constants from "expo-constants";

export interface Environment {
  apiUrl: string;
  websocketUrl: string;
  enableLogging: boolean;
  cacheTimeouts: {
    short: number; // 5 minutes
    medium: number; // 30 minutes
    long: number; // 24 hours
  };
  retryConfig: {
    maxRetries: number;
    baseDelay: number;
    maxDelay: number;
  };
  features: {
    offlineMode: boolean;
    pushNotifications: boolean;
    analytics: boolean;
    crashReporting: boolean;
  };
}

const environments: Record<string, Environment> = {
  development: {
    apiUrl: "http://localhost:4005",
    websocketUrl: "ws://localhost:4005",
    enableLogging: true,
    cacheTimeouts: {
      short: 5 * 60 * 1000, // 5 minutes
      medium: 30 * 60 * 1000, // 30 minutes
      long: 24 * 60 * 60 * 1000, // 24 hours
    },
    retryConfig: {
      maxRetries: 3,
      baseDelay: 1000,
      maxDelay: 10000,
    },
    features: {
      offlineMode: true,
      pushNotifications: true,
      analytics: false,
      crashReporting: false,
    },
  },
  staging: {
    apiUrl: "https://staging-api.vibefit.app",
    websocketUrl: "wss://staging-api.vibefit.app",
    enableLogging: true,
    cacheTimeouts: {
      short: 5 * 60 * 1000,
      medium: 30 * 60 * 1000,
      long: 24 * 60 * 60 * 1000,
    },
    retryConfig: {
      maxRetries: 3,
      baseDelay: 1000,
      maxDelay: 10000,
    },
    features: {
      offlineMode: true,
      pushNotifications: true,
      analytics: true,
      crashReporting: true,
    },
  },
  production: {
    apiUrl: "https://api.vibefit.app",
    websocketUrl: "wss://api.vibefit.app",
    enableLogging: false,
    cacheTimeouts: {
      short: 5 * 60 * 1000,
      medium: 30 * 60 * 1000,
      long: 24 * 60 * 60 * 1000,
    },
    retryConfig: {
      maxRetries: 5,
      baseDelay: 1000,
      maxDelay: 30000,
    },
    features: {
      offlineMode: true,
      pushNotifications: true,
      analytics: true,
      crashReporting: true,
    },
  },
};

// Get environment from app.json or default to development
const getEnvironment = (): string => {
  const releaseChannel = Constants.expoConfig?.extra?.environment;

  if (releaseChannel === "production") return "production";
  if (releaseChannel === "staging") return "staging";
  return "development";
};

const currentEnvironment = getEnvironment();
const config = environments[currentEnvironment];

if (!config) {
  throw new Error(
    `Environment configuration not found for: ${currentEnvironment}`
  );
}

console.log(`🌍 Environment: ${currentEnvironment}`);
console.log(`📡 API URL: ${config.apiUrl}`);
console.log(`🔌 WebSocket URL: ${config.websocketUrl}`);

export default config;
