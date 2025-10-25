import * as utils from '../../utils/folders.js'
import { getTempFolderPath } from './import.js'

export const getStagedFiles = async () => {
    const tempFolderPath = getTempFolderPath()

    const fileURLs = await utils.getFolderImages(tempFolderPath)

    return fileURLs
}
