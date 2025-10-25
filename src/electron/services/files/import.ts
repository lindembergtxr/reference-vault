import fs from 'fs/promises'
import { customAlphabet } from 'nanoid'
import path from 'path'

import { app, dialog } from 'electron'

import { ImageService } from '../images/imageService.js'
import { addThumbnail } from './addThumbnail.js'
import { copyFileToFolder } from './move.js'

const alphabet =
    '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'

const nanoid = customAlphabet(alphabet, 12)

export const getTempFolderPath = () => {
    const localPath = app.getPath('userData')

    const tempFolderName =
        process.env.VITE_IMAGE_STAGING_FOLDER || 'temp_images'

    return path.join(localPath, tempFolderName)
}

const getFolderImages = async (): Promise<string[]> => {
    const result = await dialog.showOpenDialog({
        properties: ['openDirectory'],
    })
    if (result.canceled || result.filePaths.length === 0) return []

    const folderPath = result.filePaths[0]

    const imageRegex = /\.(jpe?g|png|gif|webp|bmp|tiff)$/i

    const files = await fs.readdir(folderPath)

    const fileURLs = files
        .filter((file) => imageRegex.test(file))
        .map((file) => path.join(folderPath, file))

    return fileURLs
}

export const importFromFolder = async () => {
    const fileURLs = await getFolderImages()

    const limit = Number(process.env.VITE_CONCURRENCY_LIMIT) || 1

    for (let i = 0; i < fileURLs.length; i += limit) {
        const batch = fileURLs.slice(i, i + limit)

        const batchPromises = batch.map(async (url) => {
            try {
                const extension = path.extname(url)
                const filename = `${nanoid(12)}${extension}`
                const destination = path.join(getTempFolderPath(), filename)

                await copyFileToFolder(url, destination)

                await addThumbnail(destination)

                ImageService.add(filename)
            } catch (error) {
                console.error(`Failed to import ${url}:`, error)
            }
        })

        await Promise.all(batchPromises)
    }

    console.log('SUCCESS! Operation finalized!')
}
