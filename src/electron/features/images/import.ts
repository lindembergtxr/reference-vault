import * as utils from '../../utils/index.js'
import * as filesystem from '../filesystem/index.js'

import { upsertImage } from './images.services.js'
import { createThumbnailFromImage } from './thumbnail.js'
import { transactionalFileAndDB } from '../filesystem/lock.js'

export async function importFromFolder() {
    const folderPath = await filesystem.selectFolder()

    if (!folderPath) return

    const fileURLs = filesystem.getFolderImages(folderPath)
    const failures: string[] = []

    let success = 0

    for (const url of fileURLs) {
        try {
            await transactionalFileAndDB(async (undoStack) => {
                const path = filesystem.getTemporaryFolderPath('images')
                const outputDir = filesystem.getTemporaryFolderPath('thumbnails')

                const { filename, destination } = await filesystem.copyImageWithCleanup(url, path)

                undoStack.push(() => filesystem.safeDelete(destination))

                const thumbnailPath = createThumbnailFromImage({
                    url: destination,
                    outputDir,
                })
                undoStack.push(() => filesystem.safeDelete(thumbnailPath))

                upsertImage({
                    id: filename,
                    thumbnailPath: outputDir,
                    imagePath: destination,
                    groupId: null,
                    situation: 'pending',
                })

                success++
            })
        } catch (error) {
            failures.push(url)

            utils.logError({ message: `Failed to create image ${url}`, error })
        }
    }

    if (failures.length > 0) {
        utils.logError({ message: `${failures.length} files failed`, error: failures })
        console.warn(failures, 'FAILURES!')
    }

    console.log(`SUCCESS! Imported ${success} files.`)
}
