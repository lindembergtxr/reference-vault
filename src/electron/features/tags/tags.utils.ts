import { logError } from '../../utils/errors.js'

const VALID_CATEGORIES = new Set(['general', 'character', 'artist', 'copyright', 'meta'])

export const normalizeIdentifier = (input: string): string => {
    if (!input) return ''

    return input
        .trim()
        .toLowerCase()
        .normalize('NFKD') // separate accents
        .replace(/[\u0300-\u036f]/g, '') // remove accents
        .replace(/[^a-z0-9]+/g, '_') // replace all non alphanumeric with _
        .replace(/^_+|_+$/g, '') // remove leading underscore
}

export const assertValidCategory = (input: string): TagCategory => {
    if (!VALID_CATEGORIES.has(input)) {
        logError({ message: 'Invalid category', error: new Error(`Invalid category: ${input}`) })
    }
    return input as TagCategory
}
