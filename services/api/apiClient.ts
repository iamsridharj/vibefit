import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";
import config from "../../config/environment";
import {
  ApiResponse,
  ApiError,
  ApiMethod,
  RequestConfig,
  CachedResponse,
  ApiErrorType,
  RateLimitError,
  NetworkError,
  AuthenticationError,
  ValidationError,
} from "../../types/api";

export class ApiClient {
  private baseURL: string;
  private accessToken: string | null = null;
  private refreshToken: string | null = null;
  private isRefreshing = false;
  private cache = new Map<string, CachedResponse<any>>();
  private offlineQueue: Array<{
    url: string;
    config: RequestConfig;
    resolve: (value: any) => void;
    reject: (error: any) => void;
  }> = [];

  constructor() {
    this.baseURL = config.apiUrl;
    this.loadTokensFromStorage();
    this.setupNetworkListener();
  }

  private async loadTokensFromStorage() {
    try {
      const accessToken = await AsyncStorage.getItem("access_token");
      const refreshToken = await AsyncStorage.getItem("refresh_token");
      this.accessToken = accessToken;
      this.refreshToken = refreshToken;
    } catch (error) {
      console.warn("Failed to load tokens from storage:", error);
    }
  }

  private setupNetworkListener() {
    NetInfo.addEventListener((state) => {
      if (state.isConnected && this.offlineQueue.length > 0) {
        this.processOfflineQueue();
      }
    });
  }

  public setTokens(accessToken: string, refreshToken: string) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    AsyncStorage.setItem("access_token", accessToken);
    AsyncStorage.setItem("refresh_token", refreshToken);
  }

  public clearTokens() {
    this.accessToken = null;
    this.refreshToken = null;
    AsyncStorage.removeItem("access_token");
    AsyncStorage.removeItem("refresh_token");
  }

  private getAuthHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (this.accessToken) {
      headers["Authorization"] = `Bearer ${this.accessToken}`;
    }

    return headers;
  }

  private getCacheKey(url: string, method: ApiMethod, body?: any): string {
    const bodyHash = body ? JSON.stringify(body) : "";
    return `${method}:${url}:${bodyHash}`;
  }

  private getFromCache<T>(cacheKey: string): T | null {
    const cached = this.cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < cached.ttl) {
      return cached.data;
    }
    this.cache.delete(cacheKey);
    return null;
  }

  private setCache<T>(cacheKey: string, data: T, ttl: number) {
    this.cache.set(cacheKey, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }

  private async refreshAccessToken(): Promise<string> {
    if (this.isRefreshing) {
      // Wait for the current refresh to complete
      await new Promise((resolve) => setTimeout(resolve, 100));
      return this.refreshAccessToken();
    }

    if (!this.refreshToken) {
      throw new AuthenticationError("No refresh token available");
    }

    this.isRefreshing = true;

    try {
      const response = await fetch(`${this.baseURL}/api/v1/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken: this.refreshToken }),
      });

      if (!response.ok) {
        throw new AuthenticationError("Token refresh failed");
      }

      const data = await response.json();
      const newAccessToken = data.data.tokens.accessToken;

      this.setTokens(newAccessToken, this.refreshToken!);
      return newAccessToken;
    } finally {
      this.isRefreshing = false;
    }
  }

  private async handleApiError(response: Response): Promise<never> {
    let errorData: any;

    try {
      errorData = await response.json();
    } catch {
      errorData = {
        error: { code: "UNKNOWN_ERROR", message: `HTTP ${response.status}` },
      };
    }

    const { error } = errorData;

    switch (response.status) {
      case 401:
        throw new AuthenticationError(error.message || "Authentication failed");
      case 403:
        throw new ApiErrorType(
          "AUTHORIZATION_ERROR",
          error.message || "Access denied"
        );
      case 422:
        throw new ValidationError(
          error.message || "Validation failed",
          error.details
        );
      case 429:
        throw new RateLimitError(error.message || "Rate limit exceeded");
      case 500:
      case 502:
      case 503:
      case 504:
        throw new ApiErrorType("SERVER_ERROR", error.message || "Server error");
      default:
        throw new ApiErrorType(
          error.code || "API_ERROR",
          error.message || "Request failed"
        );
    }
  }

  private async retryWithBackoff<T>(
    operation: () => Promise<T>,
    maxRetries: number = config.retryConfig.maxRetries,
    baseDelay: number = config.retryConfig.baseDelay
  ): Promise<T> {
    let lastError: Error;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error as Error;

        if (error instanceof RateLimitError && attempt < maxRetries) {
          const delay = Math.min(
            baseDelay * Math.pow(2, attempt) + Math.random() * 1000,
            config.retryConfig.maxDelay
          );

          if (config.enableLogging) {
            console.log(
              `Retrying request in ${delay}ms (attempt ${
                attempt + 1
              }/${maxRetries})`
            );
          }

          await new Promise((resolve) => setTimeout(resolve, delay));
          continue;
        }

        // Don't retry non-retryable errors
        if (
          error instanceof AuthenticationError ||
          error instanceof ValidationError ||
          (error instanceof NetworkError && attempt >= maxRetries)
        ) {
          throw error;
        }

        if (attempt === maxRetries) {
          throw error;
        }

        // Regular retry with exponential backoff
        const delay = Math.min(
          baseDelay * Math.pow(2, attempt),
          config.retryConfig.maxDelay
        );
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }

    throw lastError!;
  }

  private async processOfflineQueue() {
    if (config.enableLogging) {
      console.log(`Processing ${this.offlineQueue.length} offline requests`);
    }

    const queue = [...this.offlineQueue];
    this.offlineQueue = [];

    for (const { url, config: requestConfig, resolve, reject } of queue) {
      try {
        const result = await this.request(url, requestConfig);
        resolve(result);
      } catch (error) {
        if (error instanceof NetworkError) {
          // Re-queue if still offline
          this.offlineQueue.push({
            url,
            config: requestConfig,
            resolve,
            reject,
          });
        } else {
          reject(error);
        }
      }
    }
  }

  public async request<T>(
    endpoint: string,
    config: RequestConfig = {}
  ): Promise<ApiResponse<T>> {
    const {
      method = "GET",
      timeout = 10000,
      retries = config.retries || 0,
      enableCache = false,
      cacheTTL = config.cacheTTL || 300000,
      ...fetchConfig
    } = config;

    const url = endpoint.startsWith("http")
      ? endpoint
      : `${this.baseURL}${endpoint}`;
    const cacheKey = this.getCacheKey(
      url,
      method as ApiMethod,
      fetchConfig.body
    );

    // Check cache for GET requests
    if (enableCache && method === "GET") {
      const cached = this.getFromCache<ApiResponse<T>>(cacheKey);
      if (cached) {
        return cached;
      }
    }

    // Check network connectivity
    const netInfo = await NetInfo.fetch();
    if (!netInfo.isConnected) {
      return new Promise((resolve, reject) => {
        this.offlineQueue.push({ url, config, resolve, reject });
      });
    }

    const operation = async (): Promise<ApiResponse<T>> => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      try {
        const headers = {
          ...this.getAuthHeaders(),
          ...fetchConfig.headers,
        };

        const response = await fetch(url, {
          ...fetchConfig,
          method,
          headers,
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          if (
            response.status === 401 &&
            this.accessToken &&
            this.refreshToken
          ) {
            try {
              await this.refreshAccessToken();
              // Retry with new token
              return this.request<T>(endpoint, config);
            } catch (refreshError) {
              this.clearTokens();
              throw refreshError;
            }
          }

          await this.handleApiError(response);
        }

        const data: ApiResponse<T> = await response.json();

        // Cache successful GET responses
        if (enableCache && method === "GET" && data.success) {
          this.setCache(cacheKey, data, cacheTTL);
        }

        return data;
      } catch (error: any) {
        clearTimeout(timeoutId);

        if (error.name === "AbortError") {
          throw new NetworkError("Request timeout");
        }

        if (error instanceof TypeError && error.message.includes("fetch")) {
          throw new NetworkError("Network connection failed");
        }

        throw error;
      }
    };

    return retries > 0
      ? this.retryWithBackoff(operation, retries)
      : operation();
  }

  // Convenience methods
  public get<T>(
    endpoint: string,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: "GET" });
  }

  public post<T>(
    endpoint: string,
    data?: any,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...config,
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  public put<T>(
    endpoint: string,
    data?: any,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...config,
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  public patch<T>(
    endpoint: string,
    data?: any,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...config,
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  public delete<T>(
    endpoint: string,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: "DELETE" });
  }

  // Health check
  public async healthCheck(): Promise<boolean> {
    try {
      const response = await this.get("/health", {
        timeout: 5000,
        enableCache: true,
        cacheTTL: 30000, // 30 seconds
      });
      return response.success;
    } catch {
      return false;
    }
  }

  // Clear cache
  public clearCache() {
    this.cache.clear();
  }

  // Get cache stats
  public getCacheStats() {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    };
  }
}

export const apiClient = new ApiClient();
