import { useEffect, useState } from 'react';
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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Inventory</h1>
          <p className="text-muted-foreground">
            Manage your inventory items and stock levels
          </p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          Add Item
        </Button>
      </div>
      {loading ? (
        <div className="text-sm text-muted-foreground">Loading items…</div>
      ) : (
        <ItemList
          items={items}
          onEdit={handleEdit}
          onDelete={handleDeleteItem}
          onAdjustQuantity={handleAdjustQuantity}
        />
      )}
    </div>
  );
}
