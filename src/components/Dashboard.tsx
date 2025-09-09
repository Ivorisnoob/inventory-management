import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { InventoryStats } from '@/types/inventory';
import { useEffect, useState } from 'react';

interface DashboardProps {
  stats: InventoryStats;
}

function CountUp({ value, duration = 800, decimals = 0 }: { value: number; duration?: number; decimals?: number }) {
  const [display, setDisplay] = useState(0)
  useEffect(() => {
    const start = performance.now()
    const step = (now: number) => {
      const p = Math.min(1, (now - start) / duration)
      const current = value * p
      setDisplay(current)
      if (p < 1) requestAnimationFrame(step)
    }
    const raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [value, duration])
  return <span>{display.toFixed(decimals)}</span>
}

export function Dashboard({ stats }: DashboardProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 group">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Items</CardTitle>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="h-4 w-4 text-muted-foreground transition-transform group-hover:rotate-6"
          >
            <path d="M3 3h18v18H3zM9 9h6v6H9z" />
          </svg>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold"><CountUp value={stats.totalItems} /></div>
          <p className="text-xs text-muted-foreground">items in inventory</p>
        </CardContent>
      </Card>
      
      <Card className="transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 group">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Value</CardTitle>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="h-4 w-4 text-muted-foreground"
          >
            <path d="M12 2v20m9-9H3" />
          </svg>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">$<CountUp value={stats.totalValue} decimals={2} /></div>
          <p className="text-xs text-muted-foreground">total inventory value</p>
        </CardContent>
      </Card>
      
      <Card className="transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 group">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="h-4 w-4 text-muted-foreground"
          >
            <path d="M12 9v3m0 3h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold"><CountUp value={stats.lowStockItems} /></div>
          <p className="text-xs text-muted-foreground">items need restocking</p>
        </CardContent>
      </Card>
      
      <Card className="transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 group">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Categories</CardTitle>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="h-4 w-4 text-muted-foreground"
          >
            <rect width="7" height="9" x="3" y="3" rx="1" />
            <rect width="7" height="5" x="14" y="3" rx="1" />
            <rect width="7" height="9" x="14" y="12" rx="1" />
            <rect width="7" height="5" x="3" y="16" rx="1" />
          </svg>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold"><CountUp value={stats.categories} /></div>
          <p className="text-xs text-muted-foreground">product categories</p>
        </CardContent>
      </Card>
    </div>
  );
}
