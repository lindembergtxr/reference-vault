import path from 'path'
import pLimit from 'p-limit'

import * as utils from '../../utils/index.js'

export const createThumbnailFromImage = async (src: string) => {
    try {
        const fileName = path.basename(src)

        const outputDir = utils.getTemporaryFolderPath('thumbnails')
        const outputPath = path.join(outputDir, fileName)

        // makes sure the folder exists
        await utils.createFolder(outputDir)

        // copy the file, resize and save to folder
        await utils.createThumbOnFolder(src, outputPath)

        return outputPath
    } catch (error) {
        const message = utils.errorMessages['ThumbnailCreationFailed'](src)
        await utils.logError({ message, error })
        throw utils.generateError('ThumbnailCreationFailed', src)
    }
}

type BatchCreateThumbnailsData = {
    url: string
    filename: string
}[]

export const batchCreateThumbnails = async (data: BatchCreateThumbnailsData) => {
    const concurrency = Number(process.env.VITE_CONCURRENCY_LIMIT) || 5
    const limit = pLimit(concurrency)

    const destinationPath = await utils.getTemporaryFolderPath('thumbnails')

    const promises = data.map(({ url, filename }) =>
        limit(async () => {
            const destination = path.join(destinationPath, filename)

            await createThumbnailFromImage(url)

            return { filename, thumbnail: destination, image: url }
        })
    )
    return Promise.allSettled(promises)
}
