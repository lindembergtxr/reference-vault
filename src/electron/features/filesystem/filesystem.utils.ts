import fs from 'fs'
import path from 'path'

import { logError, showOpenDialog } from '../../utils/index.js'

export async function selectFolder() {
    const result = await showOpenDialog()

    if (result.canceled || result.filePaths.length === 0) {
        logError({ message: 'User opted to not select a folder' })
        return
    }
    return result.filePaths[0]
}

export function listImageFilesInDirectory(src: string): string[] {
    const imageRegex = /\.(jpe?g|png|gif|webp|bmp|tiff)$/i

    const files = fs.readdirSync(src)

    const fileURLs = files
        .filter((file) => imageRegex.test(file))
        .map((file) => path.join(src, file))

    return fileURLs
}

export async function safeDelete(path: string) {
    try {
        await fs.promises.unlink(path)
    } catch (error: unknown) {
        if (error instanceof Error) {
            const code = (error as NodeJS.ErrnoException).code

            if (code === 'ENOENT') return

            logError({ message: `[safeDelete] Falha ao deletar: ${path}`, error })
            console.warn(`[safeDelete] Falha ao deletar: ${path}`, error)
        } else {
            logError({ message: `[safeDelete] Erro desconhecido ao deletar: ${path}`, error })
            console.warn(`[safeDelete] Erro desconhecido ao deletar: ${path}`, error)
        }
    }
}

export async function rollback(undoStack: Array<() => Promise<void>>) {
    for (let i = undoStack.length - 1; i >= 0; i--) {
        try {
            await undoStack[i]()
        } catch (error) {
            logError({ message: 'Rollback failed step:', error })
        }
    }
}

export async function ensureFolder(dir: string) {
    await fs.promises.mkdir(dir, { recursive: true })
}
