import { TagDB } from '../types/database.js'
import { assertValidCategory, generateId, normalizeIdentifier } from '../utils/index.js'

export const adaptDBTagToInternal = (tag: TagDB): InternalTag => ({
    id: tag.id,
    name: tag.name,
    franchise: tag.franchise,
    category: tag.category,
})

export const adaptInternalTabToDB = (tag: InternalTag | InternalTagNew): TagDB => ({
    id: tag.id ?? generateId(),
    name: normalizeIdentifier(tag.name),
    franchise: normalizeIdentifier(tag.franchise ?? ''),
    category: assertValidCategory(tag.category),
})
