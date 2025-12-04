import path from 'path'

import { getDestinationFolder } from '../config/workspace.js'

export function getImagePath(imageId: string) {
    const folder = getDestinationFolder('images')

    return path.join(folder, imageId)
}

export function getThumbnailPath(imageId: string) {
    const folder = getDestinationFolder('thumbnails')

    return path.join(folder, imageId)
}

export function resolveImagePaths(imageId: string) {
    const thumbs = getDestinationFolder('thumbnails')
    const images = getDestinationFolder('images')

    return {
        thumbs,
        images,
        thumbnailPath: path.join(thumbs, imageId),
        imagePath: path.join(images, imageId),
    }
}
