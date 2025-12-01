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
            const report: HealthReport = {
                totalImages: countAllImages(),
                database: generateImageDBReport(),
                imagesFolder: generateImageFileReport('images'),
                thumbnailFolder: generateImageFileReport('thumbnails'),
            }
            return { success: true, data: report }
        })
    } catch (error) {
        logError({ message: 'Failed to generate report', error })
        return { success: false, error }
    }
}
