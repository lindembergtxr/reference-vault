import sharp from 'sharp'

export const createThumbOnFolder = async (src: string, outputPath: string) => {
    await sharp(src).resize(256, 256, { fit: 'inside' }).toFile(outputPath)
}
