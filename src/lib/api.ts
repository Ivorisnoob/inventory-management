import type { CreateItemData, InventoryItem, InventoryStats } from '@/types/inventory'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8787'

export async function fetchItems(): Promise<InventoryItem[]> {
  const res = await fetch(`${API_BASE}/api/items`)
  if (!res.ok) throw new Error('Failed to fetch items')
  const data = await res.json()
  return data.map((row: any) => ({
    ...row,
    quantity: Number(row.quantity),
    price: Number(row.price),
    lowStockThreshold: Number(row.lowStockThreshold),
    createdAt: new Date(row.createdAt),
    updatedAt: new Date(row.updatedAt),
  })) as InventoryItem[]
}

export async function createItem(payload: CreateItemData): Promise<InventoryItem> {
  const res = await fetch(`${API_BASE}/api/items`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error('Failed to create item')
  const row = await res.json()
  return {
    ...row,
    quantity: Number(row.quantity),
    price: Number(row.price),
    lowStockThreshold: Number(row.lowStockThreshold),
    createdAt: new Date(row.createdAt),
    updatedAt: new Date(row.updatedAt),
  } as InventoryItem
}

export async function updateItem(id: string, payload: CreateItemData): Promise<InventoryItem> {
  const res = await fetch(`${API_BASE}/api/items/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error('Failed to update item')
  const row = await res.json()
  return {
    ...row,
    quantity: Number(row.quantity),
    price: Number(row.price),
    lowStockThreshold: Number(row.lowStockThreshold),
    createdAt: new Date(row.createdAt),
    updatedAt: new Date(row.updatedAt),
  } as InventoryItem
}

export async function deleteItem(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/api/items/${id}`, { method: 'DELETE' })
  if (!res.ok && res.status !== 204) throw new Error('Failed to delete item')
}

export async function adjustQuantity(id: string, delta: number): Promise<InventoryItem> {
  const res = await fetch(`${API_BASE}/api/items/${id}/adjust`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ delta }),
  })
  if (!res.ok) throw new Error('Failed to adjust quantity')
  const row = await res.json()
  return {
    ...row,
    quantity: Number(row.quantity),
    price: Number(row.price),
    lowStockThreshold: Number(row.lowStockThreshold),
    createdAt: new Date(row.createdAt),
    updatedAt: new Date(row.updatedAt),
  } as InventoryItem
}

export async function fetchStats(): Promise<InventoryStats> {
  const res = await fetch(`${API_BASE}/api/stats`)
  if (!res.ok) throw new Error('Failed to fetch stats')
  const data = await res.json()
  return {
    totalItems: Number(data.totalItems) || 0,
    totalValue: Number(data.totalValue) || 0,
    lowStockItems: Number(data.lowStockItems) || 0,
    categories: Number(data.categories) || 0,
  }
}

export interface HistoryEntry {
  id: number
  itemId?: string
  type: 'created' | 'updated' | 'deleted' | 'adjusted'
  description?: string
  delta?: number
  at: Date
}

export async function fetchHistory(limit = 20): Promise<HistoryEntry[]> {
  const res = await fetch(`${API_BASE}/api/history?limit=${encodeURIComponent(String(limit))}`)
  if (!res.ok) throw new Error('Failed to fetch history')
  const rows = await res.json()
  return rows.map((r: any) => ({ ...r, at: new Date(r.at) }))
}


