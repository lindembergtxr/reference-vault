import fs from 'fs'
import path from 'path'

import { db } from '../../database/index.js'
import { upsertImage } from './database.js'
import { createTag, linkImageToTag } from '../tags/database.js'
import * as utils from '../../utils/index.js'
import * as services from '../index.js'
import { adaptInternalTabToDB } from '../../adapters/tags.js'

export async function commitImage(image: InternalImage<InternalTagNew>) {
    const thumbFolder = await services.getDestinationFolder('thumbnails')
    const thumbnailPath = path.join(thumbFolder, image.id)

    const imagesFolder = await services.getDestinationFolder('images')
    const imagePath = path.join(imagesFolder, image.id)

    try {
        fs.mkdirSync(imagesFolder, { recursive: true })
        fs.mkdirSync(thumbFolder, { recursive: true })

        db.prepare('BEGIN').run()

        upsertImage({ ...image, imagePath, thumbnailPath, situation: 'committed' })

        for (const tag of image.tags) {
            const tagId = await createTag(adaptInternalTabToDB(tag), db)
            await linkImageToTag(image.id, tagId)
        }

        if (image.imagePath) fs.renameSync(image.imagePath, imagePath)
        if (image.thumbnailPath) fs.renameSync(image.thumbnailPath, thumbnailPath)

        db.prepare('COMMIT').run()

        return { success: true, data: { imageId: image.id } }
    } catch (error) {
        db.prepare('ROLLBACK').run()

        utils.logError({ message: 'Failed to commit image!', error })

        return { success: false, error }
    }
}
