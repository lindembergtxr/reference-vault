import { db } from '../../database/index.js'
import { logError } from '../../utils/errors.js'
import { getImagesIdsByTagIds, syncImageMetadata } from '../images/index.js'

import { alterTagValues, deleteTagsAndCascadeRelations } from './tags.services.js'

export async function removeTags({ tagIds }: RemoveTagsPayload) {
    if (tagIds.length === 0) return { success: true }

    try {
        db.prepare('BEGIN').run()

        const imageIds = await getImagesIdsByTagIds(tagIds)

        deleteTagsAndCascadeRelations(tagIds)

        db.prepare('COMMIT').run()

        for (const imageId of imageIds) {
            try {
                await syncImageMetadata(imageId)
            } catch (error) {
                logError({ message: `Failed to sync image ${imageId}`, error })
            }
        }
        return { success: true }
    } catch (error) {
        db.prepare('ROLLBACK').run()

        logError({ message: 'Failed to remove tags', error })

        return { success: false, error }
    }
}

export async function updateTag(tag: InternalTag) {
    try {
        await alterTagValues(tag)
        return { success: true }
    } catch (error) {
        logError({ message: `Failed to update tag ID=${tag.id}`, error })
        return { success: false }
    }
}
