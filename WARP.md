# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

An inventory management system built with React 19, TypeScript, Vite, and Shadcn/UI components. The application provides a dashboard for inventory analytics and a full CRUD interface for managing inventory items.

## Essential Commands

### Development
- **Start development server**: `npm run dev` (serves on http://localhost:5173)
- **Build for production**: `npm run build`
- **Preview production build**: `npm run preview`
- **Run linter**: `npm run lint`
- **Install dependencies**: `npm install`

### Testing & Debugging
- **Type checking**: `npx tsc --noEmit` (verify TypeScript compilation without building)
- **Check for unused dependencies**: `npx depcheck`

### Known Issues & Fixes
- **TailwindCSS PostCSS Error**: If you encounter the PostCSS plugin error, install the correct TailwindCSS PostCSS plugin:
  ```bash
  npm install @tailwindcss/postcss
  ```
  Then update `postcss.config.js` to use `'@tailwindcss/postcss'` instead of `'tailwindcss'`.

## Architecture

### Tech Stack
- **Frontend**: React 19 with TypeScript
- **Build Tool**: Vite with React plugin
- **Styling**: TailwindCSS v4 with Shadcn/UI components
- **Routing**: React Router v7
- **State Management**: Local React state (useState)
- **Data**: Mock data (no backend persistence currently)

### Project Structure
```
src/
├── components/
│   ├── ui/              # Shadcn/UI base components (Button, Card, Input)
│   ├── Dashboard.tsx    # Dashboard statistics component
│   ├── ItemList.tsx     # Inventory items grid/list display
│   └── ItemForm.tsx     # Add/edit item form component
├── pages/
│   ├── DashboardPage.tsx    # Dashboard route with analytics
│   └── InventoryPage.tsx    # Inventory management route
├── types/
│   └── inventory.ts     # TypeScript interfaces for InventoryItem, InventoryStats
├── lib/
│   └── utils.ts         # Utility functions (cn for className merging)
├── App.tsx              # Main app with React Router setup
└── main.tsx            # React app entry point
```

### Key Design Patterns

#### Component Architecture
- **Page Components**: Handle routing, state management, and data flow
- **Feature Components**: Business logic components (Dashboard, ItemList, ItemForm)
- **UI Components**: Reusable Shadcn/UI primitives in `/ui` folder
- **Type Safety**: All components use TypeScript interfaces from `types/inventory.ts`

#### State Management
- Local component state using `useState` hooks
- No global state management (Redux, Zustand, etc.) - suitable for current scope
- Mock data initialized in page components, shared between Dashboard and Inventory pages

#### Styling Approach
- **TailwindCSS v4** with custom design tokens defined in `tailwind.config.js`
- **Shadcn/UI** component library for consistent, accessible UI primitives
- **CSS Variables**: Uses HSL color variables for theming (--primary, --background, etc.)
- **Responsive Design**: Built mobile-first with Tailwind responsive utilities

### Data Flow
1. **Mock Data**: Hardcoded inventory items in page components
2. **CRUD Operations**: All operations update local state only (no persistence)
3. **Analytics**: Dashboard calculates statistics from inventory items in real-time
4. **Navigation**: React Router handles client-side routing between Dashboard and Inventory pages

## Component Usage Guidelines

### Adding New Shadcn/UI Components
When adding new Shadcn/UI components, they should be placed in `src/components/ui/` and follow the existing pattern:
- Use `cn()` utility for conditional classes
- Export as named export
- Include proper TypeScript props interface
- Use CSS variables for theming

### Working with Inventory Data
- All inventory operations should use the `InventoryItem` interface from `types/inventory.ts`
- Mock data follows consistent structure with realistic sample data
- Form validation should be added for production use
- Consider adding proper error handling for CRUD operations

### Path Aliases
- Use `@/` alias for imports from `src/` directory (configured in `vite.config.ts`)
- Example: `import { Button } from '@/components/ui/button'`

## Development Notes

### Current Limitations
- **No Data Persistence**: All changes are lost on page refresh
- **No Search/Filter**: Inventory list shows all items without filtering
- **No Authentication**: No user management or access control
- **Mock Data Only**: No backend API integration

### Future Integration Points
The codebase is structured to easily add:
- Backend API integration (replace mock data with API calls)
- Database persistence layer
- Search and filtering functionality
- User authentication system
- Real-time updates via WebSocket
- Export/import capabilities

### Code Style
- **ESLint Configuration**: Uses modern flat config with React hooks and TypeScript rules
- **TypeScript**: Strict mode enabled with separate configs for app and Node.js
- **Import Style**: Prefer named imports, use path aliases for internal modules
- **Component Structure**: Functional components with hooks, proper TypeScript interfaces
