export type ImageDB = {
    id: string
    thumbnail_path: string | null
    image_path: string | null
    group_id: string | null
    tags: string
    situation: ImageSituation
}

export type TagDB = {
    id: string
    name: string
    franchise: string
    category: TagCategory
}
