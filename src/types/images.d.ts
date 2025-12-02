type ImageSituation = 'pending' | 'committed' | 'completed'

interface InternalImage<T = InternalTag> {
    id: string
    imagePath: string | null
    thumbnailPath: string | null
    groupId: string | null
    tags: T[]
    situation: ImageSituation
}

type GetImagesSearchArgs = {
    include?: string[]
    exclude?: string[]
}

type ImageTagsChangeArgs = {
    imageId: string
    tags: InternalTagNew[]
}
