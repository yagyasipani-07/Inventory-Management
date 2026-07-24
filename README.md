# Paras Plywoods ERP

An enterprise-grade, modern ERP system for warehouse and dispatch management, built specifically for the needs of Paras Plywoods.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript (Strict Mode)
- **Styling**: Tailwind CSS, shadcn/ui
- **State Management**: Zustand (Global), TanStack Query (Server State), nuqs (URL State)
- **Forms**: React Hook Form + Zod
- **Icons**: Lucide React
- **Charts**: Recharts

## Architecture

This application is built with a modular architecture within the Next.js App Router paradigm. 

### Key Modules

1. **Dashboard**: High-level KPI overview, stock trends, and recent activity.
2. **Inventory**: Comprehensive product catalog and stock level management.
3. **Warehouse**: Live stock visibility and location tracking.
4. **Customers**: Lightweight directory of dispatch destinations.
5. **Challans**: The core workflow engine for creating and printing dispatch challans.
6. **Import/Export**: Bulk data management with validation.
7. **Audit**: System-wide activity tracking and traceability.
8. **Settings**: Centralized configuration management.

### Folder Structure

```
src/
├── app/
│   ├── (dashboard)/         # Main authenticated layout group
│   │   ├── audit/           # Audit Logs module
│   │   ├── challans/        # Dispatch Challans module
│   │   ├── customers/       # Customer Management module
│   │   ├── dashboard/       # Dashboard module
│   │   ├── export/          # Export Center module
│   │   ├── import/          # Import Center module
│   │   ├── inventory/       # Inventory module
│   │   ├── settings/        # Settings & Admin module
│   │   └── warehouse/       # Warehouse Stock module
│   ├── (print)/             # Dedicated layouts for printing
│   ├── api/                 # Next.js API Routes (BFF layer)
│   ├── error.tsx            # Global error boundary
│   └── not-found.tsx        # Global 404 page
├── components/
│   ├── shared/              # Reusable complex components (PageHeader, EmptyState, etc.)
│   └── ui/                  # shadcn/ui base components
└── lib/                     # Utility functions and configurations
```

## Getting Started

### Prerequisites
- Node.js (v20+ recommended)
- npm or pnpm

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install --legacy-peer-deps
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Build for production:
   ```bash
   npm run build
   npm start
   ```

## Development Guidelines

- **Component Colocation**: Features should encapsulate their own `_components`, `_hooks`, and `_services` folders. Do not leak feature-specific code into global scopes.
- **State Management**: Use `TanStack Query` for all server data. Use `Zustand` ONLY for pure client-side UI state that needs to be shared across disparate components.
- **URL State**: Use `nuqs` (Next Use Query State) for pagination, filtering, and tab selection to ensure shareable URLs.
- **Strict Typing**: No `any`. Always define proper interfaces or infer them from Zod schemas.

## License

Proprietary - Paras Plywoods
