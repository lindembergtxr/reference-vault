export const parseTag = (tag: InternalTagNew) => {
    return `${tag.name}${tag.franchise ? `_(${tag.franchise})` : ''}`
}
