import os from 'os'
import util from 'util'
import fs from 'fs'
import { exec } from 'child_process'

import { logError } from '../../utils/errors.js'
import { getDB } from '../../database/index.js'
import { rollback } from './filesystem.utils.js'
import { getDestinationFolder } from '../config/workspace.js'

let fsBusy = false

const execAsync = util.promisify(exec)

export async function lockFolder(folderPath: string | undefined) {
    if (!folderPath) return

    if (os.platform() === 'win32') {
        await execAsync(`attrib +R "${folderPath}" /S`)
    } else {
        await execAsync(`chmod -R u-w,go-w "${folderPath}"`)
    }
}

export async function unlockFolder(folderPath: string | undefined) {
    if (!folderPath) return

    if (os.platform() === 'win32') {
        await execAsync(`attrib -R "${folderPath}" /S`)
    } else {
        await execAsync(`chmod -R u+rwX,go+rX "${folderPath}"`)
    }
}

export function assertLockState(expected: 'LOCKED' | 'UNLOCKED') {
    const file = fs.readFileSync('.lockstate', 'utf-8')

    if (file !== expected) throw new Error('Filesystem in invalid state')
}

export async function withUnlockedFilesystem<T = void>(callback: () => Promise<T>) {
    if (fsBusy) throw new Error('Filesystem is busy — concurrent write blocked')

    const imagesPath = await getDestinationFolder('images')
    const thumbsPath = await getDestinationFolder('thumbnails')

    fsBusy = true

    let unlocked = false

    try {
        await unlockFolder(imagesPath)
        await unlockFolder(thumbsPath)
        unlocked = true

        return await callback()
    } catch (error) {
        logError({ message: 'Filesystem operation failed', error })

        throw error
    } finally {
        if (unlocked) {
            await lockFolder(imagesPath)
            await lockFolder(thumbsPath)
        }
        fsBusy = false
    }
}

type TransactionalCallback<T> = (undoStack: (() => Promise<void>)[]) => Promise<T>

export async function transactionalFileAndDB<T>(callback: TransactionalCallback<T>): Promise<T> {
    const undoStack: (() => Promise<void>)[] = []

    return withUnlockedFilesystem(async () => {
        const db = getDB()

        db.prepare('BEGIN').run()
        try {
            const result = await callback(undoStack)

            db.prepare('COMMIT').run()

            return result
        } catch (error) {
            db.prepare('ROLLBACK').run()

            await rollback(undoStack)

            throw error
        }
    })
}
