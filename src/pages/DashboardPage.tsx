import { useState, useEffect } from 'react';
import { Dashboard } from '@/components/Dashboard';
import type { InventoryStats, InventoryItem } from '@/types/inventory';

// Mock data for demo
const mockItems: InventoryItem[] = [
  {
    id: '1',
    name: 'Laptop',
    description: 'High-performance laptop for business use',
    quantity: 25,
    price: 1299.99,
    category: 'Electronics',
    sku: 'LAP-001',
    lowStockThreshold: 5,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    name: 'Office Chair',
    description: 'Ergonomic office chair with lumbar support',
    quantity: 3,
    price: 299.99,
    category: 'Furniture',
    sku: 'CHR-001',
    lowStockThreshold: 5,
    createdAt: new Date('2024-01-02'),
    updatedAt: new Date('2024-01-14'),
  },
  {
    id: '3',
    name: 'Desk Lamp',
    description: 'LED desk lamp with adjustable brightness',
    quantity: 15,
    price: 49.99,
    category: 'Office Supplies',
    sku: 'LMP-001',
    lowStockThreshold: 10,
    createdAt: new Date('2024-01-03'),
    updatedAt: new Date('2024-01-13'),
  },
];

export function DashboardPage() {
  const [stats, setStats] = useState<InventoryStats>({
    totalItems: 0,
    totalValue: 0,
    lowStockItems: 0,
    categories: 0,
  });
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate compute/loading for a nicer skeleton effect
    const timer = setTimeout(() => {
      const totalItems = mockItems.reduce((sum, item) => sum + item.quantity, 0);
      const totalValue = mockItems.reduce((sum, item) => sum + (item.quantity * item.price), 0);
      const lowStockItems = mockItems.filter(item => item.quantity <= item.lowStockThreshold).length;
      const categories = new Set(mockItems.map(item => item.category)).size;

      setStats({ totalItems, totalValue, lowStockItems, categories });
      setLoading(false)
    }, 300)

    return () => clearTimeout(timer)
  }, []);

  return (
    <div className="space-y-8 fade-in-up">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your inventory management system
        </p>
      </div>
      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-2">
            <div className="rounded-lg border p-6">
              <div className="flex justify-between pb-2">
                <div className="h-4 w-24 bg-foreground/10 rounded" />
                <div className="h-4 w-4 bg-foreground/10 rounded" />
              </div>
              <div className="h-7 w-16 bg-foreground/10 rounded" />
              <div className="mt-2 h-3 w-24 bg-foreground/10 rounded" />
            </div>
          </div>
          <div className="space-y-2">
            <div className="rounded-lg border p-6">
              <div className="flex justify-between pb-2">
                <div className="h-4 w-24 bg-foreground/10 rounded" />
                <div className="h-4 w-4 bg-foreground/10 rounded" />
              </div>
              <div className="h-7 w-24 bg-foreground/10 rounded" />
              <div className="mt-2 h-3 w-28 bg-foreground/10 rounded" />
            </div>
          </div>
          <div className="space-y-2 hidden md:block">
            <div className="rounded-lg border p-6">
              <div className="flex justify-between pb-2">
                <div className="h-4 w-24 bg-foreground/10 rounded" />
                <div className="h-4 w-4 bg-foreground/10 rounded" />
              </div>
              <div className="h-7 w-16 bg-foreground/10 rounded" />
              <div className="mt-2 h-3 w-24 bg-foreground/10 rounded" />
            </div>
          </div>
          <div className="space-y-2 hidden lg:block">
            <div className="rounded-lg border p-6">
              <div className="flex justify-between pb-2">
                <div className="h-4 w-24 bg-foreground/10 rounded" />
                <div className="h-4 w-4 bg-foreground/10 rounded" />
              </div>
              <div className="h-7 w-10 bg-foreground/10 rounded" />
              <div className="mt-2 h-3 w-20 bg-foreground/10 rounded" />
            </div>
          </div>
        </div>
      ) : (
        <Dashboard stats={stats} />
      )}
    </div>
  );
}
