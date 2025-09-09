import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { DashboardPage } from '@/pages/DashboardPage';
import { InventoryPage } from '@/pages/InventoryPage';
import { Button } from '@/components/ui/button';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background app-bg">
        {/* Navigation */}
        <nav className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex h-16 items-center px-4 max-w-7xl mx-auto">
            <div className="flex items-center space-x-6">
              <h1 className="text-xl font-bold tracking-tight">Inventory Manager</h1>
              <div className="flex space-x-1 ml-4">
                <Link to="/dashboard" className="group">
                  <Button variant="ghost" className="transition-colors group-hover:text-foreground">Dashboard</Button>
                </Link>
                <Link to="/inventory" className="group">
                  <Button variant="ghost" className="transition-colors group-hover:text-foreground">Inventory</Button>
                </Link>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto py-6 px-4">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/inventory" element={<InventoryPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
