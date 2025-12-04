import fs from 'fs'
import path from 'path'
import sharp from 'sharp'

import * as utils from '../../utils/index.js'
import { copyImageToFolder } from '../images/storage.js'
import { getTemporaryFolderPath } from '../config/config.js'

type FileToFolderHandler = {
    src: string
    destination: string
    mode: 'move' | 'copy'
}
function fileToFolderHandler({ src, destination, mode }: FileToFolderHandler) {
    const dirname = path.dirname(destination)

    fs.mkdirSync(dirname, { recursive: true })

    try {
        if (mode === 'move') fs.renameSync(src, destination)
        else fs.copyFileSync(src, destination)
    } catch (error: unknown) {
        if (error instanceof Error) {
            const e = error as NodeJS.ErrnoException

            if (e.code === 'EXDEV') {
                fs.copyFileSync(src, destination)

                if (mode === 'move') fs.unlinkSync(src)
            } else {
                utils.logError({ message: utils.errorMessages['FailedToMoveFile'](), error })

                throw utils.generateError('FailedToMoveFile')
            }
        } else {
            const message = utils.errorMessages['UnknownErrorWhenMovingFile']()

            utils.logError({ message, error })

            throw utils.generateError('UnknownErrorWhenMovingFile')
        }
    }
}

export function moveFileToFolder(src: string, destination: string) {
    return fileToFolderHandler({ src, destination, mode: 'move' })
}

export function copyFileToFolder(src: string, destination: string) {
    return fileToFolderHandler({ src, destination, mode: 'copy' })
}

export async function copyImageWithCleanup(src: string, destination: string) {
    const ext = path.extname(src).toLowerCase()
    const tempFolder = getTemporaryFolderPath('temporary')

    let fileToCopy = src

    let result: { filename: string; destination: string }

    try {
        fs.mkdirSync(tempFolder, { recursive: true })

        if (['.png', '.jpeg', '.jpg'].includes(ext)) {
            const tempFile = path.join(tempFolder, `${utils.generateId()}.jpg`)
            const img = sharp(src)
            const metadata = await img.metadata()

            if (metadata.hasAlpha) {
                await img
                    .flatten({ background: { r: 255, g: 255, b: 255 } })
                    .jpeg({ quality: 85 })
                    .toFile(tempFile)
            } else {
                await img.jpeg({ quality: 85 }).toFile(tempFile)
            }
            fileToCopy = tempFile
        }

        result = copyImageToFolder(fileToCopy, destination)
    } finally {
        if (fileToCopy !== src && fs.existsSync(fileToCopy)) fs.unlinkSync(fileToCopy)
    }
    return result
}
