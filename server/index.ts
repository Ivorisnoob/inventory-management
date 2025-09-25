import express from 'express'
import cors from 'cors'
import path from 'path'
import Database from 'better-sqlite3'

const app = express()
app.use(cors())
app.use(express.json())

const dbPath = path.join(process.cwd(), 'server', 'inventory.db')
const db = new Database(dbPath)

db.pragma('journal_mode = WAL')

db.exec(`
  CREATE TABLE IF NOT EXISTS items (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    quantity INTEGER NOT NULL,
    price REAL NOT NULL,
    category TEXT NOT NULL,
    sku TEXT NOT NULL UNIQUE,
    lowStockThreshold INTEGER NOT NULL,
    createdAt TEXT NOT NULL,
    updatedAt TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    itemId TEXT,
    type TEXT NOT NULL, -- created|updated|deleted|adjusted
    description TEXT,
    delta INTEGER,
    at TEXT NOT NULL,
    FOREIGN KEY(itemId) REFERENCES items(id)
  );
`)

function nowIso(): string {
  return new Date().toISOString()
}

// CRUD: Create item
app.post('/api/items', (req, res) => {
  const {
    name,
    description,
    quantity,
    price,
    category,
    sku,
    lowStockThreshold,
  } = req.body || {}

  if (!name || !category || !sku || quantity == null || price == null || lowStockThreshold == null) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  const id = String(Date.now())
  const createdAt = nowIso()
  const updatedAt = createdAt

  try {
    const stmt = db.prepare(`INSERT INTO items (id, name, description, quantity, price, category, sku, lowStockThreshold, createdAt, updatedAt)
      VALUES (@id, @name, @description, @quantity, @price, @category, @sku, @lowStockThreshold, @createdAt, @updatedAt)`)
    stmt.run({ id, name, description, quantity, price, category, sku, lowStockThreshold, createdAt, updatedAt })
    db.prepare('INSERT INTO history (itemId, type, description, delta, at) VALUES (?, ?, ?, ?, ?)')
      .run(id, 'created', `Created item ${name} (${sku})`, null, createdAt)
    return res.status(201).json({ id, name, description, quantity, price, category, sku, lowStockThreshold, createdAt, updatedAt })
  } catch (err: any) {
    if (String(err.message).includes('UNIQUE')) {
      return res.status(409).json({ error: 'SKU must be unique' })
    }
    return res.status(500).json({ error: 'Failed to create item' })
  }
})

// Read all items
app.get('/api/items', (_req, res) => {
  const rows = db.prepare('SELECT * FROM items ORDER BY createdAt ASC').all()
  return res.json(rows)
})

// Read single item
app.get('/api/items/:id', (req, res) => {
  const row = db.prepare('SELECT * FROM items WHERE id = ?').get(req.params.id)
  if (!row) return res.status(404).json({ error: 'Not found' })
  return res.json(row)
})

// Update item
app.put('/api/items/:id', (req, res) => {
  const id = req.params.id
  const current = db.prepare('SELECT * FROM items WHERE id = ?').get(id)
  if (!current) return res.status(404).json({ error: 'Not found' })

  const {
    name = current.name,
    description = current.description,
    quantity = current.quantity,
    price = current.price,
    category = current.category,
    sku = current.sku,
    lowStockThreshold = current.lowStockThreshold,
  } = req.body || {}

  const updatedAt = nowIso()

  try {
    const stmt = db.prepare(`UPDATE items SET
      name=@name,
      description=@description,
      quantity=@quantity,
      price=@price,
      category=@category,
      sku=@sku,
      lowStockThreshold=@lowStockThreshold,
      updatedAt=@updatedAt
      WHERE id=@id`)
    stmt.run({ id, name, description, quantity, price, category, sku, lowStockThreshold, updatedAt })
    const row = db.prepare('SELECT * FROM items WHERE id = ?').get(id)
    db.prepare('INSERT INTO history (itemId, type, description, delta, at) VALUES (?, ?, ?, ?, ?)')
      .run(id, 'updated', `Updated item ${row.name} (${row.sku})`, null, updatedAt)
    return res.json(row)
  } catch (err: any) {
    if (String(err.message).includes('UNIQUE')) {
      return res.status(409).json({ error: 'SKU must be unique' })
    }
    return res.status(500).json({ error: 'Failed to update item' })
  }
})

// Delete item
app.delete('/api/items/:id', (req, res) => {
  const existing = db.prepare('SELECT * FROM items WHERE id = ?').get(req.params.id)
  const info = db.prepare('DELETE FROM items WHERE id = ?').run(req.params.id)
  if (info.changes === 0) return res.status(404).json({ error: 'Not found' })
  const at = nowIso()
  if (existing) {
    db.prepare('INSERT INTO history (itemId, type, description, delta, at) VALUES (?, ?, ?, ?, ?)')
      .run(existing.id, 'deleted', `Deleted item ${existing.name} (${existing.sku})`, null, at)
  }
  return res.status(204).end()
})

// Adjust quantity endpoint
app.post('/api/items/:id/adjust', (req, res) => {
  const id = req.params.id
  const delta: number = Number(req.body?.delta)
  if (!Number.isFinite(delta)) return res.status(400).json({ error: 'delta must be a number' })
  const row = db.prepare('SELECT * FROM items WHERE id = ?').get(id)
  if (!row) return res.status(404).json({ error: 'Not found' })
  const quantity = Math.max(0, Number(row.quantity) + delta)
  const updatedAt = nowIso()
  db.prepare('UPDATE items SET quantity = ?, updatedAt = ? WHERE id = ?').run(quantity, updatedAt, id)
  const updated = db.prepare('SELECT * FROM items WHERE id = ?').get(id)
  db.prepare('INSERT INTO history (itemId, type, description, delta, at) VALUES (?, ?, ?, ?, ?)')
    .run(id, 'adjusted', `Adjusted quantity by ${delta} (now ${quantity})`, delta, updatedAt)
  return res.json(updated)
})

// Stats endpoint
app.get('/api/stats', (_req, res) => {
  const totals = db.prepare('SELECT SUM(quantity) as totalItems, SUM(quantity * price) as totalValue FROM items').get() || { totalItems: 0, totalValue: 0 }
  const low = db.prepare('SELECT COUNT(1) as count FROM items WHERE quantity <= lowStockThreshold').get() || { count: 0 }
  const categories = db.prepare('SELECT COUNT(DISTINCT category) as count FROM items').get() || { count: 0 }
  return res.json({
    totalItems: Number(totals.totalItems) || 0,
    totalValue: Number(totals.totalValue) || 0,
    lowStockItems: Number(low.count) || 0,
    categories: Number(categories.count) || 0,
  })
})

// History endpoint (recent first)
app.get('/api/history', (req, res) => {
  const limit = Math.max(1, Math.min(200, Number(req.query.limit) || 20))
  const rows = db.prepare('SELECT * FROM history ORDER BY at DESC LIMIT ?').all(limit)
  return res.json(rows)
})

const port = Number(process.env.PORT || 8787)
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`API listening on http://localhost:${port}`)
})


