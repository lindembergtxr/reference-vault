type TagCategory = 'copyright' | 'character' | 'artist' | 'general' | 'meta'

type InternalTag = {
    id: string
    franchise: string
    category: TagCategory
}
