import Database from 'better-sqlite3'
import path from 'path'
import fs from 'fs'

const DB_PATH = process.env.DATABASE_URL ?? path.join(process.cwd(), 'data', 'news.db')

let db: Database.Database | null = null

export function getDb(): Database.Database {
  if (db) return db

  // Ensure the data directory exists
  const dir = path.dirname(DB_PATH)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }

  db = new Database(DB_PATH)
  db.pragma('journal_mode = WAL')
  db.pragma('foreign_keys = ON')

  initSchema(db)
  return db
}

function initSchema(db: Database.Database): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS content (
      id            INTEGER PRIMARY KEY AUTOINCREMENT,
      slug          TEXT UNIQUE NOT NULL,
      title         TEXT NOT NULL,
      body          TEXT NOT NULL,
      excerpt       TEXT,
      type          TEXT NOT NULL DEFAULT 'post',
      tier          TEXT NOT NULL DEFAULT 'free',
      series        TEXT,
      published     INTEGER NOT NULL DEFAULT 0,
      x_thread_url  TEXT,
      created_at    TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at    TEXT NOT NULL DEFAULT (datetime('now'))
    );
    -- series: 'build-log' | 'new-news' | null (future series can be added without schema change)
  `)

  const existingColumns = db.prepare("PRAGMA table_info(content)").all() as { name: string }[]
  const columnNames = existingColumns.map(c => c.name)
  if (!columnNames.includes('character')) {
    db.exec("ALTER TABLE content ADD COLUMN character TEXT")
  }
  if (!columnNames.includes('comic_panels')) {
    db.exec("ALTER TABLE content ADD COLUMN comic_panels TEXT")
  }
  // status: 'draft' | 'pending_review' | 'changes_requested' | 'approved' | 'published'
  if (!columnNames.includes('status')) {
    db.exec("ALTER TABLE content ADD COLUMN status TEXT NOT NULL DEFAULT 'draft'")
  }
  // author: 'ernest' | 'trewkat' | 'hermes'
  if (!columnNames.includes('author')) {
    db.exec("ALTER TABLE content ADD COLUMN author TEXT NOT NULL DEFAULT 'ernest'")
  }
  if (!columnNames.includes('review_notes')) {
    db.exec("ALTER TABLE content ADD COLUMN review_notes TEXT")
  }
  if (!columnNames.includes('published_at')) {
    db.exec("ALTER TABLE content ADD COLUMN published_at TEXT")
  }

  // Backfill status from legacy `published` flag. Idempotent: only flips rows
  // still on the default 'draft' status. Legacy `published` column is dropped
  // in a follow-up issue (#72).
  db.prepare("UPDATE content SET status = 'published' WHERE published = 1 AND status = 'draft'").run()
}
