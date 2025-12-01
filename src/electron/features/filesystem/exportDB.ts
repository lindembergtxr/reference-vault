import Database from 'better-sqlite3'
import path from 'path'

import { logError } from '../../utils/errors.js'
import { dbPath } from '../../database/index.js'
import * as filesystem from '../filesystem/index.js'

export async function copyDatabaseToFolder() {
    try {
        const destinationPath = await filesystem.selectFolder()

        if (!destinationPath) return { success: false, error: 'No folder selected' }

        const filename = `reference_vault_backup_${new Date().toISOString()}.db`
        const destination = path.join(destinationPath, filename)
        const tempDB = new Database(dbPath, { readonly: true })

        try {
            await tempDB.backup(destination)
        } finally {
            tempDB.close()
        }
        return { success: true, data: { path: destination } }
    } catch (error) {
        logError({ message: 'Failed to export database', error })
        return { success: false, error }
    }
}
