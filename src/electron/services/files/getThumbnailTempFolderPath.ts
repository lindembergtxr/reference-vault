import path from 'path'

import * as helpers from '../../helpers/index.js'

export const getThumbnailTempFolderPath = (): string => {
    const localPath = helpers.getUserDataPath()

    const thumbnailFolderName = process.env.VITE_IMAGE_STAGING_THUMBNAIL_FOLDER || 'temp_thumbnails'

    return path.join(localPath, thumbnailFolderName)
}
