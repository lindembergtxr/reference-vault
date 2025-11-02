import fs from 'fs'
import path from 'path'

import { db } from '../../database/index.js'
import { upsertImage } from './database.js'
import { createTag, linkImageToTag } from '../tags.js'
import * as utils from '../../utils/index.js'

export const commitImage = async (image: InternalImage) => {
    const thumbFolder = await utils.getThumbnailFolderPath()
    const thumbnailPath = path.join(thumbFolder, image.id)

    const imagesFolder = await utils.getImagesFolderPath()
    const imagePath = path.join(imagesFolder, image.id)

    const transaction = db.transaction(() => {
        upsertImage({ ...image, imagePath, thumbnailPath, situation: 'committed' })

        for (const tag of image.tags) {
            createTag(tag, db)
            linkImageToTag(image.id, tag.id)
        }
    })
    try {
        transaction()

        fs.mkdirSync(imagesFolder, { recursive: true })
        fs.mkdirSync(thumbFolder, { recursive: true })

        if (image.imagePath) fs.renameSync(image.imagePath, imagePath)
        if (image.thumbnailPath) fs.renameSync(image.thumbnailPath, thumbnailPath)

        return { success: true, data: { imageId: image.id } }
    } catch (error) {
        utils.logError({ message: 'Failed to commit image!', error })

        return { success: false, error }
    }
}
