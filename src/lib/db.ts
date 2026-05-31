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

  // Ticket 1 — 2026-05-28: three new nullable columns for Static's Report frame.
  // subject: free-form named subject of the article (e.g. 'Ernest', 'zClaude')
  if (!columnNames.includes('subject')) {
    db.exec("ALTER TABLE content ADD COLUMN subject TEXT")
  }
  // audience_in_fiction: 'beacon' | null — always 'beacon' for Build Log
  if (!columnNames.includes('audience_in_fiction')) {
    db.exec("ALTER TABLE content ADD COLUMN audience_in_fiction TEXT")
  }
  // source_seed: filename of the Story Seed this article derives from (audit trail)
  if (!columnNames.includes('source_seed')) {
    db.exec("ALTER TABLE content ADD COLUMN source_seed TEXT")
  }

  // Ticket 1 — 2026-05-28: rename character enum values.
  // pelican → beacon, gremlin → static (approved by Trewkat through end of 2027).
  // Each UPDATE is guarded — checks for existence of old value first so re-runs are no-ops.
  const hasPelican = (db.prepare("SELECT 1 FROM content WHERE character = 'pelican' LIMIT 1").get() !== undefined)
  if (hasPelican) {
    db.prepare("UPDATE content SET character = 'beacon' WHERE character = 'pelican'").run()
  }
  const hasGremlin = (db.prepare("SELECT 1 FROM content WHERE character = 'gremlin' LIMIT 1").get() !== undefined)
  if (hasGremlin) {
    db.prepare("UPDATE content SET character = 'static' WHERE character = 'gremlin'").run()
  }

  // Backfill status from legacy `published` flag, then drop the column.
  // Both operations are guarded so they only run on DBs that still have it.
  if (columnNames.includes('published')) {
    db.prepare("UPDATE content SET status = 'published' WHERE published = 1 AND status = 'draft'").run()
    db.exec("ALTER TABLE content DROP COLUMN published")
  }

  // x_thread_url removed 2026-05-31: the site uses LinkedIn, so the field was
  // dropped from the admin forms. Guarded so it only runs where the column exists.
  if (columnNames.includes('x_thread_url')) {
    db.exec("ALTER TABLE content DROP COLUMN x_thread_url")
  }
}
