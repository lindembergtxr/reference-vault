import { logError } from '../../utils/errors.js'

import { createTags } from './tags.services.js'

export const addTags = async (tags: InternalTagNew[]) => {
    try {
        await createTags(tags)
    } catch (error) {
        logError({ error, message: 'Error when creating tags.' })
    }
}
