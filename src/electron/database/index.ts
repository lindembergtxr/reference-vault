import path from 'path'
import { mkdirSync } from 'fs'
import Database, { type Database as DatabaseType } from 'better-sqlite3'

import { logError } from '../utils/index.js'

import { applySchema, closeDB, getDBPath, setDB } from './operations.js'

export * from './operations.js'

export function initDatabase(workspaceName: string): DatabaseType | undefined {
    const safeName = workspaceName.trim()

    if (!safeName) throw new Error('Workspace name required to init DB')

    const dbPath = getDBPath(safeName)

    try {
        mkdirSync(path.dirname(dbPath), { recursive: true })

        closeDB()

        const db = new Database(dbPath)
        db.pragma('journal_mode = WAL')

        applySchema(db)

        setDB(db)

        return db
    } catch (error) {
        logError({ message: 'Failed to initialize database', error })

        throw error
    }
}
