type ImageSituation = 'pending' | 'committed'

type InternalImage = {
    id: string
    thumbnailPath: string | null
    imagePath: string | null
    artistId: string | null
    groupId: string | null
    tags: InternalTag[]
    situation: ImageSituation
}
