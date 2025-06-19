import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";
import config from "../../config/environment";
import { NetworkMonitor, logger } from "../../utils/debugger";
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
  private isRefreshing = false;
  private cache = new Map<string, CachedResponse<any>>();
  private offlineQueue: Array<{
    url: string;
    config: RequestConfig;
    resolve: (value: any) => void;
    reject: (error: any) => void;
  }> = [];

  constructor() {
    this.baseURL = `${config.apiUrl}/api/v1`;
    this.loadTokensFromStorage();
    this.setupNetworkListener();
    this.setupRequestInterceptor();
  }

  private async loadTokensFromStorage() {
    try {
      const token = await AsyncStorage.getItem("accessToken");
      if (token) {
        this.accessToken = token;
      }
    } catch (error) {
      logger.error("Failed to load tokens from storage", error);
    }
  }

  private setupNetworkListener() {
    NetInfo.addEventListener((state) => {
      if (state.isConnected && this.offlineQueue.length > 0) {
        this.processOfflineQueue();
      }
    });
  }

  private setupRequestInterceptor() {
    NetworkMonitor.addRequestInterceptor(async (config) => {
      const requestId = Math.random().toString(36).substring(7);
      const timestamp = new Date().toISOString();

      return {
        ...config,
        headers: {
          ...config.headers,
          "X-Request-ID": requestId,
          "X-Client-Timestamp": timestamp,
          "X-Client-Version": config.appVersion || "1.0.0",
        },
      };
    });
  }

  private async processOfflineQueue() {
    const queue = [...this.offlineQueue];
    this.offlineQueue = [];

    for (const request of queue) {
      try {
        const response = await this.request(request.url, request.config);
        request.resolve(response);
      } catch (error) {
        request.reject(error);
      }
    }
  }

  private async handleApiError(response: Response): Promise<never> {
    let errorData: ApiError;

    try {
      errorData = await response.json();
    } catch {
      errorData = {
        success: false,
        error: {
          code: "UNKNOWN_ERROR",
          message: `HTTP ${response.status}`,
          requestId: response.headers.get("X-Request-ID") || "unknown",
        },
      };
    }

    const { error } = errorData;

    switch (response.status) {
      case 401:
        if (this.accessToken && !this.isRefreshing) {
          await this.refreshToken();
          throw new AuthenticationError(error.message, true);
        }
        throw new AuthenticationError(error.message);
      case 403:
        throw new ApiErrorType("FORBIDDEN", error.message);
      case 422:
        throw new ValidationError(error.message, error.details);
      case 429:
        const retryAfter = response.headers.get("Retry-After");
        throw new RateLimitError(error.message, parseInt(retryAfter || "60"));
      case 404:
        throw new ApiErrorType("NOT_FOUND", error.message);
      case 500:
      case 502:
      case 503:
      case 504:
        throw new ApiErrorType("SERVER_ERROR", error.message, error.requestId);
      default:
        throw new ApiErrorType(
          error.code || "API_ERROR",
          error.message,
          error.requestId
        );
    }
  }

  private getCacheKey(url: string, method: ApiMethod, body?: any): string {
    return `${method}:${url}${body ? `:${JSON.stringify(body)}` : ""}`;
  }

  private getFromCache<T>(key: string): T | null {
    const cached = this.cache.get(key);
    if (!cached) return null;

    if (Date.now() - cached.timestamp > cached.ttl) {
      this.cache.delete(key);
      return null;
    }

    return cached.data;
  }

  private setCache<T>(key: string, data: T, ttl: number) {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }

  public async request<T>(
    endpoint: string,
    config: RequestConfig = {}
  ): Promise<ApiResponse<T>> {
    const {
      method = "GET",
      timeout = 30000,
      retries = 3,
      enableCache = false,
      cacheTTL = 300000,
      headers = {},
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

    if (enableCache && method === "GET") {
      const cached = this.getFromCache<ApiResponse<T>>(cacheKey);
      if (cached) {
        return cached;
      }
    }

    const netInfo = await NetInfo.fetch();
    if (!netInfo.isConnected) {
      return new Promise((resolve, reject) => {
        this.offlineQueue.push({ url, config, resolve, reject });
        throw new NetworkError("No internet connection");
      });
    }

    const operation = async () => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);
      const requestStartTime = Date.now();

      try {
        const response = await fetch(url, {
          method,
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "X-Client-Version": config.appVersion || "1.0.0",
            ...(this.accessToken
              ? { Authorization: `Bearer ${this.accessToken}` }
              : {}),
            ...headers,
          },
          signal: controller.signal,
          ...fetchConfig,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          await this.handleApiError(response);
        }

        const data = await response.json();
        const processingTime = Date.now() - requestStartTime;

        // Enhance response with additional metadata
        const enhancedResponse = {
          ...data,
          meta: {
            ...data.meta,
            processingTime,
            requestId: response.headers.get("X-Request-ID") || undefined,
            version: response.headers.get("X-API-Version") || undefined,
          },
        };

        if (enableCache && method === "GET") {
          this.setCache(cacheKey, enhancedResponse, cacheTTL);
        }

        return enhancedResponse as ApiResponse<T>;
      } catch (error) {
        if (error instanceof Error) {
          if (error.name === "AbortError") {
            throw new ApiErrorType(
              "TIMEOUT",
              "Request timed out",
              headers["X-Request-ID"]
            );
          }
          throw error;
        }
        throw new ApiErrorType(
          "UNKNOWN_ERROR",
          "An unknown error occurred",
          headers["X-Request-ID"]
        );
      } finally {
        clearTimeout(timeoutId);
      }
    };

    return retries > 0
      ? this.retryWithBackoff(operation, retries)
      : operation();
  }

  private async retryWithBackoff<T>(
    operation: () => Promise<T>,
    retriesLeft: number,
    baseDelay: number = 1000
  ): Promise<T> {
    try {
      return await operation();
    } catch (error) {
      if (
        retriesLeft === 0 ||
        error instanceof AuthenticationError ||
        error instanceof ValidationError
      ) {
        throw error;
      }

      const delay = baseDelay * Math.pow(2, 3 - retriesLeft);
      await new Promise((resolve) => setTimeout(resolve, delay));

      return this.retryWithBackoff(operation, retriesLeft - 1, baseDelay);
    }
  }

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

  public setAccessToken(token: string) {
    this.accessToken = token;
    AsyncStorage.setItem("accessToken", token);
  }

  public clearAccessToken() {
    this.accessToken = null;
    AsyncStorage.removeItem("accessToken");
  }

  public clearCache() {
    this.cache.clear();
  }

  public getCacheStats() {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    };
  }

  private async refreshToken(): Promise<void> {
    if (this.isRefreshing) return;

    this.isRefreshing = true;
    try {
      const refreshToken = await AsyncStorage.getItem("refreshToken");
      if (!refreshToken) {
        throw new AuthenticationError("No refresh token available");
      }

      const response = await this.post<{ accessToken: string }>(
        "/auth/refresh",
        { refreshToken }
      );

      this.setAccessToken(response.data.accessToken);
    } catch (error) {
      this.clearTokens();
      throw error;
    } finally {
      this.isRefreshing = false;
    }
  }

  public clearTokens() {
    this.accessToken = null;
    AsyncStorage.multiRemove(["accessToken", "refreshToken"]);
  }
}

export const apiClient = new ApiClient();
