import { ImageDB } from '../types/database.js'

export const adaptDBImageToInternal = (image: ImageDB): InternalImage => ({
    id: image.id,
    imagePath: image.image_path,
    thumbnailPath: image.thumbnail_path,
    groupId: image.group_id,
    situation: image.situation,
    tags: JSON.parse(image.tags),
})
