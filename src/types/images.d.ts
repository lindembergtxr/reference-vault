type ImageSituation = 'pending' | 'committed'

type ExpandedImage = ImageDB & {
    width: number
    height: number
    aspectRatio: number
}

type InternalImage = {
    id: string
    imagePath: string | null
    thumbnail: {
        path: string | null
        width?: number
        height?: number
        aspectRatio?: number
    }
    groupId: string | null
    tags: InternalTag[]
    situation: ImageSituation
}
