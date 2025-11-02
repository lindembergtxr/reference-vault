import { TagDB } from '../types/database.js'

export const adaptDBTagToInternal = (tag: TagDB): InternalTag => ({
    id: tag.id,
    name: tag.name,
    franchise: tag.franchise,
})

export const adaptInternalTabToDB = (tag: InternalTag): TagDB => ({
    id: tag.id,
    name: tag.name,
    franchise: tag.franchise ?? null,
})
