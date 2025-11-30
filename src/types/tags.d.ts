type TagCategory = 'copyright' | 'character' | 'artist' | 'general' | 'meta'

type InternalTag = {
    id: string
    name: string
    franchise: string
    category: TagCategory
}

type InternalTagNew = {
    id: string | null
    name: string
    franchise: string
    category: TagCategory
}

type RemoveTagsPayload = {
    tagIds: string[]
}
