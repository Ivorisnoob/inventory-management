import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { CreateItemData, InventoryItem } from '@/types/inventory';

interface ItemFormProps {
  item?: InventoryItem;
  onSubmit: (data: CreateItemData) => void;
  onCancel: () => void;
}

export function ItemForm({ item, onSubmit, onCancel }: ItemFormProps) {
  const [formData, setFormData] = useState<CreateItemData>({
    name: item?.name || '',
    description: item?.description || '',
    quantity: item?.quantity || 0,
    price: item?.price || 0,
    category: item?.category || '',
    sku: item?.sku || '',
    lowStockThreshold: item?.lowStockThreshold || 5,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'quantity' || name === 'price' || name === 'lowStockThreshold'
        ? parseFloat(value) || 0
        : value,
    }));
  };

  return (
    <Card className="max-w-2xl mx-auto fade-in-up">
      <CardHeader>
        <CardTitle>{item ? 'Edit Item' : 'Add New Item'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="text-sm font-medium">
                Item Name *
              </label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Enter item name"
              />
            </div>
            <div>
              <label htmlFor="sku" className="text-sm font-medium">
                SKU *
              </label>
              <Input
                id="sku"
                name="sku"
                value={formData.sku}
                onChange={handleChange}
                required
                placeholder="Enter SKU"
              />
            </div>
          </div>

          <div>
            <label htmlFor="description" className="text-sm font-medium">
              Description
            </label>
            <Input
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter item description"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="category" className="text-sm font-medium">
                Category *
              </label>
              <Input
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                placeholder="Enter category"
              />
            </div>
            <div>
              <label htmlFor="price" className="text-sm font-medium">
                Price ($) *
              </label>
              <Input
                id="price"
                name="price"
                type="number"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={handleChange}
                required
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="quantity" className="text-sm font-medium">
                Quantity *
              </label>
              <Input
                id="quantity"
                name="quantity"
                type="number"
                min="0"
                value={formData.quantity}
                onChange={handleChange}
                required
                placeholder="0"
              />
            </div>
            <div>
              <label htmlFor="lowStockThreshold" className="text-sm font-medium">
                Low Stock Threshold *
              </label>
              <Input
                id="lowStockThreshold"
                name="lowStockThreshold"
                type="number"
                min="0"
                value={formData.lowStockThreshold}
                onChange={handleChange}
                required
                placeholder="5"
              />
            </div>
          </div>

          <div className="flex space-x-4 pt-4">
            <Button type="submit" className="flex-1">
              {item ? 'Update Item' : 'Add Item'}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
