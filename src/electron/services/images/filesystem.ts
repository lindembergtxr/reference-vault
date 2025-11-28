import path from 'path'
import pLimit from 'p-limit'

import { copyFileToFolder } from '../files/operations.js'
import * as utils from '../../utils/index.js'

export type ImageTransaction = {
    filename: string
    destination: string
    origin: string
}

export const copyImageToFolder = async (url: string, destination: string) => {
    const extension = path.extname(url)
    const filename = `${utils.generateId()}${extension}`
    const destinationPath = path.join(destination, filename)

    await copyFileToFolder(url, destinationPath)

    return { filename, destination: destinationPath, origin: url }
}

type CopyImagesToFolder = {
    urls: string[]
    destinationPath: string
}
export const copyImagesToFolder = async ({ urls, destinationPath }: CopyImagesToFolder) => {
    const concurrency = Number(process.env.VITE_CONCURRENCY_LIMIT) || 5
    const limit = pLimit(concurrency)

    const promises = urls.map((url) =>
        limit(async () => {
            const extension = path.extname(url)
            const filename = `${utils.generateId()}${extension}`
            const destination = path.join(destinationPath, filename)

            copyFileToFolder(url, destination)

            return { filename, destination, origin: url }
        })
    )
    return Promise.allSettled(promises)
}

export const copyImagesToTempFolder = async (urls: string[]) => {
    const destinationPath = await utils.getTemporaryFolderPath('images')
    return await copyImagesToFolder({ urls, destinationPath })
}
