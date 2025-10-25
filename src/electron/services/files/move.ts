import fs from 'fs/promises'
import path from 'path'

type Mode = 'move' | 'copy'

type FileToFolderHandler = {
    src: string
    destination: string
    mode: Mode
}
const fileToFolderHandler = async ({
    src,
    destination,
    mode,
}: FileToFolderHandler) => {
    const dirname = path.dirname(destination)

    await fs.mkdir(dirname, { recursive: true })

    try {
        if (mode === 'move') await fs.rename(src, destination)
        else await fs.copyFile(src, destination)
    } catch (error: unknown) {
        if (error instanceof Error) {
            const e = error as NodeJS.ErrnoException

            if (e.code === 'EXDEV') {
                await fs.copyFile(src, destination)

                if (mode === 'move') await fs.unlink(src)
            } else {
                console.error('Failed to move file:', e)
                throw e
            }
        } else {
            console.error('Unknown error moving file:', error)

            throw error
        }
    }
}

export const moveFileToFolder = (src: string, destination: string) => {
    fileToFolderHandler({ src, destination, mode: 'move' })
}

export const copyFileToFolder = (src: string, destination: string) => {
    fileToFolderHandler({ src, destination, mode: 'copy' })
}
