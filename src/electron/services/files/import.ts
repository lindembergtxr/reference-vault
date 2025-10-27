import * as utils from '../../utils/index.js'
import { batchAddImages } from '../images/database.js'
import { batchCreateThumbnails } from '../images/thumbnail.js'
import { copyImagesToTempFolder } from '../images/filesystem.js'

export const importFromFolder = async () => {
    const folderPath = await utils.selectFolder()

    if (!folderPath) return

    const fileURLs = await utils.getFolderImages(folderPath)
    const failures = []

    const moveImagesResults = await copyImagesToTempFolder(fileURLs)

    failures.push(...utils.getRejected(moveImagesResults, 'copyImagesToTempFolder'))

    const successfulImages = utils
        .getFulfilled(moveImagesResults)
        .map((result) => ({ url: result.destination, filename: result.filename }))

    const createThumbnailsResults = await batchCreateThumbnails(successfulImages)

    failures.push(...utils.getRejected(createThumbnailsResults, 'batchCreateThumbnails'))

    const successfulThumbnails: InternalImage[] = utils
        .getFulfilled(createThumbnailsResults)
        .map((result) => {
            return {
                id: result.filename,
                thumbnailPath: result.thumbnail,
                imagePath: result.image,
                artistId: null,
                groupId: null,
                tags: [],
            }
        })

    const addImagesResults = await batchAddImages(successfulThumbnails)

    failures.push(...utils.getRejected(addImagesResults, 'batchAddImages'))

    if (failures.length > 0) console.log(failures, 'FAILURES!!!!')
    console.log(`SUCCESS! Imported ${addImagesResults.length} files.`)
}
