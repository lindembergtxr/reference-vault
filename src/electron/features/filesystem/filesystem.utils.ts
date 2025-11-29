import fs from 'fs/promises'
import path from 'path'

import { getUserDataPath, logError, showOpenDialog } from '../../utils/index.js'

const folderNames = {
    images: 'temp_images',
    thumbnails: 'temp_thumbnails',
}

export function getTemporaryFolderPath(folder: keyof typeof folderNames) {
    return path.join(getUserDataPath(), 'gallery', folderNames[folder])
}

export async function selectFolder() {
    const result = await showOpenDialog()

    if (result.canceled || result.filePaths.length === 0) {
        logError({ message: 'User opted to not select a folder' })
        return
    }
    return result.filePaths[0]
}

export async function createFolder(directory: string) {
    await fs.mkdir(directory, { recursive: true })
}

export async function getFolderImages(src: string): Promise<string[]> {
    const imageRegex = /\.(jpe?g|png|gif|webp|bmp|tiff)$/i

    const files = await fs.readdir(src)

    const fileURLs = files
        .filter((file) => imageRegex.test(file))
        .map((file) => path.join(src, file))

    return fileURLs
}

export async function safeDelete(path: string) {
    try {
        await fs.unlink(path)
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
