import { io, Socket } from "socket.io-client";
import config from "../../config/environment";
import {
  WorkoutStartEvent,
  WorkoutCompleteEvent,
  SetLoggedEvent,
  FriendWorkoutStartedEvent,
  FriendWorkoutCompletedEvent,
  ReactionReceivedEvent,
} from "../../types/api";

type EventCallback = (data: any) => void;

export class WebSocketService {
  private socket: Socket | null = null;
  private isConnected = false;
  private eventListeners = new Map<string, EventCallback[]>();
  private eventQueue: Array<{ event: string; data: any }> = [];
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000; // Start with 1 second
  private maxReconnectDelay = 30000; // Max 30 seconds
  private heartbeatInterval: ReturnType<typeof setInterval> | null = null;
  private connectionTimeout: ReturnType<typeof setTimeout> | null = null;

  // Connection Management
  async connect(forceReconnect = false): Promise<void> {
    if (this.socket && this.isConnected && !forceReconnect) {
      console.log("WebSocket already connected");
      return;
    }

    if (forceReconnect && this.socket) {
      this.disconnect();
    }

    return new Promise((resolve, reject) => {
      try {
        const wsUrl =
          config.websocketUrl || config.apiUrl.replace(/^http/, "ws");

        this.socket = io(wsUrl, {
          transports: ["websocket", "polling"],
          timeout: 10000,
          reconnection: true,
          reconnectionAttempts: this.maxReconnectAttempts,
          reconnectionDelay: this.reconnectDelay,
          reconnectionDelayMax: this.maxReconnectDelay,
          forceNew: forceReconnect,
          auth: {
            // Auth token will be added from store
          },
        });

        this.setupEventListeners();

        // Set connection timeout
        this.connectionTimeout = setTimeout(() => {
          console.log("WebSocket connection timeout");
          reject(new Error("Connection timeout"));
        }, 15000);

        this.socket.on("connect", () => {
          console.log("WebSocket connected successfully");
          this.isConnected = true;
          this.reconnectAttempts = 0;
          this.reconnectDelay = 1000;

          if (this.connectionTimeout) {
            clearTimeout(this.connectionTimeout);
            this.connectionTimeout = null;
          }

          // Process queued events
          this.processEventQueue();

          // Start heartbeat
          this.startHeartbeat();

          resolve();
        });

        this.socket.on("connect_error", (error: Error) => {
          console.error("WebSocket connection error:", error);
          this.isConnected = false;

          if (this.connectionTimeout) {
            clearTimeout(this.connectionTimeout);
            this.connectionTimeout = null;
          }

          reject(error);
        });
      } catch (error) {
        console.error("Failed to initialize WebSocket:", error);
        reject(error);
      }
    });
  }

  private setupEventListeners(): void {
    if (!this.socket) return;

    this.socket.on("disconnect", (reason: string) => {
      console.log("WebSocket disconnected:", reason);
      this.isConnected = false;
      this.stopHeartbeat();

      if (reason === "io server disconnect") {
        // Reconnect manually if server disconnected
        this.reconnectWithBackoff();
      }
    });

    this.socket.on("reconnect", (attemptNumber: number) => {
      console.log(`WebSocket reconnected after ${attemptNumber} attempts`);
      this.isConnected = true;
      this.reconnectAttempts = 0;
      this.processEventQueue();
      this.startHeartbeat();
    });

    this.socket.on("reconnect_error", (error: Error) => {
      console.error("WebSocket reconnection error:", error);
      this.reconnectAttempts++;

      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        console.error("Max reconnection attempts reached");
        this.emitToListeners("connection:failed", { error });
      }
    });

    this.socket.on("error", (error: Error) => {
      console.error("WebSocket error:", error);
      this.emitToListeners("connection:error", { error });
    });

    // Real-time event listeners
    this.socket.on(
      "workout:friend_started",
      (data: FriendWorkoutStartedEvent) => {
        this.emitToListeners("workout:friend_started", data);
      }
    );

    this.socket.on(
      "workout:friend_completed",
      (data: FriendWorkoutCompletedEvent) => {
        this.emitToListeners("workout:friend_completed", data);
      }
    );

    this.socket.on(
      "social:reaction_received",
      (data: ReactionReceivedEvent) => {
        this.emitToListeners("social:reaction_received", data);
      }
    );

    this.socket.on("social:comment_received", (data: any) => {
      this.emitToListeners("social:comment_received", data);
    });

    this.socket.on("social:friend_request", (data: any) => {
      this.emitToListeners("social:friend_request", data);
    });

    this.socket.on("social:friend_accepted", (data: any) => {
      this.emitToListeners("social:friend_accepted", data);
    });

    this.socket.on("user:status_update", (data: any) => {
      this.emitToListeners("user:status_update", data);
    });

    this.socket.on("system:notification", (data: any) => {
      this.emitToListeners("system:notification", data);
    });

    this.socket.on("pong", (data: any) => {
      // Handle pong response for heartbeat
      console.log("Received pong:", data);
    });
  }

  private async reconnectWithBackoff(): Promise<void> {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error("Max reconnection attempts reached");
      return;
    }

    this.reconnectAttempts++;
    const delay = Math.min(
      this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1),
      this.maxReconnectDelay
    );

    console.log(
      `Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts})`
    );

    setTimeout(() => {
      this.connect(true).catch((error) => {
        console.error("Reconnection failed:", error);
      });
    }, delay);
  }

  private startHeartbeat(): void {
    this.stopHeartbeat();
    this.heartbeatInterval = setInterval(() => {
      this.ping();
    }, 30000); // Ping every 30 seconds
  }

  private stopHeartbeat(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  private processEventQueue(): void {
    while (this.eventQueue.length > 0 && this.isConnected) {
      const { event, data } = this.eventQueue.shift()!;
      this.emit(event, data);
    }
  }

  disconnect(): void {
    this.stopHeartbeat();

    if (this.connectionTimeout) {
      clearTimeout(this.connectionTimeout);
      this.connectionTimeout = null;
    }

    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }

    this.isConnected = false;
    this.reconnectAttempts = 0;
    console.log("WebSocket disconnected");
  }

  // Event Emission
  emit(event: string, data: any): void {
    if (this.isConnected && this.socket) {
      this.socket.emit(event, data);
      console.log(`WebSocket emit: ${event}`, data);
    } else {
      // Queue event for when connection is restored
      this.eventQueue.push({ event, data });
      console.log(`Queued event: ${event}`);
    }
  }

  // Workout Events
  emitWorkoutStart(data: WorkoutStartEvent): void {
    this.emit("workout:start", data);
  }

  emitWorkoutComplete(data: WorkoutCompleteEvent): void {
    this.emit("workout:complete", data);
  }

  emitSetLogged(data: SetLoggedEvent): void {
    this.emit("workout:set:logged", data);
  }

  emitMilestone(data: {
    type: string;
    exercise?: string;
    value: number;
    unit: string;
  }): void {
    this.emit("workout:milestone", data);
  }

  // Social Events
  emitFriendRequestSent(data: {
    targetUserId: string;
    message?: string;
  }): void {
    this.emit("friend:request:sent", data);
  }

  emitActivityReaction(data: {
    activityId: string;
    activityUserId: string;
    reactionType: string;
  }): void {
    this.emit("activity:reaction:added", data);
  }

  emitActivityComment(data: {
    activityId: string;
    activityUserId: string;
    comment: string;
  }): void {
    this.emit("activity:comment:added", data);
  }

  // System Events
  emitUserStatusUpdate(status: string): void {
    this.emit("user:status:update", { status });
  }

  ping(): void {
    this.emit("ping", { timestamp: Date.now() });
  }

  // Authentication
  updateAuth(token: string): void {
    if (this.socket) {
      this.socket.auth = { token };
      if (this.isConnected) {
        this.socket.emit("auth:update", { token });
      }
    }
  }

  // Event Listener Management
  on(event: string, callback: EventCallback): void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event)!.push(callback);
  }

  off(event: string, callback: EventCallback): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  private emitToListeners(event: string, data: any): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.forEach((callback) => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in event listener for ${event}:`, error);
        }
      });
    }
  }

  // Connection Status
  isConnectedToServer(): boolean {
    return this.isConnected && this.socket?.connected === true;
  }

  getConnectionState(): {
    connected: boolean;
    reconnectAttempts: number;
    queuedEvents: number;
  } {
    return {
      connected: this.isConnected,
      reconnectAttempts: this.reconnectAttempts,
      queuedEvents: this.eventQueue.length,
    };
  }

  // Health Check
  async healthCheck(): Promise<boolean> {
    if (!this.isConnected || !this.socket) {
      return false;
    }

    return new Promise((resolve) => {
      const timeout = setTimeout(() => {
        resolve(false);
      }, 5000);

      this.socket!.emit("ping", { timestamp: Date.now() });

      const onPong = () => {
        clearTimeout(timeout);
        this.socket!.off("pong", onPong);
        resolve(true);
      };

      this.socket!.on("pong", onPong);
    });
  }

  // Room Management
  joinRoom(roomId: string): void {
    this.emit("room:join", { roomId });
  }

  leaveRoom(roomId: string): void {
    this.emit("room:leave", { roomId });
  }

  // Get Socket Instance (for advanced usage)
  getSocket(): Socket | null {
    return this.socket;
  }
}

// Singleton instance
export const websocketService = new WebSocketService();
