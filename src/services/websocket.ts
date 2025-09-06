import { WSMessage, WSSubscribeMessage } from '@/types/parking';

export class WebSocketService {
  private ws: WebSocket | null = null;
  private url: string;
  private subscribers: Map<string, Set<(message: WSMessage) => void>> =
    new Map();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private currentGateId: string | null = null;
  private isConnecting = false;
  private reconnectTimer: NodeJS.Timeout | null = null;

  constructor(url: string = 'ws://localhost:3000/api/v1/ws') {
    this.url = url;
  }

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      // If already connected, resolve immediately
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        resolve();
        return;
      }

      // If already connecting, don't create another connection
      if (this.isConnecting) {
        // Wait for current connection attempt
        const checkConnection = () => {
          if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            resolve();
          } else if (!this.isConnecting) {
            reject(new Error('Connection failed'));
          } else {
            setTimeout(checkConnection, 100);
          }
        };
        checkConnection();
        return;
      }

      try {
        this.isConnecting = true;

        // Clean up any existing connection
        if (this.ws) {
          this.ws.close();
          this.ws = null;
        }

        this.ws = new WebSocket(this.url);

        this.ws.onopen = () => {
          console.log('WebSocket connected');
          this.reconnectAttempts = 0;
          this.isConnecting = false;

          // Clear any pending reconnect timer
          if (this.reconnectTimer) {
            clearTimeout(this.reconnectTimer);
            this.reconnectTimer = null;
          }

          // Note: Don't auto-resubscribe on reconnect as this can cause the flooding issue
          // Let components handle their own re-subscription logic
          console.log(
            'WebSocket reconnected - components should re-subscribe as needed'
          );

          resolve();
        };

        this.ws.onmessage = (event) => {
          try {
            const message: WSMessage = JSON.parse(event.data);
            this.notifySubscribers(message);
          } catch (error) {
            console.error('Failed to parse WebSocket message:', error);
          }
        };

        this.ws.onclose = (event) => {
          console.log('WebSocket disconnected:', event.code, event.reason);
          this.ws = null;
          this.isConnecting = false;

          // Clear subscription tracking since connection is lost
          console.log(
            `Clearing ${this.subscribedGates.size} gate subscriptions due to disconnect`
          );
          this.subscribedGates.clear();

          // Only attempt reconnect for abnormal closures and if we haven't exceeded max attempts
          if (
            event.code !== 1000 &&
            event.code !== 1001 &&
            this.reconnectAttempts < this.maxReconnectAttempts
          ) {
            this.scheduleReconnect();
          } else if (this.reconnectAttempts >= this.maxReconnectAttempts) {
            console.warn('Max WebSocket reconnection attempts reached');
          }
        };

        this.ws.onerror = (error) => {
          console.error('WebSocket error:', error);
          this.isConnecting = false;
          reject(error);
        };

        // Set a connection timeout
        setTimeout(() => {
          if (this.isConnecting) {
            this.isConnecting = false;
            reject(new Error('WebSocket connection timeout'));
          }
        }, 5000);
      } catch (error) {
        this.isConnecting = false;
        console.error('Failed to create WebSocket connection:', error);
        reject(error);
      }
    });
  }

  disconnect(): void {
    // Clear reconnect timer
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    this.reconnectAttempts = this.maxReconnectAttempts; // Prevent further reconnects

    if (this.ws) {
      this.ws.close(1000, 'Client disconnect');
      this.ws = null;
    }
    this.currentGateId = null;
    this.subscribers.clear();
    this.subscribedGates.clear();
    this.isConnecting = false;
    console.log('WebSocket disconnected and all subscriptions cleared');
  }

  private subscribedGates = new Set<string>();

  subscribeToGate(gateId: string): void {
    // Prevent duplicate subscriptions
    if (this.subscribedGates.has(gateId)) {
      console.log(
        `Already subscribed to gate: ${gateId}, skipping duplicate subscription`
      );
      return;
    }

    this.currentGateId = gateId;

    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      const message: WSSubscribeMessage = {
        type: 'subscribe',
        payload: { gateId },
      };
      this.ws.send(JSON.stringify(message));
      this.subscribedGates.add(gateId);
      console.log(
        `Subscribed to gate: ${gateId} (Total subscriptions: ${this.subscribedGates.size})`
      );
    }
  }

  unsubscribeFromGate(gateId: string): void {
    if (!this.subscribedGates.has(gateId)) {
      console.log(`Not subscribed to gate: ${gateId}, skipping unsubscribe`);
      return;
    }

    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      const message: WSSubscribeMessage = {
        type: 'unsubscribe',
        payload: { gateId },
      };
      this.ws.send(JSON.stringify(message));
      this.subscribedGates.delete(gateId);
      console.log(
        `Unsubscribed from gate: ${gateId} (Remaining subscriptions: ${this.subscribedGates.size})`
      );
    }

    if (this.currentGateId === gateId) {
      this.currentGateId = null;
    }
  }

  // Subscribe to messages with a callback
  onMessage(type: string, callback: (message: WSMessage) => void): () => void {
    if (!this.subscribers.has(type)) {
      this.subscribers.set(type, new Set());
    }
    this.subscribers.get(type)!.add(callback);

    // Return unsubscribe function
    return () => {
      const callbacks = this.subscribers.get(type);
      if (callbacks) {
        callbacks.delete(callback);
        if (callbacks.size === 0) {
          this.subscribers.delete(type);
        }
      }
    };
  }

  isConnected(): boolean {
    return this.ws !== null && this.ws.readyState === WebSocket.OPEN;
  }

  getCurrentGateId(): string | null {
    return this.currentGateId;
  }

  // Reset connection state (useful for debugging or manual refresh)
  reset(): void {
    this.disconnect();
    this.reconnectAttempts = 0;
  }

  // Get current connection status
  getConnectionStatus(): string {
    if (this.isConnecting) return 'connecting';
    if (this.ws && this.ws.readyState === WebSocket.OPEN) return 'connected';
    if (this.ws && this.ws.readyState === WebSocket.CONNECTING)
      return 'connecting';
    return 'disconnected';
  }

  // Get current subscriptions for debugging
  getCurrentSubscriptions(): string[] {
    return Array.from(this.subscribedGates);
  }

  // Unsubscribe from all gates
  unsubscribeFromAllGates(): void {
    console.log(`Unsubscribing from all ${this.subscribedGates.size} gates`);
    const gates = Array.from(this.subscribedGates);
    gates.forEach((gateId) => {
      this.unsubscribeFromGate(gateId);
    });
  }

  private notifySubscribers(message: WSMessage): void {
    // Notify subscribers for the specific message type
    const callbacks = this.subscribers.get(message.type);
    if (callbacks) {
      callbacks.forEach((callback) => callback(message));
    }

    // Also notify subscribers listening to all messages
    const allCallbacks = this.subscribers.get('all');
    if (allCallbacks) {
      allCallbacks.forEach((callback) => callback(message));
    }
  }

  private scheduleReconnect(): void {
    // Clear any existing reconnect timer
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    this.reconnectAttempts++;
    console.log(
      `Scheduling reconnect ${this.reconnectAttempts}/${
        this.maxReconnectAttempts
      } in ${this.reconnectDelay * this.reconnectAttempts}ms`
    );

    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null;

      // Double check we're not already connected or connecting
      if (
        !this.isConnecting &&
        (!this.ws || this.ws.readyState !== WebSocket.OPEN)
      ) {
        this.connect().catch((error) => {
          console.error('Reconnect failed:', error);
          if (this.reconnectAttempts >= this.maxReconnectAttempts) {
            console.error('Max reconnect attempts reached, giving up');
          }
        });
      }
    }, this.reconnectDelay * this.reconnectAttempts);
  }
}

// Create a singleton instance
export const wsService = new WebSocketService();

// Hook for using WebSocket in React components
export const useWebSocket = () => {
  return {
    connect: () => wsService.connect(),
    disconnect: () => wsService.disconnect(),
    subscribeToGate: (gateId: string) => wsService.subscribeToGate(gateId),
    unsubscribeFromGate: (gateId: string) =>
      wsService.unsubscribeFromGate(gateId),
    unsubscribeFromAllGates: () => wsService.unsubscribeFromAllGates(),
    onMessage: (type: string, callback: (message: WSMessage) => void) =>
      wsService.onMessage(type, callback),
    isConnected: () => wsService.isConnected(),
    getCurrentGateId: () => wsService.getCurrentGateId(),
    getCurrentSubscriptions: () => wsService.getCurrentSubscriptions(),
    reset: () => wsService.reset(),
    getConnectionStatus: () => wsService.getConnectionStatus(),
  };
};
