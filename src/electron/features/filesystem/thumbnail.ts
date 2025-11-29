import sharp from 'sharp'

export async function createThumbnailOnFolder(src: string, outputPath: string, size = 256) {
    await sharp(src).resize(size, size, { fit: 'inside' }).toFile(outputPath)
}
