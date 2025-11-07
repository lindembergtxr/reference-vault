import fs from 'fs/promises'
import path from 'path'
import * as helpers from '../helpers/index.js'
import * as utils from './index.js'

const folderNames = {
    tempImages: 'temp_images',
    tempThumbnails: 'temp_thumbnails',
    images: 'images',
    thumbnails: 'thumbnails',
}
export const getGalleryFolderPath = (folder: keyof typeof folderNames) => {
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
