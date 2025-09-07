# WeLink Cargo - Parking Reservation System 🚗

**A comprehensive full-stack parking reservation system developed for WeLink Cargo company hiring and training purposes.**

This is a complete **React + Express + WebSocket** implementation featuring real-time updates, animated gate interactions, comprehensive admin management, and production-ready business logic.

## 🎬 App Showcase

### Complete System Demo

_Full walkthrough of all features including gate operations, admin dashboard, and checkout flow_

[![Watch the demo](https://img.shields.io/badge/▶-Watch%20Demo-red)](https://vimeo.com/1116537145)

### User Workflows Demo

_Focused demonstration of visitor and subscriber flows with gate animations_

[![Watch the demo](https://img.shields.io/badge/▶-Watch%20Demo-red)](https://vimeo.com/1116537386)

---

## 🎯 Overview

WeLink Cargo's Parking Reservation System is a modern, feature-rich parking management solution that handles:

- **Gate Access Control** - Smart entry/exit with real-time zone availability
- **Visitor & Subscriber Management** - Dual-flow system for different user types
- **Employee Operations** - Secure checkout processing with plate verification
- **Admin Dashboard** - Complete control panel for system management
- **Real-time Updates** - WebSocket-powered live data synchronization
- **Animated Experience** - Engaging gate animations and modern UI

---

## ✨ Key Features

### 🚪 Gate Screen System

- **Dual User Flows**: Separate interfaces for visitors and subscribers
- **Real-time Zone Availability**: Live updates via WebSocket connections
- **Smart Zone Selection**: Category-based access control for subscribers
- **Animated Gate Experience**: Visual gate opening simulation upon successful check-in
- **Printable Tickets**: Professional ticket generation with all necessary details

### 🎫 Ticket Management

- **Instant Ticket Generation**: Immediate ticket creation upon check-in
- **Animated Gate Opening**: Car emoji moving through opening gate barrier
- **Professional Print Layout**: Clean, receipt-style ticket printing
- **QR-Ready Design**: Ticket ID prominently displayed for easy scanning

### 👨‍💼 Employee Checkout System

- **Secure Authentication**: Role-based access for employees and admins
- **Ticket Processing**: Scan/enter ticket IDs for checkout
- **Smart Rate Calculation**: Server-side breakdown of time-based parking fees
- **Plate Verification**: Compare subscriber vehicle plates with registration
- **Conversion Options**: Convert subscriber tickets to visitor rates when needed

### 🏢 Admin Management Dashboard

- **Real-time Parking Reports**: Live zone occupancy and availability monitoring
- **Category Rate Management**: Update parking rates for different zone categories
- **Rush Hours Configuration**: Set time-based special rate periods
- **Vacation Management**: Configure company vacation periods affecting rates
- **Employee Management**: Create and manage employee/admin accounts
- **Zone Control**: Open/close parking zones with bulk operations
- **Live Audit Log**: Real-time feed of all administrative actions

### 🎨 Bonus Features & Animations

#### 🎭 Gate Animation System

- **3-Phase Animation**: Closed → Opening → Open gate states
- **Car Movement**: Animated car emoji progressing through the gate
- **Visual Feedback**: Color-coded gate barrier (red → green)
- **Success Indicators**: Checkmarks and status messages
- **Realistic Timing**: 2-second gate opening sequence

#### 🎪 Modern UI Enhancements

- **Gradient Backgrounds**: Beautiful color transitions throughout the app
- **Hover Effects**: Interactive elements with smooth transitions
- **Loading States**: Elegant skeleton loading and spinners
- **Responsive Design**: Mobile-first design that works on all devices
- **Toast Notifications**: Real-time feedback for all user actions

---

## 🔄 User Flows

### 👤 Visitor Flow

1. **Gate Selection**: Choose from available gates on homepage
2. **Zone Selection**: Select any available parking zone
3. **Check-in**: Generate parking ticket instantly
4. **Gate Animation**: Watch the gate open virtually
5. **Print Ticket**: Get physical ticket for checkout

### 🎟️ Subscriber Flow

1. **Gate Selection**: Choose appropriate gate
2. **Subscription Verification**: Enter subscription ID for validation
3. **Category-based Zone Selection**: Only zones matching subscription category
4. **Priority Check-in**: Access to reserved slots
5. **Gate Animation**: Same engaging animation experience
6. **Print Ticket**: Subscription-linked ticket generation

### 💼 Employee Checkout Flow

1. **Authentication**: Secure login with employee credentials
2. **Ticket Lookup**: Enter/scan customer's ticket ID
3. **Rate Calculation**: Server-computed breakdown display
4. **Plate Verification**: (Subscribers only) Compare vehicle details
5. **Payment Processing**: Complete checkout with detailed receipt
6. **Conversion Option**: Convert subscriber to visitor rate if needed

### 🛠️ Admin Management Flow

1. **Admin Authentication**: Secure admin dashboard access
2. **System Overview**: Real-time parking state monitoring
3. **Rate Management**: Update category-based pricing
4. **Schedule Configuration**: Manage rush hours and vacation periods
5. **User Administration**: Create and manage employee accounts
6. **Zone Operations**: Bulk open/close operations
7. **Audit Monitoring**: Track all administrative changes

---

## 🏗️ Technical Architecture

### Frontend Stack

- **React 19** with TypeScript for type safety
- **React Router** for navigation management
- **RTK Query** for API state management and caching
- **Redux Toolkit** for global state management
- **Tailwind CSS** for utility-first styling
- **WebSocket** integration for real-time updates
- **React Hook Form** with Zod validation
- **React Hot Toast** for user notifications

### Backend Stack

- **Express.js** with comprehensive API endpoints
- **WebSocket** for real-time zone and admin updates
- **JWT Authentication** for secure access control
- **In-memory Database** with seeded test data
- **Business Logic Engine** for rate calculations and availability

### Real-time Features

- **WebSocket Connections**: Live zone availability updates
- **Admin Broadcasts**: Instant configuration change notifications
- **Automatic Reconnection**: Handles connection drops gracefully
- **Live Audit Trail**: Real-time administrative action logging

---

## Known Limitations

1. **Zone Management**: Zone open/close functionality is simplified in this version
2. **Subscription Management**: Admin subscription creation not fully implemented
3. **Offline Mode**: Limited offline capabilities (could be enhanced)
4. **Print Styling**: Basic print styles (could be enhanced with better layouts)

## 📁 Project Structure

```
 frontend/                  # React Frontend Application
   ├── src/
   │   ├── components/       # Reusable UI Components
   │   │   ├── admin/       # Admin Dashboard Components
   │   │   │   ├── category-rate/     # Category management
   │   │   │   ├── employee/          # Employee management
   │   │   │   ├── rush-hour/         # Rush hour configuration
   │   │   │   ├── vacation/          # Vacation management
   │   │   │   └── zone-management/   # Zone control operations
   │   │   ├── auth/        # Authentication forms
   │   │   ├── checkpoint/  # Employee checkout interface
   │   │   ├── gate/        # Gate screen components
   │   │   ├── home/        # Homepage sections
   │   │   ├── layout/      # Navigation & layout
   │   │   ├── shared/      # Shared utility components
   │   │   ├── ticket/      # Ticket generation & animation
   │   │   └── ui/          # Base UI components (buttons, cards, )
   │   │
   │   ├── pages/           # Route Components
   │   │   ├── Admin/       # Admin dashboard pages
   │   │   ├── CheckpointScreen.tsx   # Employee checkout
   │   │   ├── GateScreen.tsx         # Gate access interface
   │   │   ├── HomePage.tsx           # Landing page
   │   │   ├── Login.tsx              # Authentication
   │   │   └── Profile.tsx            # User profile
   │   │
   │   ├── api/             # API Integration Layer
   │   │   ├── cruds/       # RTK Query API definitions
   │   │   │   ├── auth/    # Authentication APIs
   │   │   │   ├── adminAPI.ts        # Admin operations
   │   │   │   ├── masterDataAPI.ts   # Gates, zones, categories
   │   │   │   ├── rushHourAPI.ts     # Rush hour management
   │   │   │   ├── subscriptionAPI.ts # Subscription handling
   │   │   │   ├── ticketAPI.ts       # Ticket operations
   │   │   │   └── vacationAPI.ts     # Vacation management
   │   │   ├── middleware/  # Custom fetch configuration
   │   │   └── store/       # Redux store setup
   │   │
   │   ├── services/        # External Services
   │   │   ├── websocket.ts # Real-time WebSocket integration
   │   │   └── auditLogService.ts # Admin action logging
   │   │
   │   ├── hooks/           # Custom React Hooks
   │   │   ├── useDebounce.ts         # Input debouncing
   │   │   ├── useDeleteConfirmation.ts # Deletion workflows
   │   │   ├── useMobile.tsx          # Mobile detection
   │   │   └── useZoneManagement.ts   # Zone operations
   │   │
   │   ├── types/           # TypeScript Definitions
   │   │   └── parking.ts   # Core domain types
   │   │
   │   ├── utils/           # Utility Functions
   │   │   ├── formatters.ts # Date/time formatting
   │   │   ├── schema.ts     # Validation schemas
   │   │   └── vacationUtils.ts # Vacation calculations
   │   │
   │   ├── state/           # Redux State Management
   │   │   └── auth.ts      # Authentication state
   │   │
   │   ├── routes/          # Routing Configuration
   │   │   ├── ProtectedRoute.tsx # Auth guards
   │   │   └── PublicRoutes/      # Public routing
   │   │
   │   └── layouts/         # Page Layouts
   │       └── RootLayout.tsx # Main app layout
   │
   ├── public/              # Static Assets
   │   └── parking.svg
   │
   ├── package.json         # Frontend dependencies
   ├── vite.config.ts       # Vite build configuration
   ├── tailwind.config.js   # Tailwind CSS configuration
   ├── tsconfig.json        # TypeScript configuration
   └── README.md            # Frontend documentation
```

### Key Directory Explanations

#### Frontend Architecture

- **`components/`**: Modular, reusable UI components organized by feature area
- **`pages/`**: Route-level components that compose multiple components
- **`api/cruds/`**: RTK Query API slice definitions for data fetching
- **`services/`**: External service integrations (WebSocket, logging)
- **`hooks/`**: Custom React hooks for shared logic
- **`types/`**: Centralized TypeScript type definitions
- **`utils/`**: Pure utility functions and helper methods

#### Design Patterns Used

- **Feature-based Organization**: Components grouped by functionality
- **API Layer Separation**: Clear separation between UI and data logic
- **Type Safety**: Comprehensive TypeScript coverage
- **Reusable Components**: UI components built for maximum reusability
- **Custom Hooks**: Shared logic extracted into reusable hooks

---

## 🔧 API Integration

### Core Endpoints (Implemented)

- `POST /api/v1/auth/login` - User authentication
- `GET /api/v1/master/gates` - Gate information
- `GET /api/v1/master/zones` - Zone data with real-time availability
- `POST /api/v1/tickets/checkin` - Ticket generation
- `POST /api/v1/tickets/checkout` - Payment processing
- `GET /api/v1/admin/reports/parking-state` - Real-time parking reports
- `PUT /api/v1/admin/categories/:id` - Category rate updates
- `PUT /api/v1/admin/zones/:id/open` - Zone control

### 🔍 Manual Endpoint Additions

_The following endpoints were added manually to the frontend as the backend server lacks them:_

#### ✅ Implemented in Frontend

- `GET /api/v1/admin/rush-hours` - Retrieve rush hour configurations
- `POST /api/v1/admin/rush-hours` - Create new rush hour periods
- `PUT /api/v1/admin/rush-hours/:id` - Update rush hour settings
- `DELETE /api/v1/admin/rush-hours/:id` - Remove rush hour periods

- `GET /api/v1/admin/vacations` - Retrieve vacation periods
- `POST /api/v1/admin/vacations` - Create vacation periods
- `PUT /api/v1/admin/vacations/:id` - Update vacation settings
- `DELETE /api/v1/admin/vacations/:id` - Remove vacation periods

- `GET /api/v1/admin/users` - Retrieve employee list
- `POST /api/v1/admin/users` - Create new employees

#### ⚠️ Still Missing from Backend

- `PUT /api/v1/admin/users/:id` - Update employee information
- `DELETE /api/v1/admin/users/:id` - Delete employee accounts

---

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- npm or pnpm package manager

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`

## 🎮 Usage Guide

### Gate Operations

1. Visit the homepage and select any available gate
2. Choose **Visitor** or **Subscriber** tab
3. For visitors: Select any available zone
4. For subscribers: Enter subscription ID, then select from allowed zones
5. Watch the gate animation as your ticket is processed
6. Print your ticket for checkout

### Employee Checkout

1. Navigate to `/checkpoint` or click "Staff Login" → "Checkpoint"
2. Login with employee credentials
3. Enter customer's ticket ID
4. Review the detailed rate breakdown
5. For subscribers: Verify vehicle plate matches registration
6. Process payment or convert to visitor rate if needed

### Admin Management

1. Access `/admin` and login with admin credentials
2. **Parking State**: Monitor real-time zone occupancy
3. **Control Panel**: Update rates, rush hours, and vacation periods
4. **Employees**: Create and manage staff accounts
5. **Audit Log**: Monitor live administrative actions

---

## 🎪 Animation Features Showcase

### Gate Opening Animation

- **Phase 1**: Gate barrier in closed position (red)
- **Phase 2**: Barrier rotating upward (orange/yellow)
- **Phase 3**: Fully open barrier (green) with success indicator
- **Car Movement**: Vehicle emoji smoothly driving through
- **Timing**: Realistic 2-3 second sequence

### UI Animations

- **Smooth Transitions**: All state changes animated
- **Hover Effects**: Interactive feedback on all clickable elements
- **Loading States**: Skeleton loaders and progress indicators
- **Toast Notifications**: Slide-in success/error messages
- **Gradient Animations**: Subtle background color shifts

---

## 🏆 Business Logic Highlights

### Server-Authoritative Design

- All calculations performed on backend
- Frontend displays server-provided values only
- No client-side business logic duplication

### Smart Availability Management

- Real-time reserved slot calculations
- Separate visitor/subscriber availability tracking
- Category-based access control for subscribers

### Flexible Rate System

- Time-based rate calculations (normal/special)
- Rush hour detection and application
- Vacation period rate adjustments
- Mixed-rate checkout breakdowns

---

### Backend Completion

- Complete user management endpoints (UPDATE/DELETE)
- Advanced reporting endpoints
- Automated backup and restore functionality
- Enhanced security features (rate limiting, etc.)

---

## 🤝 Contributing

This application was developed for **WeLink Cargo's** training and evaluation purposes. The system demonstrates:

- **Full-stack Development**: Complete frontend-backend integration
- **Real-time Architecture**: WebSocket-based live updates
- **Business Logic Implementation**: Complex parking management rules
- **Modern UI/UX**: Engaging animations and responsive design
- **Production Practices**: Type safety, error handling, and comprehensive testing

---

## 📄 License

Developed for WeLink Cargo company training and evaluation purposes.

---

**🎯 Ready for evaluation! This comprehensive parking system showcases modern web development practices with engaging user experiences and robust business logic implementation.**
