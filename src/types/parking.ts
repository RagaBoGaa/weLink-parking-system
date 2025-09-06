// Parking System Types based on API Documentation

export interface User {
  id: string;
  username: string;
  role: 'admin' | 'employee';
  name?: string;
  email?: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  rateNormal: number;
  rateSpecial: number;
}

export interface Zone {
  zoneId: string;
  id: string;
  name: string;
  categoryId: string;
  gateIds: string[];
  totalSlots: number;
  occupied: number; // server computed
  free: number; // server computed
  reserved: number; // server computed
  availableForVisitors: number; // server computed
  availableForSubscribers: number; // server computed
  rateNormal: number;
  rateSpecial: number;
  open: boolean;
  subscriberCount?: number; // for admin reports
}

export interface Gate {
  id: string;
  name: string;
  zoneIds: string[];
  location: string;
}

export interface Car {
  plate: string;
  brand: string;
  model: string;
  color: string;
}

export interface Subscription {
  id: string;
  userName: string;
  active: boolean;
  category: string;
  cars: Car[];
  startsAt: string;
  expiresAt: string;
  currentCheckins: CurrentCheckin[];
}

export interface CurrentCheckin {
  ticketId: string;
  zoneId: string;
  checkinAt: string;
}

export interface Ticket {
  id: string;
  type: 'visitor' | 'subscriber';
  zoneId: string;
  gateId: string;
  checkinAt: string;
  checkoutAt?: string;
  subscriptionId?: string;
}

export interface CheckoutBreakdown {
  from: string;
  to: string;
  hours: number;
  rateMode: 'normal' | 'special';
  rate: number;
  amount: number;
}

export interface CheckoutResponse {
  ticketId: string;
  checkinAt: string;
  checkoutAt: string;
  durationHours: number;
  breakdown: CheckoutBreakdown[];
  amount: number;
  zoneState: Zone;
}

export interface CheckinRequest {
  gateId: string;
  zoneId: string;
  type: 'visitor' | 'subscriber';
  subscriptionId?: string;
}

export interface CheckinResponse {
  ticket: Ticket;
  zoneState: Zone;
}

export interface CheckoutRequest {
  ticketId: string;
  forceConvertToVisitor?: boolean;
}

export interface RushHour {
  id: string;
  weekDay: number; // 0-6, Sunday = 0
  from: string; // HH:mm format
  to: string; // HH:mm format
}

export interface Vacation {
  id: string;
  name: string;
  from: string; // YYYY-MM-DD format
  to: string; // YYYY-MM-DD format
}

// WebSocket message types
export interface WSSubscribeMessage {
  type: 'subscribe' | 'unsubscribe';
  payload: {
    gateId: string;
  };
}

export interface WSZoneUpdateMessage {
  type: 'zone-update';
  payload: Zone & {
    specialActive?: boolean; // indicates if special rate is currently active
  };
}

export interface WSAdminUpdateMessage {
  type: 'admin-update';
  payload: {
    adminId: string;
    action:
      | 'category-rates-changed'
      | 'zone-closed'
      | 'zone-opened'
      | 'vacation-added'
      | 'rush-updated'
      | 'user-added'
      | 'zone-state-changed';
    targetType: 'category' | 'zone' | 'vacation' | 'rush' | 'user';
    targetId: string;
    details?: any;
    timestamp: string;
  };
}

export type WSMessage = WSZoneUpdateMessage | WSAdminUpdateMessage;

// Auth types - API returns user and token directly
export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}

// Admin report types - API returns zones array directly
export interface ParkingStateReport {
  zones: Zone[];
}
