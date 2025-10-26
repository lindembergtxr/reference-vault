import fs from 'fs/promises'
import path from 'path'
import * as helpers from '../helpers/index.js'
import * as utils from './index.js'

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

export const getTempThumbnailFolderPath = async () => {
    const tempFolderName = process.env.VITE_IMAGE_STAGING_FOLDER

    if (!tempFolderName) {
        const message = utils.errorMessages['MissingEnvVar']('VITE_THUMBNAIL_STAGING_FOLDER')
        await utils.logError({ message })
        throw utils.generateError('MissingEnvVar', 'VITE_THUMBNAIL_STAGING_FOLDER')
    }
}

export const getTempImagesFolderPath = async () => {
    const localPath = helpers.getUserDataPath()
    const tempFolderName = process.env.VITE_IMAGE_STAGING_FOLDER

    if (!tempFolderName) {
        const message = utils.errorMessages['MissingEnvVar']('VITE_IMAGE_STAGING_FOLDER')
        await utils.logError({ message })
        throw utils.generateError('MissingEnvVar', 'VITE_IMAGE_STAGING_FOLDER')
    }

    return path.join(localPath, tempFolderName)
}
