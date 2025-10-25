import fs from 'fs/promises'
import path from 'path'

export const createFolder = async (directory: string) => {
    await fs.mkdir(directory, { recursive: true })
}

export const getFolderImages = async (src: string): Promise<string[]> => {
    const imageRegex = /\.(jpe?g|png|gif|webp|bmp|tiff)$/i

    const files = await fs.readdir(src)

    const fileURLs = files
        .filter((file) => imageRegex.test(file))
        .map((file) => path.join(src, file))

    return fileURLs
}
