type HealthReport = {
    totalImages: number
    database: Array<{
        id: string
        missingImage: boolean
        missingThumb: boolean
    }>
    imagesFolder: string[]
    thumbnailFolder: string[]
}
