import { Platform } from "react-native";
import { RequestConfig } from "../types/api";

// Enhanced console logging for development
const isDev = __DEV__;

export class DebugLogger {
  private static instance: DebugLogger;
  private logs: Array<{
    level: string;
    message: string;
    timestamp: Date;
    data?: any;
  }> = [];

  public static getInstance(): DebugLogger {
    if (!DebugLogger.instance) {
      DebugLogger.instance = new DebugLogger();
    }
    return DebugLogger.instance;
  }

  private formatMessage(level: string, message: string, data?: any): string {
    const timestamp = new Date().toISOString();
    const platform = Platform.OS;
    return `[${timestamp}] [${platform.toUpperCase()}] [${level}] ${message}`;
  }

  private addLog(level: string, message: string, data?: any) {
    if (isDev) {
      this.logs.push({
        level,
        message,
        timestamp: new Date(),
        data,
      });

      // Keep only last 100 logs
      if (this.logs.length > 100) {
        this.logs = this.logs.slice(-100);
      }
    }
  }

  public info(message: string, data?: any) {
    const formatted = this.formatMessage("INFO", message, data);
    console.log(formatted, data || "");
    this.addLog("INFO", message, data);
  }

  public warn(message: string, data?: any) {
    const formatted = this.formatMessage("WARN", message, data);
    console.warn(formatted, data || "");
    this.addLog("WARN", message, data);
  }

  public error(message: string, error?: any) {
    const formatted = this.formatMessage("ERROR", message, error);
    console.error(formatted, error || "");
    this.addLog("ERROR", message, error);
  }

  public debug(message: string, data?: any) {
    if (isDev) {
      const formatted = this.formatMessage("DEBUG", message, data);
      console.log(`🐛 ${formatted}`, data || "");
      this.addLog("DEBUG", message, data);
    }
  }

  public api(endpoint: string, method: string, data?: any) {
    if (isDev) {
      const message = `API ${method.toUpperCase()} ${endpoint}`;
      const formatted = this.formatMessage("API", message, data);
      console.log(`🌐 ${formatted}`, data || "");
      this.addLog("API", message, data);
    }
  }

  public redux(action: string, payload?: any) {
    if (isDev) {
      const message = `Redux Action: ${action}`;
      const formatted = this.formatMessage("REDUX", message, payload);
      console.log(`🔄 ${formatted}`, payload || "");
      this.addLog("REDUX", message, payload);
    }
  }

  public navigation(from: string, to: string, params?: any) {
    if (isDev) {
      const message = `Navigation: ${from} -> ${to}`;
      const formatted = this.formatMessage("NAV", message, params);
      console.log(`🧭 ${formatted}`, params || "");
      this.addLog("NAV", message, params);
    }
  }

  public getLogs() {
    return this.logs;
  }

  public clearLogs() {
    this.logs = [];
    console.clear();
  }

  public exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }
}

// Singleton instance
export const logger = DebugLogger.getInstance();

// Performance monitoring
export class PerformanceMonitor {
  private static timers: Map<string, number> = new Map();

  public static start(label: string) {
    if (isDev) {
      this.timers.set(label, Date.now());
      logger.debug(`Performance timer started: ${label}`);
    }
  }

  public static end(label: string) {
    if (isDev) {
      const startTime = this.timers.get(label);
      if (startTime) {
        const duration = Date.now() - startTime;
        logger.debug(`Performance timer ${label}: ${duration}ms`);
        this.timers.delete(label);
      }
    }
  }

  public static measure<T>(label: string, fn: () => T): T {
    if (isDev) {
      this.start(label);
      const result = fn();
      this.end(label);
      return result;
    }
    return fn();
  }
}

// Network monitoring
export const NetworkMonitor = {
  addRequestInterceptor: (
    interceptor: (config: RequestConfig) => Promise<RequestConfig>
  ) => {
    NetworkMonitor.requestInterceptors.push(interceptor);
  },
  requestInterceptors: [] as Array<
    (config: RequestConfig) => Promise<RequestConfig>
  >,
  logRequest: (url: string, method: string, headers?: any, body?: any) => {
    if (isDev) {
      logger.api(url, method, { headers, body });
    }
  },
  logResponse: (url: string, status: number, data?: any, duration?: number) => {
    if (isDev) {
      const message = `Response ${status} from ${url}${
        duration ? ` (${duration}ms)` : ""
      }`;
      logger.info(message, data);
    }
  },
  logError: (url: string, error: any) => {
    if (isDev) {
      logger.error(`Network error for ${url}`, error);
    }
  },
};

// Debug panel for development
export const DebugPanel = {
  show: () => {
    if (isDev && console.table) {
      console.table(logger.getLogs().slice(-10));
    }
  },

  showNetworkLogs: () => {
    if (isDev) {
      const networkLogs = logger.getLogs().filter((log) => log.level === "API");
      console.table(networkLogs);
    }
  },

  showReduxLogs: () => {
    if (isDev) {
      const reduxLogs = logger.getLogs().filter((log) => log.level === "REDUX");
      console.table(reduxLogs);
    }
  },
};

// Global debug helpers (attach to window for console access)
if (isDev && typeof global !== "undefined") {
  (global as any).logger = logger;
  (global as any).perf = PerformanceMonitor;
  (global as any).debugPanel = DebugPanel;
}
