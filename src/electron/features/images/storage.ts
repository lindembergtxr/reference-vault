import path from 'path'
import pLimit from 'p-limit'

import * as utils from '../../utils/index.js'
import { copyFileToFolder } from '../filesystem/index.js'
import { getTemporaryFolderPath } from '../config/config.js'

export function copyImageToFolder(url: string, destination: string) {
    const extension = path.extname(url)
    const filename = `${utils.generateId()}${extension}`
    const destinationPath = path.join(destination, filename)

    copyFileToFolder(url, destinationPath)

    return { filename, destination: destinationPath, origin: url }
}

type CopyImagesToFolder = {
    urls: string[]
    destinationPath: string
}
export function copyImagesToFolder({ urls, destinationPath }: CopyImagesToFolder) {
    const concurrency = Number(process.env.VITE_CONCURRENCY_LIMIT) || 5
    const limit = pLimit(concurrency)

    return urls.map((url) =>
        limit(() => {
            const extension = path.extname(url)
            const filename = `${utils.generateId()}${extension}`
            const destination = path.join(destinationPath, filename)

            copyFileToFolder(url, destination)

            return { filename, destination, origin: url }
        })
    )
}

export function copyImagesToTempFolder(urls: string[]) {
    const destinationPath = getTemporaryFolderPath('images')

    return copyImagesToFolder({ urls, destinationPath })
}
