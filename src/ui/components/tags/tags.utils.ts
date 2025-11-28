import { type CSVTag } from './tags.type'

export const CATEGORY_SHORTCUTS: Record<number, TagCategory> = {
    1: 'general',
    2: 'artist',
    3: 'character',
    4: 'copyright',
    5: 'meta',
}

export const VALID_CATEGORIES = Object.values(CATEGORY_SHORTCUTS)

export const parseCsv = (text: string): CSVTag[] => {
    if (!text) return []

    const lines = text.split('\n')

    return lines.map((line, index): CSVTag => {
        const parts = line.split(',')

        const result: CSVTag = {
            name: parts[0]?.trim() || '',
            category: parts[1]?.trim() as TagCategory,
            franchise: parts[2]?.trim() || '',
            line: index + 2,
        }

        if (!result.name) {
            result.error = 'name required'
        } else if (!VALID_CATEGORIES.includes(result.category)) {
            result.error = 'invalid category'
        }
        return result
    })
}

export const CSVTagToInternalTag = (tag: CSVTag): InternalTagNew => ({
    id: null,
    name: tag.name,
    category: tag.category,
    franchise: tag.franchise,
})

export const parseTagToCSVString = (tag: InternalTag | CSVTag): string => {
    if (!tag) return ''

    return `${tag.name.replaceAll('_', ' ')}, ${tag.category}${tag.franchise ? `, ${tag.franchise}` : ''}`
}

export const parseTagString = (input: string) => {
    input = input.trim()

    let franchise = ''
    let tagName = ''

    const colonIndex = input.indexOf(':')

    if (colonIndex !== -1) {
        franchise = input.slice(0, colonIndex).trim() ?? ''
        tagName = input.slice(colonIndex + 1).trim()
    } else {
        tagName = input
    }

    tagName = tagName.replace(/_+/g, ' ').trim().toLowerCase().replace(/\s+/g, '_')

    return { franchise, name: tagName }
}

export const validateTagsCSV = (text: string): boolean => {
    const parsedList = parseCsv(text)

    return parsedList.some((item) => item.error)
}
