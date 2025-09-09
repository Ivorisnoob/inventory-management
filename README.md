# Inventory Management System

A modern, responsive inventory management system built with React, TypeScript, and Shadcn/UI.

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

- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Shadcn/UI** for beautiful, accessible components
- **React Router** for navigation

## Getting Started

### Prerequisites

- Node.js 16 or higher
- npm or yarn

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:5173](http://localhost:5173) to view the application

### Available Scripts

- `npm run dev` - Start development server
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
│   └── utils.ts      # Utility functions
└── App.tsx           # Main app component with routing
```

## Demo Data

The application includes mock data for demonstration purposes:
- Sample inventory items with various categories
- Realistic pricing and stock levels
- Low stock examples to showcase alerts

## Future Enhancements

- [ ] Search and filter functionality
- [ ] Data persistence (database integration)
- [ ] Export/import capabilities
- [ ] User authentication
- [ ] Multi-location inventory tracking
- [ ] Barcode scanning support
- [ ] Inventory history and reporting

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).
