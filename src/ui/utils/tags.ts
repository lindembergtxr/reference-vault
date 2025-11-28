export const parseTag = (tag: InternalTag) => {
    return `${tag.name}${tag.franchise ? `_(${tag.franchise})` : ''}`
}
