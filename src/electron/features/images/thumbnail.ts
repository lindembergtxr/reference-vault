import path from 'path'
import pLimit from 'p-limit'

import * as utils from '../../utils/index.js'
import * as filesystem from '../filesystem/index.js'

type CreateThumbnailFromImageArgs = {
    url: string
    outputDir: string
}
export async function createThumbnailFromImage({ url, outputDir }: CreateThumbnailFromImageArgs) {
    try {
        const fileName = path.basename(url)
        const outputPath = path.join(outputDir, fileName)

        await filesystem.createFolder(outputDir)
        await filesystem.createThumbnailOnFolder(url, outputPath)

        return outputPath
    } catch (error) {
        const message = utils.errorMessages['ThumbnailCreationFailed'](url)
        await utils.logError({ message, error })
        throw utils.generateError('ThumbnailCreationFailed', url)
    }
}

type BatchCreateThumbnailsData = {
    url: string
    filename: string
}[]

export async function batchCreateThumbnails(data: BatchCreateThumbnailsData) {
    const concurrency = Number(process.env.VITE_CONCURRENCY_LIMIT) || 5
    const limit = pLimit(concurrency)

    const destinationPath = await filesystem.getTemporaryFolderPath('thumbnails')

    const promises = data.map(({ url, filename }) =>
        limit(async () => {
            const destination = path.join(destinationPath, filename)

            await createThumbnailFromImage({ url, outputDir: destinationPath })

            return { filename, thumbnail: destination, image: url }
        })
    )
    return Promise.allSettled(promises)
}
