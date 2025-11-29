import fs from 'fs'
import path from 'path'

import { getDestinationFolder } from '../../config/index.js'
import { logError } from '../../utils/errors.js'
import { db } from '../../database/index.js'
import { adaptInternalTabToDB } from '../tags/tags.adapters.js'
import { createTag, linkImageToTag } from '../tags/tags.services.js'
import { upsertImage } from './images.services.js'
import { writeImageMetadata } from './index.js'

export async function commitImage(image: InternalImage<InternalTagNew>) {
    return writeImage({ image, situation: 'committed' })
}

export async function updateImage(image: InternalImage<InternalTagNew>) {
    return writeImage({ image, situation: 'completed' })
}

type WriteImageArgs = {
    image: InternalImage<InternalTagNew>
    situation: InternalImage['situation']
}
export async function writeImage({ image, situation }: WriteImageArgs) {
    const thumbFolder = await getDestinationFolder('thumbnails')
    const thumbnailPath = path.join(thumbFolder, image.id)

    const imagesFolder = await getDestinationFolder('images')
    const imagePath = path.join(imagesFolder, image.id)

    try {
        fs.mkdirSync(imagesFolder, { recursive: true })
        fs.mkdirSync(thumbFolder, { recursive: true })

        db.prepare('BEGIN').run()

        upsertImage({ ...image, imagePath, thumbnailPath, situation })

        const tags: InternalTag[] = []

        for (const tag of image.tags) {
            const tagId = await createTag(adaptInternalTabToDB(tag), db)

            tags.push({ ...tag, id: tagId })

            await linkImageToTag(image.id, tagId)
        }

        if (image.imagePath) fs.renameSync(image.imagePath, imagePath)
        if (image.thumbnailPath) fs.renameSync(image.thumbnailPath, thumbnailPath)

        await writeImageMetadata({ tags, filepath: imagePath })

        db.prepare('COMMIT').run()

        return { success: true, data: { imageId: image.id } }
    } catch (error) {
        db.prepare('ROLLBACK').run()

        logError({ message: 'Failed to commit image!', error })

        return { success: false, error }
    }
}
