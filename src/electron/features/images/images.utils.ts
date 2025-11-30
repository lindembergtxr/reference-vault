import path from 'path'
import sharp from 'sharp'

import { getDestinationFolder } from '../../config/index.js'

export async function getImagePath(imageId: string) {
    const folder = await getDestinationFolder('images')

    return path.join(folder, imageId)
}

export async function getThumbnailPath(imageId: string) {
    const folder = await getDestinationFolder('thumbnails')

    return path.join(folder, imageId)
}

export async function createThumbOnFolder(src: string, outputPath: string) {
    await sharp(src).resize(256, 256, { fit: 'inside' }).toFile(outputPath)
}

export async function resolveImagePaths(imageId: string) {
    const thumbs = await getDestinationFolder('thumbnails')
    const images = await getDestinationFolder('images')

    return {
        thumbs,
        images,
        thumbnailPath: path.join(thumbs, imageId),
        imagePath: path.join(images, imageId),
    }
}
