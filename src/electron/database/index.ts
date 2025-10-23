import fs from 'fs'
import path from 'path'
import Database from 'better-sqlite3'
import { app } from 'electron'
import dotenv from 'dotenv'

dotenv.config()

const dbPath = path.join(
    app.getPath('userData'),
    process.env.VITE_DATABASE_FILENAME ?? 'reference_vault.db',
)

fs.mkdirSync(path.dirname(dbPath), { recursive: true })

export const db = new Database(dbPath)

db.pragma('journal_mode = WAL')

const schemaPath = path.join(
    app.getAppPath(),
    'src/electron/database/schema.sql',
)

if (fs.existsSync(schemaPath)) {
    const schema = fs.readFileSync(schemaPath, 'utf8')
    db.exec(schema)
    console.log('Database started and schema applied!')
} else {
    console.log('Database started, but schema not found')
}
