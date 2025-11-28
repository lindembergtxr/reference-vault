import * as utils from '../../utils/index.js'
import { upsertImage } from '../images/database.js'
import { createThumbnailFromImage } from '../images/thumbnail.js'
import { copyImageToFolder } from '../images/filesystem.js'

async function rollback(undoStack: Array<() => Promise<void>>) {
    for (let i = undoStack.length - 1; i >= 0; i--) {
        try {
            await undoStack[i]()
        } catch (error) {
            utils.logError({ message: 'Rollback failed step:', error })
        }
    }
}

export async function importFromFolder() {
    const folderPath = await utils.selectFolder()

    if (!folderPath) return

    const fileURLs = await utils.getFolderImages(folderPath)
    const failures: string[] = []

    let success = 0

    for (const url of fileURLs) {
        const undoStack: (() => Promise<void>)[] = []

        try {
            const path = await utils.getTemporaryFolderPath('images')

            const { filename, destination } = await copyImageToFolder(url, path)

            undoStack.push(() => utils.safeDelete(destination))

            const thumbnailPath = await createThumbnailFromImage(destination)

            undoStack.push(() => utils.safeDelete(thumbnailPath))

            await upsertImage({
                id: filename,
                thumbnail: { path: thumbnailPath },
                imagePath: destination,
                groupId: null,
                situation: 'pending',
            })

            success++
        } catch (error) {
            await rollback(undoStack)
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
