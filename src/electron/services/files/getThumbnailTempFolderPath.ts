import path from 'path'

import { app } from 'electron'

export const getThumbnailTempFolderPath = (): string => {
    const localPath = app.getPath('userData')

    const thumbnailFolderName =
        process.env.VITE_IMAGE_STAGING_THUMBNAIL_FOLDER || 'temp_thumbnails'

    return path.join(localPath, thumbnailFolderName)
}
