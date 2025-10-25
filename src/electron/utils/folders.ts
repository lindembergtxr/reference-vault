import fs from 'fs/promises'

export const createFolder = async (directory: string) => {
    await fs.mkdir(directory, { recursive: true })
}
