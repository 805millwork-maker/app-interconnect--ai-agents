/**
 * Inter-App Communication System
 * Enables WebSocket-based messaging and shared state management
 */

export type AppMessage = {
  id: string;
  from: string;
  to: string;
  type: "request" | "response" | "broadcast" | "event";
  payload: any;
  timestamp: number;
};

export type ConnectionStatus = "connected" | "disconnected" | "connecting" | "error";

export class InterAppCommunicator {
  private ws: WebSocket | null = null;
  private appId: string;
  private listeners: Map<string, Set<(message: AppMessage) => void>> = new Map();
  private connectionStatus: ConnectionStatus = "disconnected";
  private statusListeners: Set<(status: ConnectionStatus) => void> = new Set();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;

  constructor(appId: string) {
    this.appId = appId;
  }

  /**
   * Connect to the WebSocket server
   */
  connect(url: string = "ws://localhost:8080"): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      console.warn("Already connected");
      return;
    }

    this.setStatus("connecting");

    try {
      this.ws = new WebSocket(url);

      this.ws.onopen = () => {
        console.log(`App ${this.appId} connected to communication hub`);
        this.setStatus("connected");
        this.reconnectAttempts = 0;
        
        // Send registration message
        this.send({
          id: this.generateId(),
          from: this.appId,
          to: "hub",
          type: "event",
          payload: { event: "register", appId: this.appId },
          timestamp: Date.now(),
        });
      };

      this.ws.onmessage = (event) => {
        try {
          const message: AppMessage = JSON.parse(event.data);
          this.handleMessage(message);
        } catch (error) {
          console.error("Failed to parse message:", error);
        }
      };

      this.ws.onerror = (error) => {
        console.error("WebSocket error:", error);
        this.setStatus("error");
      };

      this.ws.onclose = () => {
        console.log("WebSocket connection closed");
        this.setStatus("disconnected");
        this.attemptReconnect(url);
      };
    } catch (error) {
      console.error("Failed to create WebSocket connection:", error);
      this.setStatus("error");
    }
  }

  /**
   * Disconnect from the WebSocket server
   */
  disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.reconnectAttempts = this.maxReconnectAttempts; // Prevent auto-reconnect
  }

  /**
   * Send a message to another app
   */
  sendTo(targetAppId: string, payload: any, type: AppMessage["type"] = "request"): void {
    const message: AppMessage = {
      id: this.generateId(),
      from: this.appId,
      to: targetAppId,
      type,
      payload,
      timestamp: Date.now(),
    };
    this.send(message);
  }

  /**
   * Broadcast a message to all connected apps
   */
  broadcast(payload: any): void {
    const message: AppMessage = {
      id: this.generateId(),
      from: this.appId,
      to: "all",
      type: "broadcast",
      payload,
      timestamp: Date.now(),
    };
    this.send(message);
  }

  /**
   * Listen for messages of a specific type
   */
  on(messageType: string, callback: (message: AppMessage) => void): () => void {
    if (!this.listeners.has(messageType)) {
      this.listeners.set(messageType, new Set());
    }
    this.listeners.get(messageType)!.add(callback);

    // Return unsubscribe function
    return () => {
      this.listeners.get(messageType)?.delete(callback);
    };
  }

  /**
   * Listen for connection status changes
   */
  onStatusChange(callback: (status: ConnectionStatus) => void): () => void {
    this.statusListeners.add(callback);
    // Immediately call with current status
    callback(this.connectionStatus);

    // Return unsubscribe function
    return () => {
      this.statusListeners.delete(callback);
    };
  }

  /**
   * Get current connection status
   */
  getStatus(): ConnectionStatus {
    return this.connectionStatus;
  }

  private send(message: AppMessage): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    } else {
      console.warn("WebSocket not connected. Message not sent:", message);
    }
  }

  private handleMessage(message: AppMessage): void {
    // Notify specific listeners
    const listeners = this.listeners.get(message.type);
    if (listeners) {
      listeners.forEach(callback => callback(message));
    }

    // Notify wildcard listeners
    const wildcardListeners = this.listeners.get("*");
    if (wildcardListeners) {
      wildcardListeners.forEach(callback => callback(message));
    }
  }

  private setStatus(status: ConnectionStatus): void {
    this.connectionStatus = status;
    this.statusListeners.forEach(callback => callback(status));
  }

  private attemptReconnect(url: string): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.log("Max reconnection attempts reached");
      return;
    }

    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
    
    console.log(`Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
    
    setTimeout(() => {
      this.connect(url);
    }, delay);
  }

  private generateId(): string {
    return `${this.appId}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

/**
 * Shared state manager for cross-app data synchronization
 */
export class SharedStateManager {
  private state: Map<string, any> = new Map();
  private listeners: Map<string, Set<(value: any) => void>> = new Map();
  private communicator: InterAppCommunicator;

  constructor(communicator: InterAppCommunicator) {
    this.communicator = communicator;
    
    // Listen for state updates from other apps
    this.communicator.on("broadcast", (message) => {
      if (message.payload.type === "state-update") {
        this.handleRemoteStateUpdate(message.payload.key, message.payload.value);
      }
    });
  }

  /**
   * Set a value in the shared state
   */
  set(key: string, value: any, broadcast: boolean = true): void {
    this.state.set(key, value);
    
    // Notify local listeners
    this.notifyListeners(key, value);
    
    // Broadcast to other apps
    if (broadcast) {
      this.communicator.broadcast({
        type: "state-update",
        key,
        value,
      });
    }
  }

  /**
   * Get a value from the shared state
   */
  get<T = any>(key: string): T | undefined {
    return this.state.get(key);
  }

  /**
   * Subscribe to changes for a specific key
   */
  subscribe(key: string, callback: (value: any) => void): () => void {
    if (!this.listeners.has(key)) {
      this.listeners.set(key, new Set());
    }
    this.listeners.get(key)!.add(callback);

    // Immediately call with current value if exists
    if (this.state.has(key)) {
      callback(this.state.get(key));
    }

    // Return unsubscribe function
    return () => {
      this.listeners.get(key)?.delete(callback);
    };
  }

  /**
   * Delete a key from the shared state
   */
  delete(key: string, broadcast: boolean = true): void {
    this.state.delete(key);
    
    if (broadcast) {
      this.communicator.broadcast({
        type: "state-delete",
        key,
      });
    }
  }

  /**
   * Clear all shared state
   */
  clear(broadcast: boolean = true): void {
    this.state.clear();
    
    if (broadcast) {
      this.communicator.broadcast({
        type: "state-clear",
      });
    }
  }

  private handleRemoteStateUpdate(key: string, value: any): void {
    this.state.set(key, value);
    this.notifyListeners(key, value);
  }

  private notifyListeners(key: string, value: any): void {
    const listeners = this.listeners.get(key);
    if (listeners) {
      listeners.forEach(callback => callback(value));
    }
  }
}

// Export singleton instance creator
export function createCommunicationHub(appId: string) {
  const communicator = new InterAppCommunicator(appId);
  const stateManager = new SharedStateManager(communicator);

  return {
    communicator,
    stateManager,
  };
}