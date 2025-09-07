import { wsService } from './websocket';
import { WSMessage } from '@/types/parking';

export interface AuditLogEntry {
  id: string;
  adminId: string;
  action: string;
  targetType: string;
  targetId: string;
  timestamp: string;
  details?: any;
}

class AuditLogService {
  private static instance: AuditLogService | null = null;
  private logs: AuditLogEntry[] = [];
  private listeners: Set<(logs: AuditLogEntry[]) => void> = new Set();
  private isInitialized = false;
  private unsubscribe: (() => void) | null = null;
  private readonly STORAGE_KEY = 'admin_audit_logs';
  private readonly STORAGE_EXPIRY_HOURS = 24;
  private isLoadingInitialData = true;
  private lastZoneUpdateTime = new Map<string, number>();
  private readonly ZONE_UPDATE_THROTTLE_MS = 1000; // Only log zone updates every 1 second per zone
  private subscribedGateIds: string[] = []; // Track which gates we've subscribed to

  private constructor() {
    console.log(
      'AuditLogService: Private constructor called - loading logs from storage'
    );
    this.loadLogsFromStorage();
  }

  public static getInstance(): AuditLogService {
    if (!AuditLogService.instance) {
      console.log('AuditLogService: Creating new singleton instance');
      AuditLogService.instance = new AuditLogService();
    } else {
      console.log('AuditLogService: Returning existing singleton instance');
    }
    return AuditLogService.instance;
  }

  async initialize(gateIds: string[]) {
    if (this.isInitialized) {
      console.log('AuditLogService: Already initialized, skipping');
      return;
    }

    console.log('AuditLogService: Initializing with gates:', gateIds);

    try {
      // Connect to websocket if not connected
      if (!wsService.isConnected()) {
        await wsService.connect();
      }

      // Subscribe to ALL gates so we can receive admin updates and zone updates from all gates
      // This ensures the audit log works independently of other components
      console.log(
        'AuditLogService: Subscribing to all gates for comprehensive logging'
      );

      gateIds.forEach((gateId) => {
        wsService.subscribeToGate(gateId);
        console.log(`AuditLogService: Subscribed to gate ${gateId}`);
      });

      this.subscribedGateIds = [...gateIds]; // Store for cleanup later
      console.log(
        'AuditLogService: Successfully subscribed to all gates:',
        this.subscribedGateIds
      );

      // Listen for both admin-update and zone-update messages
      const unsubscribeAdmin = wsService.onMessage(
        'admin-update',
        this.handleAdminUpdate
      );
      const unsubscribeZone = wsService.onMessage(
        'zone-update',
        this.handleZoneUpdate
      );

      // Combine cleanup functions
      this.unsubscribe = () => {
        unsubscribeAdmin();
        unsubscribeZone();

        // Also unsubscribe from all gates we subscribed to
        console.log(
          'AuditLogService: Cleaning up gate subscriptions:',
          this.subscribedGateIds
        );
        this.subscribedGateIds.forEach((gateId) => {
          wsService.unsubscribeFromGate(gateId);
          console.log(`AuditLogService: Unsubscribed from gate ${gateId}`);
        });
        this.subscribedGateIds = [];
      };

      this.isInitialized = true;
      console.log(
        'AuditLogService: WebSocket initialized successfully. Total logs available:',
        this.logs.length
      );

      // Allow some time for initial websocket messages, then start processing new events
      setTimeout(() => {
        this.isLoadingInitialData = false;
        console.log(
          'AuditLogService: Now processing live events (initial loading period ended)'
        );
      }, 2000); // 2 second buffer for initial messages
    } catch (error) {
      console.error('AuditLogService: Failed to initialize:', error);
    }
  }

  private handleAdminUpdate = (message: WSMessage) => {
    if (message.type === 'admin-update') {
      console.log(
        'AuditLogService: Received admin-update (always processed):',
        {
          action: message.payload.action,
          targetId: message.payload.targetId,
          adminId: message.payload.adminId,
        }
      );
      const newLog: AuditLogEntry = {
        id: `${Date.now()}-${Math.random()}`,
        adminId: message.payload.adminId,
        action: message.payload.action,
        targetType: message.payload.targetType,
        targetId: message.payload.targetId,
        timestamp: message.payload.timestamp,
        details: message.payload.details,
      };

      this.addLogEntry(newLog);
    }
  };

  private handleZoneUpdate = (message: WSMessage) => {
    if (message.type === 'zone-update') {
      const zoneId = message.payload.id;
      const now = Date.now();
      const lastUpdateTime = this.lastZoneUpdateTime.get(zoneId) || 0;

      // Throttle zone updates to prevent flooding
      if (now - lastUpdateTime < this.ZONE_UPDATE_THROTTLE_MS) {
        // Silently ignore rapid zone updates (don't log to reduce console spam)
        return;
      }

      console.log(
        'AuditLogService: Processing zone-update for zone:',
        zoneId,
        'isLoadingInitialData:',
        this.isLoadingInitialData
      );

      // Skip zone updates during initial loading period to avoid logging current state as new events
      if (this.isLoadingInitialData) {
        console.log(
          'AuditLogService: Skipping zone update during initial loading period'
        );
        return;
      }

      // Update the last update time for this zone
      this.lastZoneUpdateTime.set(zoneId, now);

      // Check if this zone update represents a significant change worth logging
      const significantChange = this.isSignificantZoneChange(message.payload);

      if (!significantChange) {
        console.log(
          'AuditLogService: Skipping zone update - no significant change'
        );
        return;
      }

      // Use a consistent timestamp that won't change on refresh
      const eventTimestamp = new Date().toISOString();
      console.log(
        'AuditLogService: Creating zone-update log with timestamp:',
        eventTimestamp
      );

      // Convert zone-update to audit log entry
      const newLog: AuditLogEntry = {
        id: `zone-${message.payload.id}-${Date.now()}-${Math.random()}`,
        adminId: 'system', // Zone updates are typically system-generated
        action: 'zone-state-changed',
        targetType: 'zone',
        targetId: message.payload.id,
        timestamp: eventTimestamp,
        details: {
          occupied: message.payload.occupied,
          free: message.payload.free,
          availableForVisitors: message.payload.availableForVisitors,
          availableForSubscribers: message.payload.availableForSubscribers,
          open: message.payload.open,
        },
      };

      this.addLogEntry(newLog);
    }
  };

  private isSignificantZoneChange(zonePayload: any): boolean {
    // Only log zone changes if occupancy actually changed
    // This prevents logging every minor zone update
    const existingZoneLog = this.logs.find(
      (log) =>
        log.action === 'zone-state-changed' && log.targetId === zonePayload.id
    );

    if (!existingZoneLog) {
      return true; // First time seeing this zone
    }

    const existingOccupied = existingZoneLog.details?.occupied || 0;
    const newOccupied = zonePayload.occupied || 0;

    return existingOccupied !== newOccupied;
  }

  private addLogEntry(newLog: AuditLogEntry) {
    console.log('AuditLogService: Attempting to add log entry:', {
      id: newLog.id,
      action: newLog.action,
      targetId: newLog.targetId,
      timestamp: newLog.timestamp,
    });

    // Enhanced deduplication - check for content-based duplicates, not just time-based
    const isDuplicate = this.logs.some((existingLog) => {
      // For zone-state-changed, check if we already have a recent entry for this zone
      if (
        newLog.action === 'zone-state-changed' &&
        existingLog.action === 'zone-state-changed'
      ) {
        const sameZone = existingLog.targetId === newLog.targetId;
        const sameState =
          JSON.stringify(existingLog.details) ===
          JSON.stringify(newLog.details);

        if (sameZone && sameState) {
          console.log('AuditLogService: Found duplicate zone state:', {
            existing: existingLog.timestamp,
            new: newLog.timestamp,
            zone: newLog.targetId,
          });
          return true;
        }
        return false;
      }

      // For admin updates, use time-based deduplication
      if (newLog.action !== 'zone-state-changed') {
        return (
          existingLog.adminId === newLog.adminId &&
          existingLog.action === newLog.action &&
          existingLog.targetType === newLog.targetType &&
          existingLog.targetId === newLog.targetId &&
          Math.abs(
            new Date(existingLog.timestamp).getTime() -
              new Date(newLog.timestamp).getTime()
          ) < 5000 // within 5 seconds for admin actions
        );
      }

      return false;
    });

    if (isDuplicate) {
      console.log('AuditLogService: Ignoring duplicate/redundant message:', {
        action: newLog.action,
        targetId: newLog.targetId,
        timestamp: newLog.timestamp,
      });
      return;
    }

    console.log('AuditLogService: Adding new log entry:', newLog.action);

    // Add to logs and keep only last 100 entries
    this.logs = [newLog, ...this.logs].slice(0, 100);

    // Save to localStorage
    this.saveLogsToStorage();

    // Notify all listeners
    this.listeners.forEach((listener) => {
      listener([...this.logs]);
    });

    console.log('AuditLogService: Current logs count:', this.logs.length);
  }

  subscribe(callback: (logs: AuditLogEntry[]) => void): () => void {
    console.log('AuditLogService: New subscriber added');
    this.listeners.add(callback);

    // Send current logs immediately
    callback([...this.logs]);

    // Return unsubscribe function
    return () => {
      console.log('AuditLogService: Subscriber removed');
      this.listeners.delete(callback);
    };
  }

  getLogs(): AuditLogEntry[] {
    return [...this.logs];
  }

  clearLogs() {
    console.log('AuditLogService: Clearing logs');
    this.logs = [];
    this.saveLogsToStorage(); // Clear from localStorage too
    this.listeners.forEach((listener) => {
      listener([]);
    });
  }

  private loadLogsFromStorage() {
    try {
      console.log(
        'AuditLogService: Attempting to load logs from localStorage with key:',
        this.STORAGE_KEY
      );
      const stored = localStorage.getItem(this.STORAGE_KEY);
      console.log(
        'AuditLogService: Raw localStorage data length:',
        stored?.length
      );

      if (!stored) {
        console.log('AuditLogService: No stored logs found');
        return;
      }

      const data = JSON.parse(stored);
      console.log('AuditLogService: Parsed data structure:', {
        hasLogs: Array.isArray(data.logs),
        logsCount: data.logs?.length,
        timestamp: data.timestamp,
        sampleLogTimestamps: data.logs?.slice(0, 3).map((log: any) => ({
          id: log.id,
          timestamp: log.timestamp,
          action: log.action,
        })),
      });

      const now = Date.now();
      const expiryTime = this.STORAGE_EXPIRY_HOURS * 60 * 60 * 1000; // hours to milliseconds

      // Check if data has expired
      if (data.timestamp && now - data.timestamp > expiryTime) {
        console.log('AuditLogService: Stored logs expired, clearing');
        localStorage.removeItem(this.STORAGE_KEY);
        return;
      }

      if (Array.isArray(data.logs)) {
        console.log(
          'AuditLogService: About to load logs. Current logs count:',
          this.logs.length
        );
        console.log('AuditLogService: Data logs count:', data.logs.length);

        // Only load if we don't already have logs (prevent duplicates on multiple calls)
        if (this.logs.length === 0) {
          this.logs = [...data.logs]; // Create new array to avoid reference issues
          console.log(
            'AuditLogService: Successfully loaded',
            this.logs.length,
            'logs from storage'
          );
          console.log(
            'AuditLogService: First 3 loaded log timestamps:',
            this.logs.slice(0, 3).map((log) => ({
              id: log.id,
              timestamp: log.timestamp,
              action: log.action,
            }))
          );
        } else {
          console.warn(
            'AuditLogService: Skipping load - already have',
            this.logs.length,
            'logs in memory'
          );
        }
      } else {
        console.warn('AuditLogService: Data.logs is not an array:', data.logs);
      }
    } catch (error) {
      console.error(
        'AuditLogService: Failed to load logs from storage:',
        error
      );
      localStorage.removeItem(this.STORAGE_KEY); // Clear corrupted data
    }
  }

  private saveLogsToStorage() {
    try {
      const data = {
        logs: this.logs,
        timestamp: Date.now(),
      };
      console.log('AuditLogService: Saving logs to localStorage:', data);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
      console.log(
        'AuditLogService: Successfully saved to localStorage with key:',
        this.STORAGE_KEY
      );

      // Verify save worked
      const verify = localStorage.getItem(this.STORAGE_KEY);
      console.log(
        'AuditLogService: Verification - saved data length:',
        verify?.length
      );
    } catch (error) {
      console.error('AuditLogService: Failed to save logs to storage:', error);
    }
  }

  destroy() {
    console.log('AuditLogService: Destroying service');
    if (this.unsubscribe) {
      this.unsubscribe();
      this.unsubscribe = null;
    }
    this.listeners.clear();
    this.logs = [];
    this.lastZoneUpdateTime.clear();
    this.isInitialized = false;
    this.isLoadingInitialData = true; // Reset for next initialization
    this.subscribedGateIds = []; // Clear subscribed gates
  }
}

// Export singleton instance
export const auditLogService = AuditLogService.getInstance();
