import { TagDB } from '../types/database.js'
import { assertValidCategory, normalizeIdentifier } from '../utils/index.js'

export const adaptDBTagToInternal = (tag: TagDB): InternalTag => ({
    id: tag.id,
    franchise: tag.franchise,
    category: tag.category,
})

export const adaptInternalTabToDB = (tag: InternalTag): TagDB => ({
    id: normalizeIdentifier(tag.id) ?? '',
    franchise: normalizeIdentifier(tag.franchise ?? ''),
    category: assertValidCategory(tag.category),
})
