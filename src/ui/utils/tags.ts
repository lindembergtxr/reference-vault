export function parseTag(tag: InternalTagNew) {
    if (!tag?.name) return ''
    return `${tag.name.replaceAll('_', ' ')}${tag.franchise ? ` (${tag.franchise.replaceAll('_', ' ')})` : ''}`
}

export function parseTagFull(tag: InternalTagNew) {
    if (!tag?.name) return ''
    return `${tag.name.replaceAll('_', ' ')},  category:${tag.category.replaceAll('_', ' ')}${tag.franchise ? `,  franchise:${tag.franchise.replaceAll('_', ' ')}` : ''}`
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
