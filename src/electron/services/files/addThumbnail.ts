import path from 'path'

import * as utils from '../../utils/index.js'
import { getThumbnailTempFolderPath } from './getThumbnailTempFolderPath.js'

export const addThumbnail = async (src: string) => {
    try {
        const fileName = path.basename(src)

        const outputDir = getThumbnailTempFolderPath()
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
