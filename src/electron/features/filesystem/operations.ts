import fs from 'fs/promises'
import fsSync from 'fs'
import path from 'path'
import sharp from 'sharp'

import * as utils from '../../utils/index.js'
import { getTemporaryFolderPath } from './filesystem.utils.js'
import { copyImageToFolder } from '../images/storage.js'

type FileToFolderHandler = {
    src: string
    destination: string
    mode: 'move' | 'copy'
}
async function fileToFolderHandler({ src, destination, mode }: FileToFolderHandler) {
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

export async function moveFileToFolder(src: string, destination: string) {
    await fileToFolderHandler({ src, destination, mode: 'move' })
}

export async function copyFileToFolder(src: string, destination: string) {
    await fileToFolderHandler({ src, destination, mode: 'copy' })
}

export async function copyImageWithCleanup(src: string, destination: string) {
    const ext = path.extname(src).toLowerCase()
    const tempFolder = getTemporaryFolderPath('temporary')

    let fileToCopy = src

    let result: { filename: string; destination: string }

    try {
        await fs.mkdir(tempFolder, { recursive: true })

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

        result = await copyImageToFolder(fileToCopy, destination)
    } finally {
        if (fileToCopy !== src && fsSync.existsSync(fileToCopy)) {
            await fs.unlink(fileToCopy)
        }
    }
    return result
}
