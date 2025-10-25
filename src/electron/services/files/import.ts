import path from 'path'

import { app, dialog } from 'electron'

import * as utils from '../../utils/index.js'
import { ImageService } from '../images/imageService.js'
import { addThumbnail } from './addThumbnail.js'
import { copyFileToFolder } from './move.js'

export const getTempFolderPath = () => {
    const localPath = app.getPath('userData')

    const tempFolderName =
        process.env.VITE_IMAGE_STAGING_FOLDER || 'temp_images'

    return path.join(localPath, tempFolderName)
}

export const importFromFolder = async () => {
    const result = await dialog.showOpenDialog({
        properties: ['openDirectory'],
    })

    let fileURLs: string[]

    if (result.canceled || result.filePaths.length === 0) {
        fileURLs = []
    } else {
        const folderPath = result.filePaths[0]

        fileURLs = await utils.getFolderImages(folderPath)
    }

    const limit = Number(process.env.VITE_CONCURRENCY_LIMIT) || 1

    for (let i = 0; i < fileURLs.length; i += limit) {
        const batch = fileURLs.slice(i, i + limit)

        const batchPromises = batch.map(async (url) => {
            try {
                const extension = path.extname(url)
                const filename = `${utils.generateId()}${extension}`
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
