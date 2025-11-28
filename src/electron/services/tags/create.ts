import { logError } from '../../utils/errors.js'
import { batchCreateTags } from './database.js'

export const addTags = async (tags: InternalTagNew[]) => {
    try {
        await batchCreateTags(tags)
    } catch (error) {
        logError({ error, message: 'Error when creating tags.' })
    }
}
