import { getDB } from '../../database/index.js'
import { logError } from '../../utils/errors.js'
import { adaptInternalTabToDB } from './tags.adapters.js'

import { alterTagValues, deleteTagsAndCascadeRelations } from './tags.services.js'

export async function removeTags({ tagIds }: RemoveTagsPayload) {
    if (tagIds.length === 0) return { success: true }

    const db = getDB()

    try {
        db.prepare('BEGIN').run()

        deleteTagsAndCascadeRelations(tagIds)

        db.prepare('COMMIT').run()

        return { success: true }
    } catch (error) {
        db.prepare('ROLLBACK').run()

        logError({ message: 'Failed to remove tags', error })

        return { success: false, error }
    }
}

export async function updateTag(tag: InternalTag) {
    const db = getDB()

    try {
        db.prepare('BEGIN').run()

        alterTagValues(adaptInternalTabToDB(tag))

        db.prepare('COMMIT').run()

        return { success: true }
    } catch (error) {
        db.prepare('ROLLBACK').run()

        logError({ message: `Failed to update tag ID=${tag.id}`, error })

        return { success: false }
    }
}
