export const parseTag = (tag: InternalTagNew) => {
    if (!tag?.name) return ''
    return `${tag.name.replaceAll('_', ' ')}${tag.franchise ? ` (${tag.franchise.replaceAll('_', ' ')})` : ''}`
}

export const parseTagFull = (tag: InternalTagNew) => {
    if (!tag?.name) return ''
    return `${tag.name.replaceAll('_', ' ')},  category:${tag.category.replaceAll('_', ' ')}${tag.franchise ? `,  franchise:${tag.franchise.replaceAll('_', ' ')}` : ''}`
}
