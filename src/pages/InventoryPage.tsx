import { useEffect, useMemo, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ItemList } from '@/components/ItemList';
import { ItemForm } from '@/components/ItemForm';
import type { InventoryItem, CreateItemData } from '@/types/inventory';
import { fetchItems, createItem, updateItem, deleteItem, adjustQuantity } from '@/lib/api';


export function InventoryPage() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | undefined>();
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('')

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchItems()
        setItems(data)
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const categories = useMemo(() => Array.from(new Set(items.map(i => i.category))).sort(), [items])
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return items.filter(i => {
      const matchesQuery = !q || [i.name, i.sku, i.category, i.description || ''].some(v => v.toLowerCase().includes(q))
      const matchesCat = !categoryFilter || i.category === categoryFilter
      return matchesQuery && matchesCat
    })
  }, [items, query, categoryFilter])

  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleExportCSV = () => {
    const header = ['id','name','description','quantity','price','category','sku','lowStockThreshold','createdAt','updatedAt']
    const rows = items.map(i => [i.id, i.name, i.description ?? '', i.quantity, i.price, i.category, i.sku, i.lowStockThreshold, i.createdAt.toISOString(), i.updatedAt.toISOString()])
    const csv = [header.join(','), ...rows.map(r => r.map(v => typeof v === 'string' && v.includes(',') ? `"${v.replace(/"/g, '""')}"` : String(v)).join(','))].join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'inventory_export.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleImportCSV = async (file: File) => {
    const text = await file.text()
    const lines = text.split(/\r?\n/).filter(Boolean)
    if (lines.length <= 1) return
    const header = lines[0].split(',')
    const idx = (name: string) => header.indexOf(name)
    for (let i = 1; i < lines.length; i++) {
      const cols = lines[i].match(/\"([^\"]*)\"|[^,]+/g)?.map(c => c.replace(/^\"|\"$/g, '')) || []
      const data: CreateItemData = {
        name: cols[idx('name')] || '',
        description: cols[idx('description')] || '',
        quantity: Number(cols[idx('quantity')] || 0),
        price: Number(cols[idx('price')] || 0),
        category: cols[idx('category')] || '',
        sku: cols[idx('sku')] || '',
        lowStockThreshold: Number(cols[idx('lowStockThreshold')] || 5),
      }
      if (!data.name || !data.category || !data.sku) continue
      try {
        const created = await createItem(data)
        setItems(prev => [...prev, created])
      } catch {}
    }
  }

  const handleAddItem = async (data: CreateItemData) => {
    const created = await createItem(data)
    setItems(prev => [...prev, created])
    setShowForm(false)
  }

  const handleEditItem = async (data: CreateItemData) => {
    if (!editingItem) return
    const updated = await updateItem(editingItem.id, data)
    setItems(prev => prev.map(item => item.id === editingItem.id ? updated : item))
    setEditingItem(undefined)
    setShowForm(false)
  }

  const handleDeleteItem = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return
    await deleteItem(id)
    setItems(prev => prev.filter(item => item.id !== id))
  }

  const handleAdjustQuantity = async (id: string, delta: number) => {
    const updated = await adjustQuantity(id, delta)
    setItems(prev => prev.map(item => item.id === id ? updated : item))
  }

  const handleEdit = (item: InventoryItem) => {
    setEditingItem(item);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingItem(undefined);
  };

  if (showForm) {
    return (
      <div className="space-y-8 fade-in-up">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {editingItem ? 'Edit Item' : 'Add New Item'}
          </h1>
        </div>
        <ItemForm
          item={editingItem}
          onSubmit={editingItem ? handleEditItem : handleAddItem}
          onCancel={handleCancel}
        />
      </div>
    );
  }

  return (
    <div className="space-y-8 fade-in-up">
      <div className="flex justify-between items-center gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Inventory</h1>
          <p className="text-muted-foreground">
            Manage your inventory items and stock levels
          </p>
        </div>
        <div className="flex items-center gap-2">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name, SKU, category"
            className="h-9 w-56 rounded-md border border-input bg-background px-3 text-sm"
          />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="h-9 rounded-md border border-input bg-background px-2 text-sm"
          >
            <option value="">All categories</option>
            {categories.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <Button onClick={() => setShowForm(true)}>Add Item</Button>
          <Button variant="outline" onClick={handleExportCSV}>Export CSV</Button>
          <input ref={fileInputRef} type="file" accept=".csv" className="hidden" onChange={(e) => {
            const f = e.target.files?.[0]
            if (f) void handleImportCSV(f)
            e.currentTarget.value = ''
          }} />
          <Button variant="outline" onClick={() => fileInputRef.current?.click()}>Import CSV</Button>
        </div>
      </div>
      {loading ? (
        <div className="text-sm text-muted-foreground">Loading items…</div>
      ) : (
        <ItemList
          items={filtered}
          onEdit={handleEdit}
          onDelete={handleDeleteItem}
          onAdjustQuantity={handleAdjustQuantity}
        />
      )}
    </div>
  );
}
