import { generateId, normalize } from '../../utils'
import { type CSVTag } from './tags.type'

export const CATEGORY_SHORTCUTS: Record<number, TagCategory> = {
    1: 'general',
    2: 'artist',
    3: 'character',
    4: 'copyright',
    5: 'meta',
}

export const VALID_CATEGORIES = Object.values(CATEGORY_SHORTCUTS)

export function parseCsv(text: string): CSVTag[] {
    if (!text) return []

    const lines = text.split('\n')

    return lines.map((line, index): CSVTag => {
        const parts = line.split(',')

        const result: CSVTag = {
            id: generateId(),
            name: parts[0]?.trim() || '',
            category: parts[1]?.trim() as TagCategory,
            franchise: parts[2]?.trim() || '',
            line: index + 2,
        }

        if (!result.name) {
            result.error = 'name required'
        } else if (!VALID_CATEGORIES.includes(result.category)) {
            result.error = 'invalid category'
        } else if (parts.length > 3) {
            result.error = 'invalid format'
        }
        return result
    })
}

export function CSVTagToInternalTag(tag: CSVTag): InternalTagNew {
    return {
        id: null,
        name: tag.name,
        category: tag.category,
        franchise: tag.franchise,
    }
}

export function parseTagToCSVString(tag: InternalTag | CSVTag): string {
    if (!tag) return ''

    return `${tag.name.replaceAll('_', ' ')}, ${tag.category.replaceAll('_', ' ')}${tag.franchise ? `, ${tag.franchise.replaceAll('_', ' ')}` : ''}`
}

export function parseTagToFullString(tag: InternalTag | CSVTag): string {
    if (!tag) return ''

    return `NAME=${tag.name}, CATEGORY=${tag.category}${tag.franchise ? `, FRANCHISE=${tag.franchise}` : ''}`
}

export function parseTagString(input: string) {
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

function pad(n: number, width = 4) {
    const s = String(Math.max(0, Math.floor(n)))
    return s.padStart(width, '0')
}

function levenshtein(a: string, b: string): number {
    const m = a.length,
        n = b.length
    if (m === 0) return n
    if (n === 0) return m

    const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0))

    for (let i = 0; i <= m; i++) dp[i][0] = i
    for (let j = 0; j <= n; j++) dp[0][j] = j
    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            const cost = a[i - 1] === b[j - 1] ? 0 : 1
            dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost)
        }
    }
    return dp[m][n]
}

export function filterTagFunction(tags: InternalTag[]) {
    return (inputValue: string) => {
        if (!inputValue || inputValue.length < 2) return []

        const needle = normalize(inputValue)

        const mapped = tags.map((tag) => {
            const name = normalize(tag.name)
            const franchise = normalize(tag.franchise ?? '')
            const category = normalize(tag.category ?? '')

            const namePos = name.indexOf(needle)
            const franPos = franchise.indexOf(needle)

            const nameMatch = namePos !== -1
            const franchiseMatch = franPos !== -1

            if (!nameMatch && !franchiseMatch) return null

            const primaryPriority = nameMatch ? 0 : 1

            const pos = nameMatch ? namePos : franchiseMatch ? franPos : 9999

            const slice = nameMatch
                ? name.slice(namePos, namePos + Math.max(needle.length, 1))
                : franchiseMatch
                  ? franchise.slice(franPos, franPos + Math.max(needle.length, 1))
                  : ''
            const dist = slice ? levenshtein(needle, slice) : 9999

            const nameLen = tag.name.length

            const sortKey = [
                pad(primaryPriority, 1),
                pad(pos, 4),
                pad(dist, 3),
                pad(nameLen, 4),
                category || 'zzzz',
                normalize(tag.name),
            ].join('|')

            return { tag, sortKey, primaryPriority, pos, dist, nameLen, category }
        })

        return mapped
            .filter((x): x is NonNullable<typeof x> => x != null)
            .sort((a, b) => a.sortKey.localeCompare(b.sortKey))
            .map((x) => x.tag)
    }
}
