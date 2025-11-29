import path from 'path'
import sharp from 'sharp'

import { getDestinationFolder } from '../../config/index.js'

export const createThumbOnFolder = async (src: string, outputPath: string) => {
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
