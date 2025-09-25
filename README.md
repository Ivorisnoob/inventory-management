# Inventory Management System

A modern, responsive inventory management system built with React, TypeScript, Shadcn/UI, and a local SQLite-backed API server.

## Features

- **Dashboard Overview**: Get insights into your inventory with key metrics
  - Total items count
  - Total inventory value
  - Low stock alerts
  - Category summary

- **Inventory Management**: Full CRUD operations for inventory items
  - Add new items with detailed information
  - Edit existing items
  - Delete items with confirmation
  - Visual low stock indicators

- **Responsive Design**: Built with Tailwind CSS and Shadcn/UI for a modern, mobile-friendly interface

## Tech Stack

- **React 19** with TypeScript
- **Vite 7** for fast development and building
- **Tailwind CSS 4** for styling
- **Shadcn/UI** for accessible components
- **React Router** for navigation
- **Express + better-sqlite3** for a local SQLite API

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development servers (frontend + API):
   ```bash
   npm start
   ```

3. Open [http://localhost:5173](http://localhost:5173) to view the application. The API runs on `http://localhost:8787` and stores data in a local SQLite file at `server/inventory.db` (auto-created and git-ignored).

Optional: configure a custom API base for the client by setting `VITE_API_BASE` (defaults to `http://localhost:8787`).

### Available Scripts

- `npm start` - Start both frontend and API servers
- `npm run dev` - Same as `npm start`
- `npm run dev:client` - Start just the frontend (Vite)
- `npm run dev:server` - Start just the API server (Express + SQLite)
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── components/
│   ├── ui/           # Shadcn/UI components
│   ├── Dashboard.tsx # Dashboard statistics display
│   ├── ItemList.tsx  # Inventory items grid display
│   └── ItemForm.tsx  # Add/edit item form
├── pages/
│   ├── DashboardPage.tsx # Dashboard page
│   └── InventoryPage.tsx # Inventory management page
├── types/
│   └── inventory.ts  # TypeScript type definitions
├── lib/
│   ├── api.ts        # API client for the Express + SQLite server
│   └── utils.ts      # Utility functions
└── App.tsx           # Main app component with routing
server/
├── index.ts          # Express + SQLite API server
└── inventory.db      # Local SQLite database (auto-created, git-ignored)
```

## Data & API

- Data is persisted locally in `server/inventory.db` using SQLite.
- Core endpoints:
  - `GET /api/items` - list items
  - `POST /api/items` - create item
  - `GET /api/items/:id` - get item
  - `PUT /api/items/:id` - update item
  - `DELETE /api/items/:id` - delete item
  - `POST /api/items/:id/adjust` - adjust quantity by a delta
  - `GET /api/stats` - dashboard stats

## Future Enhancements

- [ ] Search and filter functionality
- [ ] Export/import capabilities
- [ ] User authentication
- [ ] Multi-location inventory tracking
- [ ] Barcode scanning support
- [ ] Inventory history and reporting

## Security & Open Source Notes

- No secrets are committed. Local SQLite files are git-ignored.
- Environment variables can be used for client configuration via `VITE_*` (e.g., `VITE_API_BASE`).
- See `LICENSE`, `CONTRIBUTING.md`, and `CODE_OF_CONDUCT.md` for open-source policies.

## Contributing

See `CONTRIBUTING.md` and follow the Code of Conduct in `CODE_OF_CONDUCT.md`.

## License

This project is open source and available under the [MIT License](LICENSE).
