import fs from 'fs'

import { getDestinationFolder } from '../../config/index.js'
import { logError } from '../../utils/errors.js'
import { db } from '../../database/index.js'
import { adaptInternalTabToDB, createTag } from '../../features/tags/index.js'
import { transactionalFileAndDB } from '../filesystem/lock.js'

import {
    deleteImage,
    getTagsForImage,
    linkTagsToImage,
    unlinkTagsFromImage,
    upsertImage,
} from './images.services.js'
import { getImagePath, getThumbnailPath } from './images.utils.js'

type WriteImageArgs = {
    image: InternalImage<InternalTagNew>
    situation: InternalImage['situation']
}
async function writeImage({ image, situation }: WriteImageArgs) {
    const thumbFolder = getDestinationFolder('thumbnails')
    const imagesFolder = getDestinationFolder('images')

    const thumbnailPath = getThumbnailPath(image.id)
    const imagePath = getImagePath(image.id)

    try {
        await transactionalFileAndDB(async (undoStack) => {
            fs.mkdirSync(imagesFolder, { recursive: true })
            fs.mkdirSync(thumbFolder, { recursive: true })

            upsertImage({ ...image, imagePath, thumbnailPath, situation })

            const tags: InternalTag[] = []

            for (const tag of image.tags) {
                const tagId = createTag(adaptInternalTabToDB(tag), db)

                const newTag = { ...tag, id: tagId }

                tags.push(newTag)

                linkTagsToImage({ imageId: image.id, tags: [newTag] })

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
            }
        })

        return { success: true, data: { imageId: image.id } }
    } catch (error) {
        logError({ message: 'Failed to commit image!', error })

        return { success: false, error }
    }
}

export async function commitImage(image: InternalImage<InternalTagNew>) {
    return writeImage({ image, situation: 'committed' })
}

export async function updateImage(image: InternalImage<InternalTagNew>) {
    return writeImage({ image, situation: 'completed' })
}

export async function addTagsToImage({ imageId, tags }: ImageTagsChangeArgs) {
    const internalTags: InternalTag[] = []

    try {
        db.prepare('BEGIN').run()

        for (const tag of tags) {
            const tagId = createTag(adaptInternalTabToDB(tag), db)

            const newTag: InternalTag = { ...tag, id: tagId }

            internalTags.push(newTag)

            linkTagsToImage({ imageId, tags: [newTag] })
        }
        db.prepare('COMMIT').run()

        return { success: true, data: { imageId, tags: internalTags } }
    } catch (error) {
        db.prepare('ROLLBACK').run()

        logError({ message: `Failed to add tags to image ID=${imageId}`, error })

        return { success: false, error }
    }
}

export async function removeTagsFromImage({ imageId, tags }: ImageTagsChangeArgs) {
    try {
        db.prepare('BEGIN').run()

        unlinkTagsFromImage({ imageId, tags })

        db.prepare('COMMIT').run()

        const imageTags = getTagsForImage(imageId)

        return { success: true, data: { imageId, tags: imageTags } }
    } catch (error) {
        db.prepare('ROLLBACK').run()

        logError({ message: `Failed to add tags from image ID=${imageId}`, error })

        return { success: false, error }
    }
}

export async function removeImage(imageId: string) {
    try {
        await transactionalFileAndDB(async (undoStack) => {
            deleteImage(imageId)

            const imagePath = getImagePath(imageId)
            const thumbnailPath = getThumbnailPath(imageId)

            if (imagePath && fs.existsSync(imagePath)) {
                const backup = imagePath + '.bak'

                fs.renameSync(imagePath, backup)
                undoStack.push(async () => fs.renameSync(backup, imagePath))
                fs.unlinkSync(imagePath + '.bak')
            }

            if (thumbnailPath && fs.existsSync(thumbnailPath)) {
                const backup = thumbnailPath + '.bak'

                fs.renameSync(thumbnailPath, backup)
                undoStack.push(async () => fs.renameSync(backup, thumbnailPath))
                fs.unlinkSync(thumbnailPath + '.bak')
            }
        })

        return { success: true }
    } catch (error) {
        logError({ message: `Failed to delete image ID=${imageId}`, error })

        return { success: false, error }
    }
}
