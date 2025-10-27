import { ImageDB } from '../types/database.js'

export const adaptDBImageToInternal = (image: ImageDB): InternalImage => ({
    id: image.id,
    imagePath: image.image_path,
    thumbnailPath: image.thumbnail_path,
    artistId: image.artist_id,
    groupId: image.group_id,
    tags: JSON.parse(image.tags),
})
