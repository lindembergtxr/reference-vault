import path from 'path'
import { existsSync, readFileSync } from 'fs'
import { type Database } from 'better-sqlite3'

import { getAppPathHelper, getUserDataPath } from '../utils/electron.js'
import { getConfig } from '../features/config/config.services.js'

let currentDB: Database | undefined = undefined

export function getDB(): Database {
    if (!currentDB) throw new Error('Database not initialized')
    return currentDB
}

export function getDBPath(workspaceName: string): string {
    const config = getConfig()

    const safeName = workspaceName?.trim()

    if (!safeName) throw new Error('Workspace name must not be empty.')

    const exists = config.workspaces.some((ws) => ws.name === safeName)

    if (!exists) throw new Error('Invalid workspace name.')

    return path.join(getUserDataPath(), 'workspaces', safeName, 'reference_vault.db')
}

export function setDB(db: Database | undefined) {
    currentDB = db
}

export function applySchema(db: Database) {
    const schemaPath = path.join(getAppPathHelper(), 'src/electron/database/schema.sql')

    if (existsSync(schemaPath)) {
        const schema = readFileSync(schemaPath, 'utf8')
        db.exec(schema)
    } else {
        console.warn('Schema not found')
    }
}

export function closeDB() {
    if (currentDB) {
        currentDB.close()
        currentDB = undefined
    }
}
