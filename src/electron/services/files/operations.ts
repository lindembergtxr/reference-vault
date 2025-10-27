import fs from 'fs/promises'
import path from 'path'
import * as utils from '../../utils/index.js'

type Mode = 'move' | 'copy'

type FileToFolderHandler = {
    src: string
    destination: string
    mode: Mode
}
const fileToFolderHandler = async ({ src, destination, mode }: FileToFolderHandler) => {
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
                await utils.logError({ message: utils.errorMessages['FailedToMoveFile'](), error })
                throw utils.generateError('FailedToMoveFile')
            }
        } else {
            const message = utils.errorMessages['UnknownErrorWhenMovingFile']()
            await utils.logError({ message, error })
            throw utils.generateError('UnknownErrorWhenMovingFile')
        }
    }
}

export const moveFileToFolder = (src: string, destination: string) => {
    fileToFolderHandler({ src, destination, mode: 'move' })
}

export const copyFileToFolder = (src: string, destination: string) => {
    fileToFolderHandler({ src, destination, mode: 'copy' })
}
