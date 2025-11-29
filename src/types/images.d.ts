type ImageSituation = 'pending' | 'committed' | 'completed'

interface InternalImage<T = InternalTag> {
    id: string
    imagePath: string | null
    thumbnailPath: string | null
    groupId: string | null
    tags: T[]
    situation: ImageSituation
}
