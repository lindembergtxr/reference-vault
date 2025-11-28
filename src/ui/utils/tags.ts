export const parseTag = (tag: InternalTagNew) => {
    if (!tag?.name) return ''
    return `${tag.name.replaceAll('_', ' ')}${tag.franchise ? ` (${tag.franchise.replaceAll('_', ' ')})` : ''}`
}
