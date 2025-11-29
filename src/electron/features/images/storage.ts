import path from 'path'
import pLimit from 'p-limit'

import { copyFileToFolder } from '../filesystem/operations.js'
import * as utils from '../../utils/index.js'
import { getTemporaryFolderPath } from '../filesystem/index.js'

export async function copyImageToFolder(url: string, destination: string) {
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
export async function copyImagesToFolder({ urls, destinationPath }: CopyImagesToFolder) {
    const concurrency = Number(process.env.VITE_CONCURRENCY_LIMIT) || 5
    const limit = pLimit(concurrency)

    const promises = urls.map((url) =>
        limit(async () => {
            const extension = path.extname(url)
            const filename = `${utils.generateId()}${extension}`
            const destination = path.join(destinationPath, filename)

            await copyFileToFolder(url, destination)

            return { filename, destination, origin: url }
        })
    )
    return Promise.allSettled(promises)
}

export async function copyImagesToTempFolder(urls: string[]) {
    const destinationPath = await getTemporaryFolderPath('images')

    return await copyImagesToFolder({ urls, destinationPath })
}
