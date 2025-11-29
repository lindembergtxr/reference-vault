import fs from 'fs'
import path from 'path'

import { getDestinationFolder } from '../../config/index.js'
import { logError } from '../../utils/errors.js'
import { db } from '../../database/index.js'
import * as filesystem from '../../features/filesystem/index.js'
import { adaptInternalTabToDB, createTag, linkImageToTag } from '../../features/tags/index.js'

import { upsertImage } from './images.services.js'
import { writeImageMetadata } from './metadata.js'

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

    const undoStack: (() => Promise<void>)[] = []

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

        if (image.imagePath) {
            const originalPath = image.imagePath
            fs.renameSync(originalPath, imagePath)
            undoStack.push(async () => fs.renameSync(imagePath, originalPath))
        }

        if (image.thumbnailPath) {
            const originalThumb = image.thumbnailPath
            fs.renameSync(originalThumb, thumbnailPath)
            undoStack.push(async () => fs.renameSync(thumbnailPath, originalThumb))
        }

        await writeImageMetadata({ tags, filepath: imagePath })

        db.prepare('COMMIT').run()

        return { success: true, data: { imageId: image.id } }
    } catch (error) {
        db.prepare('ROLLBACK').run()

        await filesystem.rollback(undoStack)

        logError({ message: 'Failed to commit image!', error })

        return { success: false, error }
    }
}
