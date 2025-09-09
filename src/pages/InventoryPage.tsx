import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ItemList } from '@/components/ItemList';
import { ItemForm } from '@/components/ItemForm';
import type { InventoryItem, CreateItemData } from '@/types/inventory';

// Mock data for demo - same as in DashboardPage
const initialMockItems: InventoryItem[] = [
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

export function InventoryPage() {
  const [items, setItems] = useState<InventoryItem[]>(initialMockItems);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | undefined>();

  const handleAddItem = (data: CreateItemData) => {
    const newItem: InventoryItem = {
      ...data,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setItems(prev => [...prev, newItem]);
    setShowForm(false);
  };

  const handleEditItem = (data: CreateItemData) => {
    if (!editingItem) return;
    
    const updatedItem: InventoryItem = {
      ...editingItem,
      ...data,
      updatedAt: new Date(),
    };
    
    setItems(prev => prev.map(item => 
      item.id === editingItem.id ? updatedItem : item
    ));
    setEditingItem(undefined);
    setShowForm(false);
  };

  const handleDeleteItem = (id: string) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      setItems(prev => prev.filter(item => item.id !== id));
    }
  };

  const handleAdjustQuantity = (id: string, delta: number) => {
    setItems(prev => prev.map(item => {
      if (item.id !== id) return item
      const quantity = Math.max(0, item.quantity + delta)
      return { ...item, quantity, updatedAt: new Date() }
    }))
  };

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
      <ItemList
        items={items}
        onEdit={handleEdit}
        onDelete={handleDeleteItem}
        onAdjustQuantity={handleAdjustQuantity}
      />
    </div>
  );
}
