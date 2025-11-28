import fs from 'fs/promises'
import path from 'path'
import * as helpers from '../helpers/index.js'
import * as utils from './index.js'

const folderNames = {
    images: 'temp_images',
    thumbnails: 'temp_thumbnails',
}
export const getTemporaryFolderPath = (folder: keyof typeof folderNames) => {
    return path.join(helpers.getUserDataPath(), 'gallery', folderNames[folder])
}

export const selectFolder = async () => {
    const result = await helpers.showOpenDialog()

    if (result.canceled || result.filePaths.length === 0) {
        utils.logError({ message: 'User opted to not select a folder' })
        return
    }
    return result.filePaths[0]
}

export const createFolder = async (directory: string) => {
    await fs.mkdir(directory, { recursive: true })
}

export const getFolderImages = async (src: string): Promise<string[]> => {
    const imageRegex = /\.(jpe?g|png|gif|webp|bmp|tiff)$/i

    const files = await fs.readdir(src)

    const fileURLs = files
        .filter((file) => imageRegex.test(file))
        .map((file) => path.join(src, file))

    return fileURLs
}

export const safeDelete = async (path: string) => {
    try {
        await fs.unlink(path)
    } catch (error: unknown) {
        if (error instanceof Error) {
            const code = (error as NodeJS.ErrnoException).code

            if (code === 'ENOENT') return

            utils.logError({ message: `[safeDelete] Falha ao deletar: ${path}`, error })
            console.warn(`[safeDelete] Falha ao deletar: ${path}`, error)
        } else {
            utils.logError({ message: `[safeDelete] Erro desconhecido ao deletar: ${path}`, error })
            console.warn(`[safeDelete] Erro desconhecido ao deletar: ${path}`, error)
        }
    }
}
