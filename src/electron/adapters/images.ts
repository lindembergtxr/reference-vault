export const adaptDBImageToInternal = (image: ExpandedImage): InternalImage => ({
    id: image.id,
    imagePath: image.image_path,
    thumbnail: {
        path: image.thumbnail_path,
        width: image.width,
        height: image.height,
        aspectRatio: image.aspectRatio,
    },
    groupId: image.group_id,
    situation: image.situation,
    tags: JSON.parse(image.tags),
})
