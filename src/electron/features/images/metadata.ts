import { ExiftoolProcess } from 'node-exiftool'

import { logError } from '../../utils/errors.js'
import { getImagePath } from './images.utils.js'
import { getTagsForImage } from './images.services.js'

const epProcess = new ExiftoolProcess()

type WriteImageMetadataArgs = {
    filepath: string
    tags: InternalTag[]
}
async function writeImageMetadata({ filepath, tags }: WriteImageMetadataArgs) {
    await epProcess.open()

    const jsonData = tags
        .map(({ name, category, franchise }) => ({ name, category, franchise }))
        .sort((tagA, tagB) => {
            if (tagA.category < tagB.category) return -1
            if (tagA.category > tagB.category) return 1
            return 0
        })

    const data = { UserComment: JSON.stringify(jsonData) }

    await epProcess.writeMetadata(filepath, data, ['overwrite_original'])

    await epProcess.close()
}

export async function syncImageMetadata(imageId: string) {
    try {
        const filepath = await getImagePath(imageId)
        const tags = getTagsForImage(imageId)

        writeImageMetadata({ tags, filepath })
    } catch (error) {
        logError({ message: 'Failed to write image metadata', error })
    }
}
