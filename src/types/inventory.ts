export interface InventoryItem {
  id: string;
  name: string;
  description?: string;
  quantity: number;
  price: number;
  category: string;
  sku: string;
  lowStockThreshold: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface InventoryStats {
  totalItems: number;
  totalValue: number;
  lowStockItems: number;
  categories: number;
}

export type CreateItemData = Omit<InventoryItem, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateItemData = Partial<CreateItemData>;
