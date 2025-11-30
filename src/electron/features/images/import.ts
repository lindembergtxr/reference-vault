import * as utils from '../../utils/index.js'
import * as filesystem from '../filesystem/index.js'
import { db } from '../../database/index.js'

import { upsertImage } from './images.services.js'
import { createThumbnailFromImage } from './thumbnail.js'

export async function importFromFolder() {
    const folderPath = await filesystem.selectFolder()

    if (!folderPath) return

    const fileURLs = await filesystem.getFolderImages(folderPath)
    const failures: string[] = []

    let success = 0

    for (const url of fileURLs) {
        const undoStack: (() => Promise<void>)[] = []

        try {
            const path = await filesystem.getTemporaryFolderPath('images')
            const outputDir = await filesystem.getTemporaryFolderPath('thumbnails')

            const { filename, destination } = await filesystem.copyImageWithCleanup(url, path)

            undoStack.push(() => filesystem.safeDelete(destination))

            const thumbnailPath = await createThumbnailFromImage({ url: destination, outputDir })

            undoStack.push(() => filesystem.safeDelete(thumbnailPath))

            db.prepare('BEGIN').run()

            try {
                await upsertImage({
                    id: filename,
                    thumbnailPath,
                    imagePath: destination,
                    groupId: null,
                    situation: 'pending',
                })
                db.prepare('COMMIT').run()
            } catch (error) {
                db.prepare('ROLLBACK').run()
                throw error
            }

            success++
        } catch (error) {
            await filesystem.rollback(undoStack)

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
