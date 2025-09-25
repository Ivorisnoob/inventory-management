import { useState, useEffect } from 'react';
import { Dashboard } from '@/components/Dashboard';
import type { InventoryStats } from '@/types/inventory';
import { fetchStats, fetchHistory, type HistoryEntry } from '@/lib/api';

export function DashboardPage() {
  const [stats, setStats] = useState<InventoryStats>({
    totalItems: 0,
    totalValue: 0,
    lowStockItems: 0,
    categories: 0,
  });
  const [loading, setLoading] = useState(true)
  const [recent, setRecent] = useState<HistoryEntry[]>([])

  useEffect(() => {
    (async () => {
      const s = await fetchStats()
      setStats(s)
      const h = await fetchHistory(5)
      setRecent(h)
      setLoading(false)
    })()
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
        <>
          <Dashboard stats={stats} />
          <div>
            <h2 className="text-xl font-semibold mt-8 mb-2">Recent Activity</h2>
            {recent.length === 0 ? (
              <p className="text-sm text-muted-foreground">No recent activity.</p>
            ) : (
              <ul className="text-sm divide-y">
                {recent.map((e) => (
                  <li key={e.id} className="py-2 flex items-center justify-between">
                    <span className="truncate mr-4">{e.description || e.type}</span>
                    <span className="text-muted-foreground">{e.at.toLocaleString()}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}
    </div>
  );
}
