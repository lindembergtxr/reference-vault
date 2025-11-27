export const parseTag = (tag: InternalTag) => {
    return `${tag.id}${tag.franchise ? `_(${tag.franchise})` : ''}`
}
