import { logError } from '../../utils/errors.js'
import { withUnlockedFilesystem } from '../filesystem/lock.js'
import {
    countAllImages,
    generateImageDBReport,
    generateImageFileReport,
} from './images.services.js'

export async function generateHealthReport() {
    try {
        return withUnlockedFilesystem(async () => {
            const totalImages = countAllImages()
            const database = await generateImageDBReport()
            const imagesFolder = await generateImageFileReport('images')
            const thumbnailFolder = await generateImageFileReport('thumbnails')

            const report: HealthReport = { database, imagesFolder, thumbnailFolder, totalImages }

            return { success: true, data: report }
        })
    } catch (error) {
        logError({ message: 'Failed to generate report', error })
        return { success: false, error }
    }
}
