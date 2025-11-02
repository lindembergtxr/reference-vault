import fs from 'fs/promises'
import path from 'path'
import * as helpers from '../helpers/index.js'
import * as utils from './index.js'

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

export const getTempThumbnailFolderPath = async () => {
    const localPath = helpers.getUserDataPath()
    const tempFolderName = process.env.VITE_IMAGE_STAGING_THUMBNAIL_FOLDER

    if (!tempFolderName) {
        const message = utils.errorMessages['MissingEnvVar']('VITE_IMAGE_STAGING_THUMBNAIL_FOLDER')
        await utils.logError({ message })
        throw utils.generateError('MissingEnvVar', 'VITE_IMAGE_STAGING_THUMBNAIL_FOLDER')
    }
    return path.join(localPath, tempFolderName)
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

export const getThumbnailFolderPath = async () => {
    const localPath = helpers.getUserDataPath()
    const tempFolderName = process.env.VITE_IMAGE_THUMBNAIL_FOLDER

    if (!tempFolderName) {
        const message = utils.errorMessages['MissingEnvVar']('VITE_IMAGE_THUMBNAIL_FOLDER')
        await utils.logError({ message })
        throw utils.generateError('MissingEnvVar', 'VITE_IMAGE_THUMBNAIL_FOLDER')
    }
    return path.join(localPath, tempFolderName)
}

export const getImagesFolderPath = async () => {
    const localPath = helpers.getUserDataPath()
    const tempFolderName = process.env.VITE_IMAGE_FOLDER

    if (!tempFolderName) {
        const message = utils.errorMessages['MissingEnvVar']('VITE_IMAGE_FOLDER')
        await utils.logError({ message })
        throw utils.generateError('MissingEnvVar', 'VITE_IMAGE_FOLDER')
    }
    return path.join(localPath, tempFolderName)
}
