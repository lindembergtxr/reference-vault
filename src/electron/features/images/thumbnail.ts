import path from 'path'

import * as utils from '../../utils/index.js'
import * as filesystem from '../../features/filesystem/index.js'
import { createFolder } from '../../utils/filesystem.js'

type CreateThumbnailFromImageArgs = {
    url: string
    outputDir: string
}
export function createThumbnailFromImage({ url, outputDir }: CreateThumbnailFromImageArgs) {
    try {
        const fileName = path.basename(url)
        const outputPath = path.join(outputDir, fileName)

        createFolder(outputDir)
        filesystem.createThumbnailOnFolder(url, outputPath)

        return outputPath
    } catch (error) {
        const message = utils.errorMessages['ThumbnailCreationFailed'](url)

        utils.logError({ message, error })

        throw utils.generateError('ThumbnailCreationFailed', url)
    }
}
