import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { InventoryItem } from '@/types/inventory';
import { useState } from 'react';

interface ItemListProps {
  items: InventoryItem[];
  onEdit?: (item: InventoryItem) => void;
  onDelete?: (id: string) => void;
  onAdjustQuantity?: (id: string, delta: number) => void;
}

export function ItemList({ items, onEdit, onDelete, onAdjustQuantity }: ItemListProps) {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  if (items.length === 0) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="text-center">
            <p className="text-muted-foreground">No items in inventory</p>
            <p className="text-sm text-muted-foreground mt-2">
              Start by adding your first inventory item
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const [bubbles, setBubbles] = useState<Record<string, { key: number; delta: number } | undefined>>({})

  const triggerBubble = (id: string, delta: number) => {
    const key = Date.now()
    setBubbles((prev) => ({ ...prev, [id]: { key, delta } }))
    setTimeout(() => {
      setBubbles((prev) => ({ ...prev, [id]: undefined }))
    }, 800)
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {items.map((item, idx) => (
        <Card
          key={item.id}
          className={`relative transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 ${item.quantity <= item.lowStockThreshold ? 'border-yellow-400 ring-1 ring-yellow-200/30' : 'border-border'} fade-in-up`}
          style={{ animationDelay: `${idx * 60}ms` }}
        >
          {/* Rising +/- bubble */}
          {bubbles[item.id] && (
            <span
              key={bubbles[item.id]!.key}
              className={`pointer-events-none absolute right-4 top-2 text-xs font-semibold ${bubbles[item.id]!.delta > 0 ? 'text-green-600' : 'text-red-600'} rise-bubble`}
            >
              {bubbles[item.id]!.delta > 0 ? `+${bubbles[item.id]!.delta}` : `${bubbles[item.id]!.delta}`}
            </span>
          )}

          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg">{item.name}</CardTitle>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-muted-foreground">SKU:</span>
                  <span className="text-xs font-mono text-muted-foreground/80">{item.sku}</span>
                </div>
              </div>
              <div className="flex space-x-2">
                {onEdit && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(item)}
                  >
                    Edit
                  </Button>
                )}
                {onDelete && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => onDelete(item.id)}
                  >
                    Delete
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {item.description && (
                <p className="text-sm text-muted-foreground">{item.description}</p>
              )}
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Category:</span>
                <span className="text-sm"><span className="inline-flex items-center rounded-full border border-input bg-secondary/60 text-secondary-foreground px-2 py-0.5 text-xs">{item.category}</span></span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Quantity:</span>
                <div className="flex items-center gap-2">
                  <span className={`text-sm tabular-nums ${item.quantity <= item.lowStockThreshold ? 'text-yellow-600 font-bold' : ''}`}>
                    {item.quantity}
                  </span>
                  <div className="inline-flex rounded-md border border-input overflow-hidden shadow-sm">
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 rounded-none hover:bg-red-50 hover:text-red-700"
                      onClick={() => {
                        if (!onAdjustQuantity) return
                        const delta = -1
                        onAdjustQuantity(item.id, delta)
                        triggerBubble(item.id, delta)
                      }}
                    >
                      −
                    </Button>
                    <div className="w-px bg-border/60" />
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 rounded-none hover:bg-green-50 hover:text-green-700"
                      onClick={() => {
                        if (!onAdjustQuantity) return
                        const delta = 1
                        onAdjustQuantity(item.id, delta)
                        triggerBubble(item.id, delta)
                      }}
                    >
                      +
                    </Button>
                  </div>
                </div>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Price:</span>
                <span className="text-sm">${item.price.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Total Value:</span>
                <span className="text-sm font-bold">${(item.quantity * item.price).toFixed(2)}</span>
              </div>
              <div className="pt-2 border-t text-xs text-muted-foreground flex justify-between items-center">
                <p>Updated: {formatDate(item.updatedAt)}</p>
                {item.quantity <= item.lowStockThreshold ? (
                  <span className="text-yellow-800">Low stock</span>
                ) : (
                  <span className="text-foreground/50">In stock</span>
                )}
              </div>
              {item.quantity <= item.lowStockThreshold && (
                <div className="bg-yellow-50 border border-yellow-200 rounded p-2 pulse-subtle">
                  <p className="text-xs text-yellow-800">⚠️ Low stock alert</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
