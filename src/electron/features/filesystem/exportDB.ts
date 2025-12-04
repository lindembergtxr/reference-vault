import Database from 'better-sqlite3'
import path from 'path'

import { logError } from '../../utils/errors.js'
import * as filesystem from '../filesystem/index.js'
import { getDBPath } from '../../database/operations.js'

export async function copyDatabaseToFolder(workspaceName: string) {
    try {
        const destinationPath = await filesystem.selectFolder()

        if (!destinationPath) return { success: false, error: 'No folder selected' }

        const filename = `${workspaceName}_reference_vault_backup_${new Date().toISOString()}.db`

        const destination = path.join(destinationPath, filename)

        const tempDB = new Database(getDBPath(workspaceName), { readonly: true })

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
