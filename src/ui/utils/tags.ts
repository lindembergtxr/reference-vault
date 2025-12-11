import { customAlphabet } from 'nanoid'

export function parseTag(tag: InternalTagNew) {
    if (!tag?.name) return ''
    return `${tag.name.replaceAll('_', ' ')}${tag.franchise ? ` (${tag.franchise.replaceAll('_', ' ')})` : ''}`
}

export function normalize(text: string) {
    if (!text) return ''
    return text
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[_\s]+/g, ' ')
        .trim()
}

export function generateId() {
    const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'

    const nanoid = customAlphabet(alphabet, 12)

    return nanoid(12)
}
